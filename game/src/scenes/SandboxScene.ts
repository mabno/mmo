import { io, Socket } from 'socket.io-client'
import Node from '../core/Node'
import AssetsManager from '../core/AssetsManager'
import AnimatedSprite from '../core/nodes/AnimatedSprite'
import Text from '../core/nodes/Text'
import SpriteSheet from '../core/SpriteSheet'
import Player from '../mynodes/Player'
import mapGen from '../mapGen'

import lighJson from '../anim/light.json'
import fireJson from '../anim/fire.json'
import Tree from '../mynodes/Tree'
import Rectangle from '../core/nodes/Rectangle'
import Map from '../mynodes/Map'
import { OBJECT_TILES } from '../constants/tiles'
import Water from '../mynodes/Water'
import AnotherPlayer from '../mynodes/AnotherPlayer'
import { PlayerPayload, AttackPayload } from '../types'
import SocketService from '../SocketService'
import { Vector2D } from '../core/interfaces'
import { DIRECTION_MOVEMENT } from '../constants/player'

class SandboxScene extends Node {
  indicatorsText: Text
  player?: Player
  playerLight: AnimatedSprite
  map: Map
  anotherPlayers: AnotherPlayer[] = []
  socketService: SocketService = SocketService.instance

  public enter(): void {
    super.enter()

    this.indicatorsText = new Text(
      { x: 5, y: this.viewport.height - 40 },
      'ddsfsd',
      {
        fillStyle: '#fff',
        font: 'OldSchoolAdventures',
        fontSize: 24,
        textAlign: 'left',
      },
      30
    )
    this.indicatorsText.compositeOperation = 'source-over'
    this.addNode(this.indicatorsText)

    this.camera = { x: 0, y: 0 }
    let map = mapGen(AssetsManager.instance.getImage('worldtest'), AssetsManager.instance.getImage('worldtestObjects'))

    this.map = new Map(map[0])

    map[1].forEach((row, y) => {
      row.forEach((col, x) => {
        if (col === OBJECT_TILES.TREE) {
          let tree = new Tree({ x: x * 64 + 16, y: y * 64 + 16 })
          this.addNode(tree)
        }
        if (col === OBJECT_TILES.WATER1) {
          let water = new Water({ x: x * 64, y: y * 64 }, 0)
          this.addNode(water)
        }
        if (col === OBJECT_TILES.WATER2) {
          let water = new Water({ x: x * 64, y: y * 64 }, 1)
          this.addNode(water)
        }
      })
    })

    this.addNode(this.map)

    this.socketService.onSocketConnect(() => {
      if (this.player) return
      const urlParams = new URLSearchParams(window.location.search)
      const username = urlParams.get('username') ?? 'guest'
      console.log('Connected')
      this.player = new Player({ x: 200, y: 150 })
      this.player.renderPriority = 2
      this.addNode(this.player)
      this.player.colliders = this.children.filter((x: Rectangle) => x instanceof Tree || (x instanceof Water && x.type === 1))
      this.socketService.emitInit({
        id: this.socketService.socketId,
        username: username,
        position: { x: 200, y: 150 },
        direction: 'bottom',
        action: 'idle',
        velocity: this.player.vel,
      })
    })
    this.socketService.onGameInit(this.setInitialConditions.bind(this))
    this.socketService.onPlayerConnection(this.onPlayerConnection.bind(this))
    this.socketService.onPlayerDisconnection(this.onPlayerDisconnection.bind(this))
    this.socketService.onPlayerMovement(this.onPlayerMovement.bind(this))
    this.socketService.onPlayerAttack(this.onPlayerAttack.bind(this))
  }

  addPlayer(player: PlayerPayload) {
    const anotherPlayer = new AnotherPlayer({ x: player.position.x, y: player.position.y }, 'bottom', 'idle', player.username)
    this.anotherPlayers.push(anotherPlayer)
    anotherPlayer.socketId = player.id
    anotherPlayer.renderPriority = 2
    this.addNode(anotherPlayer)
  }

  onPlayerAttack(data: AttackPayload) {
    console.log('Auch!')
    if (data.playerId === this.socketService.socketId && this.player) {
      this.player.damage(data.damage)
    } else {
      const playerWhoReceivesDamage = this.anotherPlayers.find((x) => x.socketId === data.playerId)
      if (!playerWhoReceivesDamage) return
      playerWhoReceivesDamage.changeAction('damage')
    }
  }

  onPlayerMovement(data: PlayerPayload) {
    const playerWhoMoves = this.anotherPlayers.find((x) => x.socketId === data.id)
    if (!playerWhoMoves) return
    playerWhoMoves.targetPosition.x = data.position.x
    playerWhoMoves.targetPosition.y = data.position.y
    playerWhoMoves.setDirection(data.direction)
    playerWhoMoves.changeAction(data.action, data.velocity)
  }

  setInitialConditions(data: PlayerPayload[]) {
    data.forEach((player) => {
      this.addPlayer(player)
    })
  }

  onPlayerConnection(data: PlayerPayload) {
    this.addPlayer(data)
    console.log('new user!', data)
  }

  onPlayerDisconnection = (data: string) => {
    console.log('user disconnected', data)

    if (data === this.socketService.socketId) {
      document.location = 'https://youtu.be/R0lqowYD_Tg'
      return
    }
    this.anotherPlayers.forEach((x) => {
      if (x.socketId === data) {
        this.removeNode(x)
      }
    })
    this.anotherPlayers = this.anotherPlayers.filter((x) => x.socketId !== data)
  }

  public update(): void {
    super.update()
    let cameraMovement: Vector2D = { x: 0, y: 0 }
    let cameraTransition: Vector2D = { x: 0, y: 0 }
    if (this.player) {
      if (this.player.targetMode) {
        cameraMovement = DIRECTION_MOVEMENT[this.player.direction]
      } else {
        cameraMovement.x = 0
        cameraMovement.y = 0
      }
      cameraTransition.x = this.player.centerX - this.viewport.width / 2 + cameraMovement.x * 300
      cameraTransition.y = this.player.centerY - this.viewport.height / 2 + cameraMovement.y * 300

      this.camera.x += ~~((cameraTransition.x - this.camera.x) * 0.05)
      this.camera.y += ~~((cameraTransition.y - this.camera.y) * 0.05)

      this.indicatorsText.content = `Health: ${this.player.getHealth()} / 100\nStamina: ${~~this.player.getStamina()} / 100`
    }
  }
}

export default SandboxScene

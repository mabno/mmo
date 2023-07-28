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
import { OBJECT_TILES, TILES } from '../constants/tiles'
import Water from '../mynodes/Water'
import AnotherPlayer from '../mynodes/AnotherPlayer'
import { ServerPlayer } from '../types'

const lightSpriteSheet = new SpriteSheet(lighJson)
const fireSpriteSheet = new SpriteSheet(fireJson)

class Darkness extends Node {
  public enter(): void {
    super.enter()
  }
  public render(): void {
    this.ctx.fillStyle = 'rgba(0,0,0,1)'
    this.ctx.fillRect(0, 0, this.viewport.width, this.viewport.height)
  }
}

class SandboxScene extends Node {
  player?: Player
  playerLight: AnimatedSprite
  map: Map
  anotherPlayers: AnotherPlayer[] = []

  public enter(): void {
    super.enter()

    this.camera = { x: 0, y: 0 }
    let map = mapGen(AssetsManager.instance.getImage('worldtest'), AssetsManager.instance.getImage('worldtestObjects'))

    this.map = new Map(map[0])

    map[1].forEach((row, y) => {
      row.forEach((col, x) => {
        if (col === OBJECT_TILES.TREE) {
          let tree = new Tree({ x: x * 16 + 4, y: y * 16 + 4 })
          this.addNode(tree)
        }
        if (col === OBJECT_TILES.WATER1) {
          let water = new Water({ x: x * 16, y: y * 16 }, 0)
          this.addNode(water)
        }
        if (col === OBJECT_TILES.WATER2) {
          let water = new Water({ x: x * 16, y: y * 16 }, 1)
          this.addNode(water)
        }
      })
    })

    const light = new AnimatedSprite(
      { x: 640, y: 640 },
      { x: 0, y: 0 },
      lightSpriteSheet.get([0]),
      AssetsManager.instance.getImage('light'),
      {
        loop: lightSpriteSheet.get([0, 1, 2, 3, 4, 5, 4, 3, 2, 1]),
      }
    )
    light.animationFps = 6
    light.play('loop')

    this.addNode(this.map)

    const socket = io('http://localhost:80')

    socket.on('connect', () => {
      const urlParams = new URLSearchParams(window.location.search)
      const username = urlParams.get('username') ?? 'guest'
      console.log('Connected')
      this.player = new Player({ x: 200, y: 150 }, { width: 8, height: 8 }, socket)
      this.player.renderPriority = 2
      this.addNode(this.player)
      this.player.colliders = this.children.filter((x: Rectangle) => x instanceof Tree || (x instanceof Water && x.type === 1))
      console.log(this.player.colliders)
      socket.emit('init', { id: socket.id, username: username, position: { x: 200, y: 150 }, direction: 'bottom', action: 'idle' })
    })
    socket.on('init', this.setInitialConditions.bind(this))
    socket.on('user_connection', this.onConnectUser.bind(this))
    socket.on('user_disconnection', this.onDisconnectUser.bind(this))
    socket.on('player:movement', this.onPlayerMovement.bind(this))
  }

  addPlayer(player: ServerPlayer) {
    const anotherPlayer = new AnotherPlayer(
      { x: player.position.x, y: player.position.y },
      { width: 8, height: 8 },
      'bottom',
      'idle',
      player.username
    )
    this.anotherPlayers.push(anotherPlayer)
    anotherPlayer.socketId = player.id
    anotherPlayer.renderPriority = 2
    this.addNode(anotherPlayer)
  }

  onPlayerMovement(data: ServerPlayer) {
    const playerWhoMoves = this.anotherPlayers.find((x) => x.socketId === data.id)
    if (!playerWhoMoves) return
    playerWhoMoves.targetPosition.x = data.position.x
    playerWhoMoves.targetPosition.y = data.position.y
    playerWhoMoves.setDirection(data.direction)
    playerWhoMoves.changeAction(data.action)
  }

  setInitialConditions(data: ServerPlayer[]) {
    data.forEach((player) => {
      this.addPlayer(player)
    })
  }

  onConnectUser(data: ServerPlayer) {
    this.addPlayer(data)
    console.log('new user!', data)
  }

  onDisconnectUser = (data: string) => {
    console.log('user disconnected', data)
    this.anotherPlayers.forEach((x) => {
      if (x.socketId === data) {
        this.removeNode(x)
      }
    })
    this.anotherPlayers = this.anotherPlayers.filter((x) => x.socketId !== data)
  }

  public update(): void {
    super.update()
    if (this.player) {
      this.camera.x = this.player.centerX - this.viewport.width / 2
      this.camera.y = this.player.centerY - this.viewport.height / 2
    }
  }
}

export default SandboxScene

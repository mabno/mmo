import AssetsManager from '../core/AssetsManager'
import Rectangle from '../core/nodes/Rectangle'
import AnimatedSprite from '../core/nodes/AnimatedSprite'
import { Clip, Vector2D } from '../core/interfaces'
import SpriteSheet from '../core/SpriteSheet'
import { isSomeColliding } from '../helpers'
import playerAnim from '../anim/player.json'
import { PlayerAction, PlayerDirection } from '../types'
import SocketService from '../SocketService'
import {
  ANGLE_DIRECTION,
  DIRECTION_MOVEMENT,
  SPRINT_VELOCITY,
  STAMINA_DEPLETION,
  STAMINA_REGENERATION,
  TARGET_VELOCITY,
  WALK_VELOCITY,
} from '../constants/player'

const playerSpriteSheet = new SpriteSheet(playerAnim as Clip[])
const playerSpriteSheetDefaults = {
  bottom: playerSpriteSheet.get(0),
  right: playerSpriteSheet.get(5),
  top: playerSpriteSheet.get(10),
  left: playerSpriteSheet.get(15),
  'bottom-right': playerSpriteSheet.get(20),
  'bottom-left': playerSpriteSheet.get(35),
  'top-right': playerSpriteSheet.get(25),
  'top-left': playerSpriteSheet.get(30),
}

class Player extends Rectangle {
  sprite: AnimatedSprite
  vel: number = WALK_VELOCITY
  lastPressed: string[] = []
  pressed: string[] = []
  colliders: Rectangle[] = []
  direction: PlayerDirection = 'bottom'
  action: PlayerAction = 'idle'
  movement: Vector2D = { x: 0, y: 0 }
  targetMode: boolean = false
  private socketService: SocketService = SocketService.instance
  private prevPosition: Vector2D = { x: 0, y: 0 }
  private prevAction: PlayerAction = 'idle'
  private prevDirection: PlayerDirection = 'bottom'
  private radians: number = 0
  private health: number = 100
  private stamina: number = 100

  constructor(position: Vector2D) {
    super(position, { width: 54, height: 32 })
  }

  getHealth(): number {
    return this.health
  }

  getStamina(): number {
    return this.stamina
  }

  onKeyUp(e: KeyboardEvent) {
    this.pressed = this.pressed.filter((key) => key !== e.code)
  }

  onKeyDown(e: KeyboardEvent) {
    if (this.pressed.includes(e.code)) return
    this.pressed.push(e.code)
  }

  onTarget(e: MouseEvent) {
    if (e.button === 2) {
      this.targetMode = !this.targetMode
    }
  }

  public enter(): void {
    this.sprite = new AnimatedSprite({ x: 0, y: 0 }, { x: 0, y: 0 }, playerSpriteSheet.get(0), AssetsManager.instance.getImage('player'), {
      'bottom-walk': playerSpriteSheet.get([1, 2, 3, 4]),
      'right-walk': playerSpriteSheet.get([6, 7, 8, 9]),
      'top-walk': playerSpriteSheet.get([11, 12, 13, 14]),
      'left-walk': playerSpriteSheet.get([16, 17, 18, 19]),
      'bottom-right-walk': playerSpriteSheet.get([21, 22, 23, 24]),
      'bottom-left-walk': playerSpriteSheet.get([36, 37, 38, 39]),
      'top-right-walk': playerSpriteSheet.get([26, 27, 28, 29]),
      'top-left-walk': playerSpriteSheet.get([31, 32, 33, 34]),
      'bottom-punch': playerSpriteSheet.get([40, 41, 42]),
      'right-punch': playerSpriteSheet.get([43, 44, 45]),
      'top-punch': playerSpriteSheet.get([46, 47, 48]),
      'left-punch': playerSpriteSheet.get([49, 50, 51]),
      'bottom-right-punch': playerSpriteSheet.get([52, 53, 54]),
      'bottom-left-punch': playerSpriteSheet.get([61, 62, 63]),
      'top-right-punch': playerSpriteSheet.get([55, 56, 57]),
      'top-left-punch': playerSpriteSheet.get([58, 59, 60]),
      'bottom-damage': playerSpriteSheet.get([64, 65]),
      'right-damage': playerSpriteSheet.get([66, 67]),
      'top-damage': playerSpriteSheet.get([68, 69]),
      'left-damage': playerSpriteSheet.get([70, 71]),
      'bottom-right-damage': playerSpriteSheet.get([72, 73]),
      'top-right-damage': playerSpriteSheet.get([74, 75]),
      'top-left-damage': playerSpriteSheet.get([76, 77]),
      'bottom-left-damage': playerSpriteSheet.get([78, 79]),
    })
    this.sprite.play('bottom-walk')

    this.addNode(this.sprite)

    this.input.on(this.id, 'keydown', this.onKeyDown.bind(this))
    this.input.on(this.id, 'keyup', this.onKeyUp.bind(this))
    this.input.on(this.id, 'mousedown', this.onTarget.bind(this))
    this.input.on(this.id, 'mouseup', this.onTarget.bind(this))
  }

  private calculateDirection(): void {
    if (!this.targetMode) {
      if (this.movement.x === 1 && this.movement.y === -1) this.direction = 'top-right'
      else if (this.movement.x === 1 && this.movement.y === 1) this.direction = 'bottom-right'
      else if (this.movement.x === -1 && this.movement.y === -1) this.direction = 'top-left'
      else if (this.movement.x === -1 && this.movement.y === 1) this.direction = 'bottom-left'
      else if (this.movement.x === 1) this.direction = 'right'
      else if (this.movement.x === -1) this.direction = 'left'
      else if (this.movement.y === 1) this.direction = 'bottom'
      else if (this.movement.y === -1) this.direction = 'top'
    } else {
      const { cursor } = this.input
      let dY = cursor.y - this.y + this.camera.y // opposite
      let dX = cursor.x - this.x + this.camera.x // adjacent
      this.radians = Math.atan(dY / dX)
      if (1 / dX < 0) this.radians += Math.PI // fixed, in [-1/2 pi, 3/2 pi]
      if (1 / this.radians < 0) this.radians += 2 * Math.PI // fixed, in [+0, 2 pi]
      let degrees = (this.radians * 180) / Math.PI

      let closestAngle: number = 0

      Object.keys(ANGLE_DIRECTION).forEach((key: string) => {
        let angle = parseInt(key)
        let diff = Math.abs(degrees - angle)
        let closestDiff = Math.abs(degrees - closestAngle)
        if (diff < closestDiff) {
          closestAngle = angle
        }
      })
      this.direction = ANGLE_DIRECTION[closestAngle] as PlayerDirection
    }
  }

  private calculateMovement() {
    let movement: Vector2D = { x: 0, y: 0 }

    if (this.action === 'idle') this.action = 'walk'

    if (this.pressed.includes('KeyW') && this.pressed.includes('KeyA')) {
      movement = { x: -1, y: -1 }
    } else if (this.pressed.includes('KeyW') && this.pressed.includes('KeyD')) {
      movement = { x: 1, y: -1 }
    } else if (this.pressed.includes('KeyS') && this.pressed.includes('KeyA')) {
      movement = { x: -1, y: 1 }
    } else if (this.pressed.includes('KeyS') && this.pressed.includes('KeyD')) {
      movement = { x: 1, y: 1 }
    } else if (this.pressed.includes('KeyW')) {
      movement = { x: 0, y: -1 }
    } else if (this.pressed.includes('KeyS')) {
      movement = { x: 0, y: 1 }
    } else if (this.pressed.includes('KeyA')) {
      movement = { x: -1, y: 0 }
    } else if (this.pressed.includes('KeyD')) {
      movement = { x: 1, y: 0 }
    } else if (this.action === 'walk') {
      this.action = 'idle'
    }
    this.movement = movement
  }

  private calculateVelocity(): void {
    if (this.pressed.includes('ShiftLeft') && this.stamina > 0) {
      this.vel = SPRINT_VELOCITY
      this.sprite.animationFps = 8
    } else {
      this.vel = WALK_VELOCITY
      this.sprite.animationFps = 6
    }

    if (this.targetMode) {
      this.vel = TARGET_VELOCITY
      this.sprite.animationFps = 4
    }
  }

  damage(damage: number) {
    console.log(damage, typeof damage)
    this.action = 'damage'
    this.sprite.playOnce(`${this.direction}-damage`)
    this.health -= damage
  }

  public update(): void {
    const { deltaTime } = this.globalState

    if (this.sprite.getCurrentAnimation() === null) {
      this.action = 'idle'
    }

    this.calculateDirection()
    this.calculateMovement()
    this.calculateVelocity()

    if (this.targetMode && this.action === 'idle') {
      this.sprite.setDefaultClip(playerSpriteSheetDefaults[this.direction])
      this.sprite.toDefaultClip()
    }

    if (this.pressed.includes('KeyT')) {
      this.sprite.playOnce(`${this.direction}-damage`)
      this.action = 'attack'
    }

    if (this.pressed.includes('KeyF') && this.action !== 'attack' && this.targetMode) {
      this.sprite.animationFps = 0
      this.sprite.playOnce(`${this.direction}-punch`)
      this.action = 'attack'
      this.socketService.emitPlayerAttack({
        playerId: this.socketService.socketId,
        damage: 10,
      })
    }

    if (this.action === 'walk') {
      if (!this.sprite.isActive(`${this.direction}-walk`)) {
        this.sprite.setDefaultClip(playerSpriteSheetDefaults[this.direction])
        this.sprite.play(`${this.direction}-walk`)
      }
    } else {
      if (this.action === 'idle' && !this.sprite.isActive(null)) {
        this.sprite.stop()
      }
    }

    if (this.movement.x !== 0 || this.movement.y !== 0) {
      let transformedMovement = { x: this.movement.x, y: this.movement.y }
      let movementMagnitude = Math.sqrt(this.movement.x ** 2 + this.movement.y ** 2)
      transformedMovement.x = this.movement.x / movementMagnitude
      transformedMovement.y = this.movement.y / movementMagnitude
      this.x += transformedMovement.x * this.vel * deltaTime
      this.y += transformedMovement.y * this.vel * deltaTime
      if (this.vel === SPRINT_VELOCITY) this.stamina -= STAMINA_DEPLETION * deltaTime
      isSomeColliding.call(this, this.colliders, () => {
        this.x = this.prevPosition.x
        this.y = this.prevPosition.y
        if (!this.sprite.isActive(null) && this.action === 'walk') {
          this.sprite.stop()
        }
      })
    }
    if (this.stamina < 100) this.stamina += STAMINA_REGENERATION * deltaTime

    if (
      this.prevPosition.x !== this.x ||
      this.prevPosition.y !== this.y ||
      this.prevAction !== this.action ||
      this.prevDirection !== this.direction
    ) {
      this.socketService.emitPlayerMovement({
        id: this.socketService.socketId,
        position: { x: this.x, y: this.y },
        action: this.action,
        direction: this.direction,
        velocity: this.vel,
      })
      console.log(this.action)
    }

    this.prevPosition = { x: this.x, y: this.y }
    this.prevAction = this.action
    this.prevDirection = this.direction

    this.sprite.x = this.x - 34
    this.sprite.y = this.y - 54

    this.lastPressed = [...this.pressed]
  }

  public render(): void {
    super.render()
    /*this.ctx.strokeStyle = 'red'
    this.ctx.lineWidth = 1
    this.ctx.strokeRect(~~((this.x - this.camera.x) / 4) * 4, ~~((this.y - this.camera.y) / 4) * 4, this.width, this.height)
  */
  }
}

export default Player

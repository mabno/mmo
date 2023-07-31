import AssetsManager from '../core/AssetsManager'
import Rectangle from '../core/nodes/Rectangle'
import AnimatedSprite from '../core/nodes/AnimatedSprite'
import { Clip, Vector2D } from '../core/interfaces'
import SpriteSheet from '../core/SpriteSheet'
import { isSomeColliding } from '../helpers'
import playerAnim from '../anim/player.json'
import { PlayerAction, PlayerDirection } from '../types'
import SocketService from '../SocketService'
import { ANGLE_DIRECTION, DIRECTION_MOVEMENT, SPRINT_VELOCITY, WALK_VELOCITY } from '../constants/player'

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
  private targetMode: boolean = false
  private socketService: SocketService = SocketService.instance
  private prevPosition: Vector2D = { x: 0, y: 0 }
  private prevAction: PlayerAction = 'idle'
  private radians: number = 0

  constructor(position: Vector2D) {
    super(position, { width: 54, height: 32 })
  }

  onKeyUp(e: KeyboardEvent) {
    this.pressed = this.pressed.filter((key) => key !== e.code)
  }

  onKeyDown(e: KeyboardEvent) {
    if (this.pressed.includes(e.code)) return
    this.pressed.push(e.code)
  }

  public enter(): void {
    console.log('Player enter')
    this.sprite = new AnimatedSprite({ x: 0, y: 0 }, { x: 0, y: 0 }, playerSpriteSheet.get(0), AssetsManager.instance.getImage('player'), {
      'bottom-walk': playerSpriteSheet.get([1, 2, 3, 4]),
      'right-walk': playerSpriteSheet.get([6, 7, 8, 9]),
      'top-walk': playerSpriteSheet.get([11, 12, 13, 14]),
      'left-walk': playerSpriteSheet.get([16, 17, 18, 19]),
      'bottom-right-walk': playerSpriteSheet.get([21, 22, 23, 24]),
      'bottom-left-walk': playerSpriteSheet.get([36, 37, 38, 39]),
      'top-right-walk': playerSpriteSheet.get([26, 27, 28, 29]),
      'top-left-walk': playerSpriteSheet.get([31, 32, 33, 34]),
    })
    this.sprite.play('bottom-walk')

    this.addNode(this.sprite)

    this.input.on(this.id, 'keydown', this.onKeyDown.bind(this))
    this.input.on(this.id, 'keyup', this.onKeyUp.bind(this))
  }

  private calculateDirection(): PlayerDirection {
    const { cursor } = this.input
    let dY = cursor.y - this.y + this.camera.y // opposite
    let dX = cursor.x - this.x + this.camera.x // adjacent
    this.radians = Math.atan(dY / dX)
    if (1 / dX < 0) this.radians += Math.PI // fixed, in [-1/2 pi, 3/2 pi]
    if (1 / this.radians < 0) this.radians += 2 * Math.PI // fixed, in [+0, 2 pi]
    let degrees = (this.radians * 180) / Math.PI

    let closestAngle: number = 0
    let output: PlayerDirection = 'bottom'

    Object.keys(ANGLE_DIRECTION).forEach((key: string) => {
      let angle = parseInt(key)
      let diff = Math.abs(degrees - angle)
      let closestDiff = Math.abs(degrees - closestAngle)
      if (diff < closestDiff) {
        closestAngle = angle
      }
    })
    console.log(output, closestAngle)
    return ANGLE_DIRECTION[closestAngle] as PlayerDirection
  }

  private calculateMovement(direction: PlayerDirection): Vector2D {
    /*let movement = DIRECTION_MOVEMENT[direction]
    let movementMagnitude = Math.sqrt(movement.x * movement.x + movement.y * movement.y)
    movement.x = movement.x / movementMagnitude
    movement.y = movement.y / movementMagnitude
    return movement*/
    console.log(this.pressed)
    if (this.pressed.includes('KeyW')) {
      return { x: 0, y: -1 }
    } else if (this.pressed.includes('KeyS')) {
      return { x: 0, y: 1 }
    } else if (this.pressed.includes('KeyA')) {
      return { x: -1, y: 0 }
    } else if (this.pressed.includes('KeyD')) {
      return { x: 1, y: 0 }
    } else {
      return { x: 0, y: 0 }
    }
  }

  public update(): void {
    const { deltaTime } = this.globalState

    this.direction = this.calculateDirection()
    this.movement = this.calculateMovement(this.direction)

    if (!this.sprite.isActive(`${this.direction}-walk`)) {
      this.sprite.defaultClip = playerSpriteSheetDefaults[this.direction]
      this.sprite.play(`${this.direction}-walk`)
    }

    if (this.pressed.includes('ShiftLeft')) {
      this.vel = SPRINT_VELOCITY
      this.sprite.animationFps = 8
    } else {
      this.vel = WALK_VELOCITY
      this.sprite.animationFps = 6
    }

    if (this.pressed.includes('KeyW')) {
      this.action = 'walk'

      this.x += this.movement.x * this.vel * deltaTime
      this.y += this.movement.y * this.vel * deltaTime
      isSomeColliding.call(this, this.colliders, () => {
        this.x = this.prevPosition.x
        this.y = this.prevPosition.y
        if (!this.sprite.isActive(null)) {
          this.sprite.stop()
        }
      })
    } else {
      if (!this.sprite.isActive(null)) {
        this.sprite.stop()
      }
      this.action = 'idle'
    }

    if (this.prevPosition.x !== this.x || this.prevPosition.y !== this.y || this.prevAction !== this.action) {
      this.socketService.emitPlayerMovement({
        id: this.socketService.socketId,
        position: { x: this.x, y: this.y },
        action: this.action,
        direction: this.direction,
      })
    }

    this.prevPosition = { x: this.x, y: this.y }
    this.prevAction = this.action

    this.sprite.x = this.x - 34
    this.sprite.y = this.y - 54
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

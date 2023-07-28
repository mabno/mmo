import AssetsManager from '../core/AssetsManager'
import Rectangle from '../core/nodes/Rectangle'
import AnimatedSprite from '../core/nodes/AnimatedSprite'
import { Clip, Vector2D } from '../core/interfaces'
import SpriteSheet from '../core/SpriteSheet'
import { isSomeColliding } from '../helpers'
import playerAnim from '../anim/player.json'
import { PlayerAction, PlayerDirection } from '../types'
import SocketService from '../SocketService'

const playerSpriteSheet = new SpriteSheet(playerAnim as Clip[])
const playerSpriteSheetDefaults = {
  bottom: playerSpriteSheet.get(0),
  right: playerSpriteSheet.get(5),
  top: playerSpriteSheet.get(10),
  left: playerSpriteSheet.get(15),
  'bottom-right': playerSpriteSheet.get(20),
  'bottom-left': playerSpriteSheet.get(20),
  'top-right': playerSpriteSheet.get(3),
  'top-left': playerSpriteSheet.get(3),
}

class Player extends Rectangle {
  sprite: AnimatedSprite
  vel: number = 128
  movement: Vector2D = { x: 0, y: 0 }
  lastPressed: string[] = []
  pressed: string[] = []
  colliders: Rectangle[] = []
  direction: PlayerDirection = 'bottom'
  action: PlayerAction = 'idle'
  private socketService: SocketService = SocketService.instance
  private prevPosition: Vector2D = { x: 0, y: 0 }
  private prevAction: PlayerAction = 'idle'

  constructor(position: Vector2D) {
    super(position, { width: 54, height: 32 })
  }

  calculateDirection() {
    if (this.movement.x === 1 && this.movement.y === 1) {
      this.direction = 'bottom-right'
    } else if (this.movement.y === -1) {
      this.direction = 'top'
    } else if (this.movement.y === 1) {
      this.direction = 'bottom'
    } else if (this.movement.x === -1) {
      this.direction = 'left'
    } else if (this.movement.x === 1) {
      this.direction = 'right'
    }
  }

  onKeyUp(e: KeyboardEvent) {
    this.pressed = this.pressed.filter((key) => key !== e.code)
  }

  onKeyDown(e: KeyboardEvent) {
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
      'bottom-left-walk': playerSpriteSheet.get([21, 22, 23, 24]),
      'top-right-walk': playerSpriteSheet.get([21, 22, 23, 24]),
      'top-left-walk': playerSpriteSheet.get([21, 22, 23, 24]),
    })
    this.sprite.play('bottom-walk')

    this.addNode(this.sprite)

    this.input.on(this.id, 'keydown', this.onKeyDown.bind(this))
    this.input.on(this.id, 'keyup', this.onKeyUp.bind(this))
  }

  public update(): void {
    const { deltaTime } = this.globalState

    if (this.lastPressed.includes('KeyW') || this.lastPressed.includes('KeyS')) {
      this.movement.y = 0
    }
    if (this.lastPressed.includes('KeyA') || this.lastPressed.includes('KeyD')) {
      this.movement.x = 0
    }

    if (this.pressed.includes('KeyW')) {
      this.movement.y = -1
    }
    if (this.pressed.includes('KeyS')) {
      this.movement.y = 1
    }
    if (this.pressed.includes('KeyA')) {
      this.movement.x = -1
    }
    if (this.pressed.includes('KeyD')) {
      this.movement.x = 1
    }

    this.action = 'walk'
    this.calculateDirection()
    if (this.movement.x === 0 && this.movement.y === 0) {
      this.action = 'idle'
    }

    this.lastPressed = [...this.pressed]

    if (!this.sprite.isActive(`${this.direction}-walk`)) {
      this.sprite.defaultClip = playerSpriteSheetDefaults[this.direction]
      this.sprite.play(`${this.direction}-walk`)
    }

    if (this.action === 'walk') {
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

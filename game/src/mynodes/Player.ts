import AssetsManager from '../core/AssetsManager'
import Rectangle from '../core/nodes/Rectangle'
import AnimatedSprite from '../core/nodes/AnimatedSprite'
import { Clip, Dimension2D, Vector2D } from '../core/interfaces'
import SpriteSheet from '../core/SpriteSheet'
import { isSomeColliding } from '../helpers'
import playerAnim from '../anim/player.json'
import { Socket } from 'socket.io-client'
import { PlayerDirection } from '../types'

const playerSpriteSheet = new SpriteSheet(playerAnim as Clip[])

class Player extends Rectangle {
  sprite: AnimatedSprite
  vel: number = 40
  lastPressed: number | null = null
  colliders: Rectangle[] = []
  direction: PlayerDirection = 'bottom'
  private socket: Socket

  constructor(position: Vector2D, size: Dimension2D, socket: Socket) {
    super(position, size)
    this.socket = socket
  }

  public enter(): void {
    console.log('Player enter')
    this.sprite = new AnimatedSprite(
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      playerSpriteSheet.get([0]),
      AssetsManager.instance.getImage('player'),
      {
        'bottom-walk': playerSpriteSheet.get([1, 2, 3, 4]),
        'right-walk': playerSpriteSheet.get([6, 7, 8, 9]),
        'top-walk': playerSpriteSheet.get([11, 12, 13, 14]),
        'left-walk': playerSpriteSheet.get([16, 17, 18, 19]),
      }
    )
    this.sprite.play('bottom-walk')

    this.addNode(this.sprite)

    this.input.on(this.id, 'keydown', (e: KeyboardEvent) => {
      this.lastPressed = e.which
    })
    this.input.on(this.id, 'keyup', (e: KeyboardEvent) => {
      if (e.which === this.lastPressed) {
        this.lastPressed = null
      }
    })
  }

  public update(): void {
    const { deltaTime } = this.globalState
    switch (this.lastPressed) {
      case 87:
        this.direction = 'top'
        this.y -= this.vel * deltaTime
        if (!this.sprite.isActive('top-walk')) {
          this.sprite.defaultClip = playerSpriteSheet.get([10])
          this.sprite.play('top-walk')
        }
        isSomeColliding.call(this, this.colliders, (collider: Rectangle) => {
          this.y = collider.bottom
          if (!this.sprite.isActive(null)) {
            this.sprite.stop()
          }
        })
        break
      case 83:
        this.direction = 'bottom'
        this.y += this.vel * deltaTime
        if (!this.sprite.isActive('bottom-walk')) {
          this.sprite.defaultClip = playerSpriteSheet.get([0])
          this.sprite.play('bottom-walk')
        }
        isSomeColliding.call(this, this.colliders, (collider: Rectangle) => {
          this.bottom = collider.y
          if (!this.sprite.isActive(null)) {
            this.sprite.stop()
          }
        })
        break
      case 65:
        this.direction = 'left'
        this.x -= this.vel * deltaTime
        if (!this.sprite.isActive('left-walk')) {
          this.sprite.defaultClip = playerSpriteSheet.get([15])
          this.sprite.play('left-walk')
        }
        isSomeColliding.call(this, this.colliders, (collider: Rectangle) => {
          this.x = collider.right
          if (!this.sprite.isActive(null)) {
            this.sprite.stop()
          }
        })
        break
      case 68:
        this.direction = 'right'
        this.x += this.vel * deltaTime
        if (!this.sprite.isActive('right-walk')) {
          this.sprite.defaultClip = playerSpriteSheet.get([5])
          this.sprite.play('right-walk')
        }
        isSomeColliding.call(this, this.colliders, (collider: Rectangle) => {
          this.right = collider.x
          if (!this.sprite.isActive(null)) {
            this.sprite.stop()
          }
        })
        break

      default:
        if (!this.sprite.isActive(null)) {
          this.sprite.stop()
        }
        break
    }

    this.socket.emit('player:movement', {
      id: this.socket.id,
      position: { x: this.x, y: this.y },
      action: [87, 83, 65, 68].includes(this.lastPressed ?? 0) ? 'walk' : 'idle',
      direction: this.direction,
    })

    this.sprite.x = this.x - 12
    this.sprite.y = this.y - 16
  }

  public render(): void {
    super.render()
    /* this.ctx.strokeStyle = 'red'
    this.ctx.lineWidth = 1
    this.ctx.strokeRect(~~((this.x - this.camera.x) / 4) * 4, ~~((this.y - this.camera.y) / 4) * 4, this.width, this.height)
    */
  }
}

export default Player

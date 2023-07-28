import AssetsManager from '../core/AssetsManager'
import Rectangle from '../core/nodes/Rectangle'
import AnimatedSprite from '../core/nodes/AnimatedSprite'
import { Clip, Dimension2D, Vector2D } from '../core/interfaces'
import SpriteSheet from '../core/SpriteSheet'
import { isSomeColliding } from '../helpers'
import playerAnim from '../anim/player.json'
import { PlayerAction, PlayerDirection } from '../types'
import Text from '../core/nodes/Text'

const playerSpriteSheet = new SpriteSheet(playerAnim as Clip[])

class AnotherPlayer extends Rectangle {
  sprite: AnimatedSprite
  nameLabel: Text
  socketId: string
  targetPosition: Vector2D
  username: string
  private distance: Vector2D
  private direction: PlayerDirection
  private action: PlayerAction

  constructor(position: Vector2D, direction: PlayerDirection, action: PlayerAction, username: string) {
    super(position, { width: 54, height: 32 })
    this.targetPosition = { x: position.x, y: position.y }
    this.distance = { x: 0, y: 0 }
    this.direction = direction
    this.action = action
    this.username = username
  }

  public enter(): void {
    console.log('Player enter')
    this.nameLabel = new Text({ x: this.x, y: this.y }, this.username, {
      fontSize: 14,
      font: 'OldSchoolAdventures',
      fillStyle: 'white',
      textAlign: 'center',
    })
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
    this.addNode(this.nameLabel)
  }

  private playAnimation() {
    const defaults = {
      bottom: playerSpriteSheet.get([0]),
      right: playerSpriteSheet.get([5]),
      top: playerSpriteSheet.get([10]),
      left: playerSpriteSheet.get([15]),
    }
    this.sprite.play(`${this.direction}-walk`)
    this.sprite.defaultClip = defaults[this.direction]
  }

  setDirection(direction: PlayerDirection) {
    if (this.direction !== direction) {
      this.direction = direction
      this.playAnimation()
    }
  }
  changeAction(action: PlayerAction) {
    if (this.action !== action) {
      if (this.action === 'idle') {
        this.playAnimation()
      } else {
        this.sprite.stop()
      }
      this.action = action
    }
  }

  calculateDistance(): void {
    this.distance.x = this.targetPosition.x - this.x
    this.distance.y = this.targetPosition.y - this.y
  }

  public update(): void {
    super.update()
    if (this.distance.x !== 0 || this.distance.y !== 0) {
      this.x += this.distance.x * 0.3
      this.y += this.distance.y * 0.3
    }
    this.calculateDistance()

    this.sprite.x = this.x - 34
    this.sprite.y = this.y - 54
    this.nameLabel.x = this.x + 32
    this.nameLabel.y = this.y - 54
  }

  public render(): void {
    super.render()
    this.ctx.strokeStyle = 'red'
    this.ctx.lineWidth = 1
    this.ctx.strokeRect(~~((this.x - this.camera.x) / 4) * 4, ~~((this.y - this.camera.y) / 4) * 4, this.width, this.height)
  }
}

export default AnotherPlayer

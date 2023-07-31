import AssetsManager from '../core/AssetsManager'
import Rectangle from '../core/nodes/Rectangle'
import AnimatedSprite from '../core/nodes/AnimatedSprite'
import { Clip, Dimension2D, Vector2D } from '../core/interfaces'
import SpriteSheet from '../core/SpriteSheet'
import { isSomeColliding } from '../helpers'
import playerAnim from '../anim/player.json'
import { PlayerAction, PlayerDirection } from '../types'
import Text from '../core/nodes/Text'
import { SPRINT_VELOCITY, TARGET_VELOCITY, WALK_VELOCITY } from '../constants/player'

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
    this.nameLabel.compositeOperation = 'source-over'
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
    this.addNode(this.nameLabel)
  }

  setDirection(direction: PlayerDirection) {
    if (this.direction !== direction) {
      this.direction = direction
      this.sprite.setDefaultClip(playerSpriteSheetDefaults[this.direction])
      this.sprite.toDefaultClip()
    }
  }
  changeAction(action: PlayerAction, velocity?: number) {
    if (action === 'walk' && this.sprite.getCurrentAnimation()?.endsWith('damage')) return

    if (action === 'damage') {
      this.sprite.stop()
      this.sprite.playOnce(`${this.direction}-damage`)
    } else if (action === 'walk') {
      if (velocity === WALK_VELOCITY) {
        this.sprite.animationFps = 6
      } else if (velocity === SPRINT_VELOCITY) {
        this.sprite.animationFps = 8
      } else if (velocity === TARGET_VELOCITY) {
        this.sprite.animationFps = 4
      }
      if (!this.sprite.isActive(`${this.direction}-walk`)) this.sprite.play(`${this.direction}-walk`)
    } else if (action === 'attack') {
      if (!this.sprite.isActive(`${this.direction}-punch`)) this.sprite.playOnce(`${this.direction}-punch`)
    } else {
      this.sprite.stop()
    }

    this.action = action
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

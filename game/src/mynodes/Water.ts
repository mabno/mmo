import { Vector2D } from '../core/interfaces'
import waterAnim from '../anim/water.json'
import SpriteSheet from '../core/SpriteSheet'
import AssetsManager from '../core/AssetsManager'
import AnimatedSprite from '../core/nodes/AnimatedSprite'
import Rectangle from '../core/nodes/Rectangle'

type WaterType = 0 | 1 | 2

const waterSpriteSheet = new SpriteSheet(waterAnim)

export default class Water extends Rectangle {
  type: WaterType
  constructor(position: Vector2D, type: WaterType) {
    super(position, { width: 16, height: 16 })
    this.type = type
  }

  enter() {
    const sprite = new AnimatedSprite(
      { x: this.x, y: this.y },
      { x: 0, y: 0 },
      waterSpriteSheet.get([0]),
      AssetsManager.instance.getImage('tilemap'),
      {
        'loop-top-0': waterSpriteSheet.get([0, 1, 2, 3]),
        'loop-top-1': waterSpriteSheet.get([4, 5, 6, 7]),
      }
    )
    switch (this.type) {
      case 0:
        sprite.play('loop-top-0')
        break
      case 1:
        sprite.play('loop-top-1')
        break
    }
    this.addNode(sprite)
  }
}

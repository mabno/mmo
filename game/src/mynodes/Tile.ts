import AssetsManager from '../core/AssetsManager'
import { Vector2D } from '../core/interfaces'
import Rectangle from '../core/nodes/Rectangle'
import Sprite from '../core/nodes/Sprite'

export default class Tile extends Rectangle {
  type: number
  tileCoord: [number, number]

  constructor(position: Vector2D, type: number, tileCoord: [number, number]) {
    super(position, { width: 16, height: 16 })
    this.type = type
    this.tileCoord = tileCoord
  }

  enter() {
    let wall = new Sprite(
      { x: this.x, y: this.y },
      { x: 0, y: 0 },
      {
        sourceX: this.tileCoord[0],
        sourceY: this.tileCoord[1],
        sourceWidth: 16,
        sourceHeight: 16,
        offsetX: 0,
        offsetY: 0,
        width: 16,
        height: 16,
      },
      AssetsManager.instance.getImage('tilemap')
    )
    this.addNode(wall)
  }
}

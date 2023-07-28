import AssetsManager from '../core/AssetsManager'
import { Vector2D } from '../core/interfaces'
import Rectangle from '../core/nodes/Rectangle'
import Sprite from '../core/nodes/Sprite'

export default class Tile extends Rectangle {
  type: number
  tileCoord: [number, number]

  constructor(position: Vector2D, type: number, tileCoord: [number, number]) {
    super(position, { width: 64, height: 64 })
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
        sourceWidth: this.width,
        sourceHeight: this.height,
        offsetX: 0,
        offsetY: 0,
        width: this.width,
        height: this.height,
      },
      AssetsManager.instance.getImage('tilemap')
    )
    this.addNode(wall)
  }

  public render(): void {
    super.render()
    this.ctx.strokeStyle = 'red'
    this.ctx.lineWidth = 1
    this.ctx.strokeRect(~~((this.x - this.camera.x) / 4) * 4, ~~((this.y - this.camera.y) / 4) * 4, this.width, this.height)
  }
}

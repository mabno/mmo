import AssetsManager from '../core/AssetsManager'
import Node from '../core/Node'
import { Vector2D } from '../core/interfaces'
import Rectangle from '../core/nodes/Rectangle'
import Sprite from '../core/nodes/Sprite'
import AnotherPlayer from './AnotherPlayer'
import Player from './Player'

export default class Tree extends Rectangle {
  constructor(position: Vector2D) {
    super(position, { width: 32, height: 32 })
  }

  enter() {
    this.renderPriority = 8
    let sprite = new Sprite(
      { x: this.x - 16, y: this.y - 32 },
      { x: 0, y: 0 },
      { sourceX: 512, sourceY: 448, sourceWidth: 64, sourceHeight: 64, offsetX: 0, offsetY: 0, width: 64, height: 64 },
      AssetsManager.instance.getImage('tilemap')
    )
    this.addNode(sprite)
  }

  public update(): void {
    this.parent.children.forEach((child) => {
      if (child instanceof Player || child instanceof AnotherPlayer) {
        if (this.distanceTo(child) < 64) {
          if (child.centerY > this.centerY) {
            child.renderPriority = this.renderPriority + 1
          } else {
            child.renderPriority = this.renderPriority - 1
          }
        }
      }
    })
  }

  public render(): void {
    super.render()
    this.ctx.strokeStyle = 'red'
    this.ctx.lineWidth = 4
    this.ctx.strokeRect(((this.x - this.camera.x) / 4) * 4, ~~((this.y - this.camera.y) / 4) * 4, this.width, this.height)
  }
}

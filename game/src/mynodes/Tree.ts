import AssetsManager from '../core/AssetsManager'
import Node from '../core/Node'
import { Vector2D } from '../core/interfaces'
import Rectangle from '../core/nodes/Rectangle'
import Sprite from '../core/nodes/Sprite'
import AnotherPlayer from './AnotherPlayer'
import Player from './Player'

export default class Tree extends Rectangle {
  constructor(position: Vector2D) {
    super(position, { width: 10, height: 8 })
  }

  enter() {
    this.renderPriority = 2
    let sprite = new Sprite(
      { x: this.x - 4, y: this.y - 8 },
      { x: 0, y: 0 },
      { sourceX: 128, sourceY: 112, sourceWidth: 16, sourceHeight: 16, offsetX: 0, offsetY: 0, width: 16, height: 16 },
      AssetsManager.instance.getImage('tilemap')
    )
    let spriteBg = new Sprite(
      { x: this.x - 4, y: this.y - 4 },
      { x: 0, y: 0 },
      { sourceX: 0, sourceY: 0, sourceWidth: 16, sourceHeight: 16, offsetX: 0, offsetY: 0, width: 16, height: 16 },
      AssetsManager.instance.getImage('tilemap')
    )
    this.addNode(sprite)
    //this.addNode(spriteBg)
  }

  public update(): void {
    this.parent.children.forEach((child) => {
      if (child instanceof Player || child instanceof AnotherPlayer) {
        if (this.distanceTo(child) < 16) {
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
    /*this.ctx.strokeStyle = 'red'
    this.ctx.lineWidth = 1
    this.ctx.strokeRect(~~((this.x - this.camera.x) / 4) * 4, ~~((this.y - this.camera.y) / 4) * 4, this.width, this.height)*/
  }
}

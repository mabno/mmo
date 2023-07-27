import AssetsManager from '../core/AssetsManager'
import Node from '../core/Node'
import Sprite from '../core/nodes/Sprite'

export default class Tree extends Node {
  enter() {
    let sprite = new Sprite(
      { x: this.x, y: this.y },
      { x: 0, y: 0 },
      { sourceX: 128, sourceY: 112, sourceWidth: 16, sourceHeight: 16, offsetX: 0, offsetY: 0, width: 16, height: 16 },
      AssetsManager.instance.getImage('tilemap')
    )
    this.addNode(sprite)
  }
}

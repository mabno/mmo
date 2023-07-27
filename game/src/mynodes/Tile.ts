import { TILE_TYPES } from '../constants/tiles'
import AssetsManager from '../core/AssetsManager'
import Node from '../core/Node'
import { Vector2D } from '../core/interfaces'
import Sprite from '../core/nodes/Sprite'

export default class Tile extends Node {
  type: number

  constructor(position: Vector2D, type: number) {
    super(position)
    this.type = type
  }

  enter() {
    const tileCoord: [number, number] = TILE_TYPES[this.type].coordinates

    let wall = new Sprite(
      { x: this.x, y: this.y },
      { x: 0, y: 0 },
      { sourceX: tileCoord[0], sourceY: tileCoord[1], sourceWidth: 16, sourceHeight: 16, offsetX: 0, offsetY: 0, width: 16, height: 16 },
      AssetsManager.instance.getImage('tilemap')
    )
    this.addNode(wall)
  }
}

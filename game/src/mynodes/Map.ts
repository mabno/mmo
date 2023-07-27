import AssetsManager from '../core/AssetsManager'
import Node from '../core/Node'
import Sprite from '../core/nodes/Sprite'
import Tile from './Tile'

class Map extends Node {
  map: Array<Array<number>>

  constructor(map: Array<Array<number>>) {
    super({ x: 0, y: 0 })
    this.map = map
  }

  public enter(): void {
    this.map.forEach((row, y) => {
      row.forEach((col, x) => {
        let wall = new Tile({ x: x * 16, y: y * 16 }, col)
        this.addNode(wall)
      })
    })
  }
}

export default Map

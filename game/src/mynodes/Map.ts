import { TILES } from '../constants/tiles'
import AssetsManager from '../core/AssetsManager'
import Node from '../core/Node'
import Sprite from '../core/nodes/Sprite'
import Tile from './Tile'
import Tree from './Tree'

class Map extends Node {
  map: Array<Array<number>>

  constructor(map: Array<Array<number>>) {
    super({ x: 0, y: 0 })
    this.map = map
  }

  public enter(): void {
    const TILES_COORDS: Record<number, [number, number]> = {
      [TILES.GRASS]: [0, 0],
      [TILES.GRASS2]: [16, 0],
      [TILES.PATH_MIDDLE]: [128, 16],
      [TILES.PATH_LEFT]: [160, 16],
      [TILES.PATH_RIGHT]: [192, 16],
      [TILES.PATH_CORNER_BOTTOMRIGHT]: [224, 16],
      [TILES.PATH_CORNER_TOPRIGHT]: [224, 0],
      [TILES.PATH_CORNER_TOPLEFT]: [208, 0],
      [TILES.PATH_CORNER_BOTTOMLEFT]: [208, 16],
      [TILES.PATH_BOTTOM]: [172, 32],
      [TILES.PATH_TOP]: [172, 0],
    }

    this.map.forEach((row, y) => {
      row.forEach((col, x) => {
        if (TILES_COORDS[col]) {
          let wall = new Tile({ x: x * 16, y: y * 16 }, col, TILES_COORDS[col])
          this.addNode(wall)
        }
      })
    })
  }
}

export default Map

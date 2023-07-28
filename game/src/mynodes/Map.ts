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
      [TILES.GRASS2]: [64, 0],
      [TILES.PATH_MIDDLE]: [512, 64],
      [TILES.PATH_LEFT]: [640, 64],
      [TILES.PATH_RIGHT]: [768, 64],
      [TILES.PATH_CORNER_BOTTOMRIGHT]: [896, 64],
      [TILES.PATH_CORNER_TOPRIGHT]: [896, 0],
      [TILES.PATH_CORNER_TOPLEFT]: [832, 0],
      [TILES.PATH_CORNER_BOTTOMLEFT]: [832, 64],
      [TILES.PATH_BOTTOM]: [688, 128],
      [TILES.PATH_TOP]: [688, 0],
    }

    this.map.forEach((row, y) => {
      row.forEach((col, x) => {
        if (TILES_COORDS[col]) {
          let wall = new Tile({ x: x * 64, y: y * 64 }, col, TILES_COORDS[col])
          this.addNode(wall)
        }
      })
    })
  }
}

export default Map

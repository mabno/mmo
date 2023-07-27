export type TileType = {
  color: [number, number, number]
  coordinates: [number, number]
}

export const GRASS: TileType = {
  color: [255, 255, 255],
  coordinates: [0, 0],
}

export const GRASS2: TileType = {
  color: [0, 0, 0],
  coordinates: [16, 0],
}

export const PATH_MIDDLE: TileType = {
  color: [0, 162, 232],
  coordinates: [128, 16],
}

export const PATH_LEFT: TileType = {
  color: [237, 28, 36],
  coordinates: [160, 16],
}

export const PATH_RIGHT: TileType = {
  color: [255, 242, 0],
  coordinates: [192, 16],
}

export const TREE: TileType = {
  color: [255, 242, 0],
  coordinates: [192, 16],
}

export const TILES = {
  GRASS: 0,
  GRASS2: 1,
  PATH_MIDDLE: 2,
  PATH_LEFT: 3,
  PATH_RIGHT: 'PATH_RIGHT',
  TREE: 'TREE',
}

export const NO_COLLISION_TILE_TYPES = {
  [TILES.GRASS]: GRASS,
  [TILES.GRASS2]: GRASS2,
  [TILES.PATH_MIDDLE]: PATH_MIDDLE,
  [TILES.PATH_LEFT]: PATH_LEFT,
  [TILES.PATH_RIGHT]: PATH_RIGHT,
}

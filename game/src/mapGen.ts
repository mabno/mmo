import { TILES, TILE_TYPES } from './constants/tiles'

function imageData(img: HTMLImageElement) {
  const fakeCanvas = document.createElement('canvas')
  document.body.append(fakeCanvas)
  fakeCanvas.width = img.width
  fakeCanvas.height = img.height
  const fakeCtx = fakeCanvas.getContext('2d')!
  fakeCtx.fillStyle = 'red'
  fakeCtx.fillRect(10, 10, 100, 1)
  fakeCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height)
  return fakeCtx.getImageData(0, 0, img.width, img.height).data
}

function mapGen(img: HTMLImageElement) {
  const data = imageData(img)
  data.forEach((x) => x == 1 && console.log(x))
  let world: number[][] = [[]]
  let col = 0
  let row = 0
  for (let i = 0; i < data.length / 4; i++) {
    if (col === img.width) {
      world.push([])
      row++
      col = 0
    }

    let r = data[i * 4]
    let g = data[i * 4 + 1]
    let b = data[i * 4 + 2]

    Object.keys(TILES).forEach((e) => {
      if (r === TILE_TYPES[e].color[0] && g === TILE_TYPES[e].color[1] && b === TILE_TYPES[e].color[2]) {
        world[row][col] = TILES[e]
      }
    })

    col++
  }

  return world
}

export default mapGen

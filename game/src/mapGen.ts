import { OBJECT_TILES, OBJECT_TILES_COLOR, TILES, TILES_COLOR } from './constants/tiles'

function imageData(img: HTMLImageElement): Uint8ClampedArray {
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

function mapGen(tilesImage: HTMLImageElement, objectsImage: HTMLImageElement): [number[][], number[][]] {
  const tiles = imageData(tilesImage)
  const objects = imageData(objectsImage)
  return [imageToMatrix(tiles, tilesImage.width, 'tiles'), imageToMatrix(objects, objectsImage.width, 'objects')]
}

function imageToMatrix(data: Uint8ClampedArray, imageWidth: number, type: 'tiles' | 'objects') {
  const tiles = type === 'tiles' ? TILES : OBJECT_TILES
  const colors = type === 'tiles' ? TILES_COLOR : OBJECT_TILES_COLOR
  let world: number[][] = [[]]
  let col = 0
  let row = 0
  for (let i = 0; i < data.length / 4; i++) {
    if (col === imageWidth) {
      world.push([])
      row++
      col = 0
    }

    let r = data[i * 4]
    let g = data[i * 4 + 1]
    let b = data[i * 4 + 2]

    Object.values(tiles).forEach((e) => {
      if (r === colors[e][0] && g === colors[e][1] && b === colors[e][2]) {
        world[row][col] = e
      }
    })

    col++
  }

  return world
}

export default mapGen

import { Clip } from './interfaces'

class SpriteSheet {
  private _clips: Clip[] = []

  constructor(clips: Clip[]) {
    this._clips = clips
  }

  get(index: number): Clip
  get(indexes: number[]): Clip[]

  get(index: unknown) {
    if (typeof index === 'number') {
      return this._clips[index] as Clip
    } else if (Array.isArray(index)) {
      return index.map((i) => this._clips[i])
    }
  }
}

export default SpriteSheet

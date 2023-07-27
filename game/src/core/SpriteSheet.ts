import { Clip } from './interfaces'

class SpriteSheet {
  private _clips: Clip[] = []

  constructor(clips: Clip[]) {
    this._clips = clips
  }

  public get(indexes: number[]): any {
    if (indexes.length === 1) {
      return this._clips[indexes[0]]
    }
    return indexes.map((index) => this._clips[index])
  }
}

export default SpriteSheet

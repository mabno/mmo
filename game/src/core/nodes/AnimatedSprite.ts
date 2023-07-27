import Sprite from './Sprite'
import { Vector2D, Clip, AssociativeArray } from '../interfaces'

class AnimatedSprite extends Sprite {
  private _timeElapsed: number = 0
  private _animations: AssociativeArray<Clip[]>
  private _animationIndex: number = 0

  private _currentAnimation: string | null = null

  public animationFps: number = 4
  public defaultClip: Clip

  constructor(pos: Vector2D, pivot: Vector2D, defaultClip: Clip, texture: HTMLImageElement, animations: AssociativeArray<Clip[]>) {
    super(pos, pivot, defaultClip, texture)
    this.defaultClip = defaultClip
    this._animations = animations
  }

  public play(key: string): void {
    this._animationIndex = 0
    this._currentAnimation = key
  }

  public stop(): void {
    this._currentAnimation = null
    this.toDefaultClip()
  }

  public isActive(key: string | null): boolean {
    return this._currentAnimation === key
  }

  public toDefaultClip(): void {
    this.clip = this.defaultClip
    this.width = this.clip.width
    this.height = this.clip.height
  }

  public update(): void {
    super.update()
    if (this._currentAnimation === null || this._animations[this._currentAnimation] === undefined) {
      return
    }

    const { deltaTime } = this.globalState
    let timePerFrame = 1 / this.animationFps
    this._timeElapsed += deltaTime

    if (this._animationIndex === 0 || this._timeElapsed >= timePerFrame) {
      let clips: Clip[] = this._animations[this._currentAnimation]
      let currentClip: Clip = clips[this._animationIndex % clips.length]

      this.clip = currentClip
      this.width = currentClip.width
      this.height = currentClip.height

      this._animationIndex++
      this._timeElapsed = 0
    }
  }
}

export default AnimatedSprite

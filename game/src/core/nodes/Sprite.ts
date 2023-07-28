import Rectangle from './Rectangle'
import { Vector2D, Clip } from '../interfaces'
import Config from '../Config'

class Sprite extends Rectangle {
  public texture: HTMLImageElement
  public clip: Clip
  public pivot: Vector2D

  constructor(pos: Vector2D, pivot: Vector2D, clip: Clip, texture: HTMLImageElement) {
    super(pos, { width: clip.width, height: clip.height })
    this.clip = clip
    this.pivot = pivot
    this.texture = texture
  }

  public update(): void {
    super.update()
    if (
      this.right - this.camera.x < 0 ||
      this.x - this.camera.x > Config.instance.viewport.width ||
      this.bottom - this.camera.y < 0 ||
      this.y - this.camera.y > Config.instance.viewport.height
    ) {
      this.cancelRender = true
    }
  }

  public render(): void {
    super.render()

    this.ctx.save()
    this.ctx.translate(this.pivot.x, this.pivot.y)
    this.ctx.drawImage(
      this.texture,
      this.clip.sourceX,
      this.clip.sourceY,
      this.clip.sourceWidth,
      this.clip.sourceHeight,
      ~~((this.x - this.pivot.x - this.clip.offsetX - this.camera.x) / 2) * 2,
      ~~((this.y - this.pivot.y - this.clip.offsetY - this.camera.y) / 2) * 2,
      this.width,
      this.height
    )
    this.ctx.restore()
  }
}

export default Sprite

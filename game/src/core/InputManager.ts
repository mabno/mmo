import { Vector2D, InputEvent } from './interfaces'
import Config from './Config'
import Singleton from './Singleton'

class InputManager extends Singleton {
  protected static _instance: InputManager
  protected static _class: any = InputManager
  private _events: InputEvent[] = []
  private _canvas: HTMLCanvasElement
  public cursor: Vector2D = { x: 0, y: 0 }
  public scale: Vector2D = { x: 0, y: 0 }

  protected constructor() {
    super()
    window.addEventListener('click', this.onEvent.bind(this))
    window.addEventListener('keydown', this.onEvent.bind(this))
    window.addEventListener('keyup', this.onEvent.bind(this))
    window.addEventListener('mousemove', this.mouseMove.bind(this))
    window.addEventListener('mousedown', this.onEvent.bind(this))
    window.addEventListener('mouseup', this.onEvent.bind(this))
  }

  public setCanvas(canvas: HTMLCanvasElement) {
    this._canvas = canvas
  }

  public on(nodeId, type, callback) {
    this._events.push({ nodeId, type, callback })
  }

  public removeEvents(nodeId) {
    this._events = this._events.filter((e) => e.nodeId !== nodeId)
  }

  public cursorHide() {
    this._canvas.style.cursor = 'none'
  }
  public cursorShow() {
    this._canvas.style.cursor = 'show'
  }

  private onEvent(e: Event): void {
    for (let event of this._events) {
      if (event.type === e.type) {
        event.callback(e)
      }
    }
  }

  private mouseMove(e: MouseEvent): void {
    this.cursor.x = (e.clientX - this._canvas.offsetLeft) * this.scale.x
    this.cursor.y = (e.clientY - this._canvas.offsetTop) * this.scale.y
  }

  public calculateCursorScale(): void {
    // This calculates the ratio of the original game dimension with the rescaled game dimension
    let { viewport } = Config.instance
    this.scale.x = viewport.width / this._canvas.offsetWidth
    this.scale.y = viewport.height / this._canvas.offsetHeight
  }
}

export default InputManager

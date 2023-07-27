import Node from './Node'
import InputManager from './InputManager'
import GlobalState from './GlobalState'
import Config from './Config'
import { DeltaTime, ConfigOptions } from './interfaces'

class Game {
  private _canvas: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D
  private _rootNode: Node
  private _time: DeltaTime = {
    now: 0,
    oldTime: 0,
    frames: 0,
    deltaAccumulator: 0,
  }
  public init: Function

  constructor(canvas: HTMLCanvasElement, rootNode: Node, config: ConfigOptions) {
    Config.instance.viewport = config

    this._canvas = canvas
    this._canvas.width = Config.instance.viewport.width
    this._canvas.height = Config.instance.viewport.height
    this._ctx = this._canvas.getContext('2d')!
    this._ctx.imageSmoothingEnabled = false
    InputManager.instance.setCanvas(this._canvas)
    this._rootNode = rootNode
    this._rootNode.ctx = this._ctx
    this._rootNode.compositeOperation = 'destination-over'

    window.addEventListener('resize', this.onWindowResize.bind(this))
  }

  private _init(): void {
    this.init()
    this._rootNode.enter()
  }

  private cleanCanvas(): void {
    const { width, height } = Config.instance.viewport
    this._ctx.clearRect(0, 0, width, height)
  }

  private calculateDeltaTime(): void {
    this._time.now = Date.now()
    GlobalState.instance.deltaTime = (this._time.now - this._time.oldTime) / 1000
    this._time.oldTime = this._time.now
    this._time.deltaAccumulator += GlobalState.instance.deltaTime
    this._time.frames++
    if (this._time.deltaAccumulator >= 1) {
      GlobalState.instance.fps = this._time.frames
      this._time.frames = 0
      this._time.deltaAccumulator = 0
    }
  }

  private scaleCanvas(): void {
    let x, y
    let { viewport } = Config.instance
    x = viewport.width / window.innerWidth
    y = viewport.height / window.innerHeight
    if (x >= y) {
      this._canvas.style.width = '100%'
      this._canvas.style.height = 'auto'
    } else {
      this._canvas.style.width = 'auto'
      this._canvas.style.height = '100%'
    }
  }

  private onWindowResize(): void {
    this.scaleCanvas()
    InputManager.instance.calculateCursorScale()
  }

  private loop(): void {
    this.calculateDeltaTime()
    this.cleanCanvas()
    this._rootNode.runChildren()
    this._rootNode.update()
    this._rootNode.render()
    requestAnimationFrame(this.loop.bind(this))
  }

  public run(): void {
    this.scaleCanvas()

    setInterval(() => {
      InputManager.instance.calculateCursorScale()
    }, 1)
    this._init()
    this.loop()
  }
}

export default Game

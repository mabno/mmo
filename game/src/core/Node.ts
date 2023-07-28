import GlobalState from './GlobalState'
import InputManager from './InputManager'
import Config from './Config'
import { Vector2D, Dimension2D } from './interfaces'
import { v4 as uuid } from 'uuid'

abstract class Node {
  public id: string
  public x: number
  public y: number
  public renderPriority: number = 0
  public compositeOperation: string
  public ctx: CanvasRenderingContext2D
  public camera: Vector2D = { x: 0, y: 0 }

  public cancelRender: boolean = false

  protected globalState: GlobalState = GlobalState.instance
  protected input: InputManager = InputManager.instance

  private _children: Node[] = []
  private _parent: Node

  constructor(pos: Vector2D = { x: 0, y: 0 }) {
    this.id = uuid()
    this.x = pos.x
    this.y = pos.y
  }

  public get viewport(): Dimension2D {
    return Config.instance.viewport
  }

  public get children(): any[] {
    return this._children.sort((a, b) => b.renderPriority - a.renderPriority)
  }

  public get parent(): Node {
    return this._parent
  }

  public runChildren(): void {
    for (let child of this.children) {
      child.update()
      if (!child.cancelRender) child.render()
      child.cancelRender = false
      child.runChildren()
    }
  }

  public addNode(node: Node): void {
    if (!this.ctx) throw 'Set CanvasRenderingContext2D to the first node'
    if (!node.compositeOperation) node.compositeOperation = this.compositeOperation
    node.ctx = this.ctx
    node.camera = this.camera
    node._parent = this
    node.enter()
    this._children.push(node)
  }

  public removeNode(node: Node): void {
    let prevLength = this._children.length
    this._children = this._children.filter((e) => e.id !== node.id)
    this.input.removeEvents(node.id)
    if (prevLength !== this._children.length) node.exit()
  }

  distanceTo(node: Node): number {
    return Math.sqrt(Math.pow(this.x - node.x, 2) + Math.pow(this.y - node.y, 2))
  }

  public enter(): void {}

  public exit(): void {}

  public update(): void {}

  public render(): void {
    this.ctx.globalCompositeOperation = this.compositeOperation
  }
}

export default Node

import Node from './core/Node'
import Text from './core/nodes/Text'
import scenes from './scenes'
import sceneManager from './sceneManager'

sceneManager.addScenes({
  initial: scenes.preload,
  sandbox: scenes.sandbox,
})

class RootNode extends Node {
  fps: Text

  public enter(): void {
    //this.input.cursorHide()
    const instructions = new Text(
      { x: this.viewport.width - 10, y: 30 },
      'WASD for move\nLeft-Shift to sprint\nHold right click to target and press F to attack ',
      { fillStyle: '#fff', font: 'OldSchoolAdventures', fontSize: 18, textAlign: 'right' },
      32
    )

    this.fps = new Text({ x: 5, y: 30 }, 'dfdsfds', { fillStyle: '#fff', font: 'OldSchoolAdventures', fontSize: 18, textAlign: 'left' })
    this.addNode(instructions)
    this.addNode(this.fps)
    this.addNode(sceneManager)
  }

  public update(): void {
    this.fps.content = `FPS: ${this.globalState.fps}`
  }

  public render(): void {
    super.render()
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, this.viewport.width, this.viewport.height)
  }
}

export default RootNode

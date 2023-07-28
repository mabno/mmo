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
    this.input.cursorHide()
    this.fps = new Text({ x: 5, y: 30 }, 'dfdsfds', { fillStyle: '#000', font: 'sans-serif', fontSize: 32, textAlign: 'left' })
    this.fps.compositeOperation = 'source-over'
    this.addNode(sceneManager)
    this.addNode(this.fps)
  }

  public update(): void {
    this.fps.content = `FPS: ${this.globalState.fps}`
  }
}

export default RootNode

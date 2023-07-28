import Node from './core/Node'
import Text from './core/nodes/Text'
import scenes from './scenes'
import sceneManager from './sceneManager'
import Cursor from './mynodes/Cursor'

sceneManager.addScenes({
  initial: scenes.preload,
  menu: scenes.menu,
  sandbox: scenes.sandbox,
})

class RootNode extends Node {
  fps: Text

  public enter(): void {
    this.input.cursorHide()
    this.fps = new Text({ x: 1, y: 20 }, 'dfdsfds', { fillStyle: '#fff', font: 'sans-serif', fontSize: 16, textAlign: 'left' })
    this.fps.compositeOperation = 'source-over'
    this.fps.renderPriority = 0

    const cursor = new Cursor({ x: 0, y: 0 })
    cursor.compositeOperation = 'source-over'
    this.addNode(sceneManager)
    this.addNode(this.fps)
    this.addNode(cursor)
  }

  public update(): void {
    this.fps.content = `FPS: ${this.globalState.fps}`
  }
}

export default RootNode

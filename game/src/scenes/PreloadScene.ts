import Node from '../core/Node'
import Text from '../core/nodes/Text'
import AssetsManager from '../core/AssetsManager'
import sceneManager from '../sceneManager'

class PreloadScene extends Node {
  public enter(): void {
    super.enter()

    const preloadText: Text = new Text({ x: this.viewport.width / 2, y: this.viewport.height / 2 }, 'Loading resources...', {
      fillStyle: '#fff',
      font: 'sans-serif',
      fontSize: 22,
      textAlign: 'center',
    })

    this.addNode(preloadText)

    AssetsManager.instance.on('progress', (loaded: number, total: number) => {
      preloadText.content = `Loaded ${~~((loaded / total) * 100)}% resources`
    })
    AssetsManager.instance.on('complete', (loaded: number, total: number) => {
      sceneManager.changeScene('sandbox')
    })
  }
}

export default PreloadScene

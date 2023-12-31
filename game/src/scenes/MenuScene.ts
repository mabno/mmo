import Node from '../core/Node'
import Text from '../core/nodes/Text'
import AssetsManager from '../core/AssetsManager'
import sceneManager from '../sceneManager'
import Sprite from '../core/nodes/Sprite'

class MenuScene extends Node {
  p: Sprite

  public enter(): void {
    super.enter()
    let textContent = `
			This is a little demo of my simple node-based html5 game engine\n
			It's not completed but implements basic features of a \"game engine\"\n
			💻️ Developed by Mariano Baldovino
			`
    let textContent2 = `
			Demo features:\n
			💡️ Torch illumination effect\n
			🖼️ Sprites render\n
			🏚️ Walls collision\n
			🗺️ Maps generated by images\n
			🤺️ Player four-direction movement\n
			🏹️ Spritesheet and animations
		`
    let label = new Text(
      { x: this.viewport.width / 2, y: 100 },
      textContent,
      { fillStyle: '#fff', font: 'sans-serif', fontSize: 24, textAlign: 'center' },
      26
    )
    let label2 = new Text({ x: 20, y: 300 }, textContent2, { fillStyle: '#fff', font: 'sans-serif', fontSize: 16, textAlign: 'left' }, 16)

    let playButton = new Sprite(
      { x: 350, y: 300 },
      { x: 0, y: 0 },
      { sourceX: 0, sourceY: 0, sourceWidth: 479, sourceHeight: 157, offsetX: 0, offsetY: 0, width: 479, height: 157 },
      AssetsManager.instance.getImage('player')
    )
    this.addNode(label)
    this.addNode(label2)
    this.addNode(playButton)

    this.input.on(this.id, 'click', (e) => {
      if (playButton.isInside(this.input.cursor)) {
        sceneManager.changeScene('sandbox')
      }
    })
  }
}

export default MenuScene

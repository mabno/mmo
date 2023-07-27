import { Vector2D, Dimension2D } from '../core/interfaces'
import Node from '../core/Node'
import AssetsManager from '../core/AssetsManager'
import AnimatedSprite from '../core/nodes/AnimatedSprite'
import Text from '../core/nodes/Text'
import SpriteSheet from '../core/SpriteSheet'
import Player from '../mynodes/Player'
import Walls from '../mynodes/Walls'
import mapGen from '../mapGen'

import lighJson from '../anim/light.json'
import fireJson from '../anim/fire.json'

const lightSpriteSheet = new SpriteSheet(lighJson)
const fireSpriteSheet = new SpriteSheet(fireJson)

class Darkness extends Node {
  public enter(): void {
    super.enter()
  }
  public render(): void {
    this.ctx.fillStyle = 'rgba(0,0,0,1)'
    this.ctx.fillRect(0, 0, this.viewport.width, this.viewport.height)
  }
}

class SandboxScene extends Node {
  player?: Player
  playerLight?: AnimatedSprite
  walls?: Walls

  public enter(): void {
    super.enter()

    this.camera = { x: 0, y: 0 }
    let map = mapGen(AssetsManager.instance.getImage('worldtest'))
    console.log(map)

    this.walls = new Walls()
    this.walls.map = map
    this.player = new Player({ x: 200, y: 150 }, { width: 40, height: 32 })
    this.player.colliders = this.walls.children

    this.playerLight = new AnimatedSprite(
      { x: 100, y: 100 },
      { x: 0, y: 0 },
      lightSpriteSheet.get([0]),
      AssetsManager.instance.getImage('light'),
      {
        loop: lightSpriteSheet.get([0, 1, 2, 3, 4, 5, 4, 3, 2, 1]),
      }
    )
    this.playerLight.animationFps = 6
    this.playerLight.play('loop')

    const instructionsLabel = new Text({ x: 200, y: 100 }, 'Movement: WASD keys', {
      fillStyle: '#fff',
      font: 'sans-serif',
      fontSize: 16,
      textAlign: 'center',
    })

    const light = new AnimatedSprite(
      { x: 640, y: 640 },
      { x: 0, y: 0 },
      lightSpriteSheet.get([0]),
      AssetsManager.instance.getImage('light'),
      {
        loop: lightSpriteSheet.get([0, 1, 2, 3, 4, 5, 4, 3, 2, 1]),
      }
    )
    light.animationFps = 6
    light.play('loop')

    const fire = new AnimatedSprite({ x: 640, y: 640 }, { x: 0, y: 0 }, fireSpriteSheet.get([0]), AssetsManager.instance.getImage('fire'), {
      loop: fireSpriteSheet.get([0, 1, 2, 3, 4, 5, 6, 7]),
    })
    fire.animationFps = 6
    fire.play('loop')
    fire.centerX = light.centerX
    fire.centerY = light.centerY

    this.addNode(new Darkness())
    this.compositeOperation = 'destination-out'
    this.addNode(this.playerLight)
    this.addNode(light)
    this.compositeOperation = 'destination-over'
    this.addNode(this.player)
    this.addNode(fire)
    this.addNode(instructionsLabel)
    this.addNode(this.walls)
  }

  public update(): void {
    super.update()
    if (!this.playerLight || !this.player) return
    this.playerLight.centerX = this.player.centerX
    this.playerLight.centerY = this.player.centerY
    this.camera.x = this.player.centerX - this.viewport.width / 2
    this.camera.y = this.player.centerY - this.viewport.height / 2
  }
}

export default SandboxScene

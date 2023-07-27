import { Vector2D, Dimension2D } from '../core/interfaces'
import Node from '../core/Node'
import AssetsManager from '../core/AssetsManager'
import AnimatedSprite from '../core/nodes/AnimatedSprite'
import Text from '../core/nodes/Text'
import SpriteSheet from '../core/SpriteSheet'
import Player from '../mynodes/Player'
import Map from '../mynodes/Map'
import mapGen from '../mapGen'

import lighJson from '../anim/light.json'
import fireJson from '../anim/fire.json'
import Tile from '../mynodes/Tile'

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
  player: Player
  map: Map

  public enter(): void {
    super.enter()

    this.camera = { x: 0, y: 0 }
    let map = mapGen(AssetsManager.instance.getImage('worldtest'))
    console.log(map)

    this.map = new Map(map)
    this.player = new Player({ x: 200, y: 150 }, { width: 16, height: 16 })
    console.log(this.map.children)

    const instructionsLabel = new Text({ x: 200, y: 100 }, 'Movement: WASD keys', {
      fillStyle: '#fff',
      font: 'sans-serif',
      fontSize: 16,
      textAlign: 'center',
    })

    this.addNode(instructionsLabel)
    this.addNode(this.player)
    this.addNode(this.map)
    this.addNode(new Darkness())
    this.player.colliders = this.map.children.filter((e: Tile) => e.type === 999).map((e) => e.children[0])
  }

  public update(): void {
    super.update()
    this.camera.x = this.player.centerX - this.viewport.width / 2
    this.camera.y = this.player.centerY - this.viewport.height / 2
  }
}

export default SandboxScene

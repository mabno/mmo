import './index.css'
import Game from './core/Game'
import AssetsManager from './core/AssetsManager'
import RootNode from './RootNode'

import playerImage from './assets/player.png'
import worldtestImage from './assets/worldtest.png'
import worldtestObjectsImage from './assets/worldtest-objects.png'
import tilemapImage from './assets/punyworld-overworld-tileset.png'

const config = { width: 1920, height: 1080 }
const game = new Game(document.querySelector('#canvas')!, new RootNode(), config)

game.init = function () {
  AssetsManager.instance.addImage('player', playerImage)
  AssetsManager.instance.addImage('worldtest', worldtestImage)
  AssetsManager.instance.addImage('worldtestObjects', worldtestObjectsImage)
  AssetsManager.instance.addImage('tilemap', tilemapImage)

  AssetsManager.instance.load()
}

window.addEventListener('DOMContentLoaded', () => {
  game.run()
})

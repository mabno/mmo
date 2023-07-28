import './index.css'
import Game from './core/Game'
import AssetsManager from './core/AssetsManager'
import RootNode from './RootNode'

import cursorImage from './assets/cursor.png'
import playerImage from './assets/Human-Worker-Cyan.png'
import playButtonImage from './assets/play.png'
import floorImage from './assets/floor.png'
import wallImage from './assets/wall.png'
import lightImage from './assets/light3.png'
import fireImage from './assets/fire.png'
import worldtestImage from './assets/worldtest.png'
import worldtestObjectsImage from './assets/worldtest-objects.png'
import tilemapImage from './assets/punyworld-overworld-tileset.png'

const config = { width: 400, height: 300 }
const game = new Game(document.querySelector('#canvas')!, new RootNode(), config)

game.init = function () {
  AssetsManager.instance.addImage('cursor', cursorImage)
  AssetsManager.instance.addImage('player', playerImage)
  AssetsManager.instance.addImage('play-button', playButtonImage)
  AssetsManager.instance.addImage('floor', floorImage)
  AssetsManager.instance.addImage('wall', wallImage)
  AssetsManager.instance.addImage('light', lightImage)
  AssetsManager.instance.addImage('fire', fireImage)
  AssetsManager.instance.addImage('worldtest', worldtestImage)
  AssetsManager.instance.addImage('worldtestObjects', worldtestObjectsImage)
  AssetsManager.instance.addImage('tilemap', tilemapImage)

  AssetsManager.instance.load()
}

window.addEventListener('DOMContentLoaded', () => {
  game.run()
})

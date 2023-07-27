import AssetsManager from '../core/AssetsManager';
import Node from '../core/Node';
import Sprite from '../core/nodes/Sprite';


class Walls extends Node{
	map:Array<Array<number>>;

	public enter() : void {
		this.map.forEach((row, y) => {
			row.forEach((col, x) => {
				if(col === 1){
					let wall = new Sprite(
						{x: x*64, y: y*64},
						{x: 0, y: 0},
						{sourceX: 0, sourceY: 0, sourceWidth: 64, sourceHeight: 64, offsetX: 0, offsetY: 0, width: 64, height: 64},
						AssetsManager.instance.getImage('wall')
					);
					this.addNode(wall);
				}
			})
		})
	}
}

export default Walls;
import Node from './core/Node';
import { AssociativeArray } from './core/interfaces';

class SceneManager extends Node{
	private _scenes : AssociativeArray<Node> = {}

	public addScenes(scenes: AssociativeArray<Node>){
		this._scenes = scenes;
	}

	public changeScene(key: string){
		let exitScene = this.children[0];
		if(exitScene) this.removeNode(exitScene);

		let enterScene = this._scenes[key];
		this.addNode(enterScene);
	}

	public enter() : void {
		if(this._scenes['initial']){
			this.addNode(this._scenes['initial']);
		}
	}
}

export default new SceneManager();

import Singleton from './Singleton';
import {AssociativeArray} from './interfaces';

class AssetsManager extends Singleton{
	protected static _instance : AssetsManager;
	protected static _class : any = AssetsManager;
	private _toLoad : Array<any> = [];
	private _images : AssociativeArray<HTMLImageElement> = {};
	private _sounds : AssociativeArray<HTMLAudioElement> = {};
	private _loaded : number = 0;
	private _onProgress : Function = () => {};
	private _onComplete : Function = () => {};

	public addImage(key: string, path: string) : void {
		this._toLoad.push({
			key,
			path,
			type: 'image'
		})
	}

	public load() : void {
		this._toLoad.forEach(asset => {
			if(asset.type === 'image'){
				const img = new Image();
				img.src = asset.path;
				img.onload = this.progress.bind(this);
				this._images[asset.key] = img;
			}
		})
	}

	private progress() : void {
		this._loaded++;
		if(this._loaded === this._toLoad.length){
			this._onComplete(this._loaded, this._toLoad.length);
		} else {
			this._onProgress(this._loaded, this._toLoad.length);
		}
	}

	public getImage(key: string) : HTMLImageElement{
		return this._images[key];
	}

	public on(event: string, callback: Function) : void{
		if(event === 'progress'){
			this._onProgress = callback;
		}
		else if(event === 'complete'){
			this._onComplete = callback;
		}
	}

}

export default AssetsManager;
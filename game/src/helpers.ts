import Rectangle from './core/nodes/Rectangle';

export function isSomeColliding(colliders : Rectangle[], callback: Function) : void {
	for(let collider of colliders){
		if(this.isColliding(collider)){
			callback(collider);
			return;
		}
	}
}
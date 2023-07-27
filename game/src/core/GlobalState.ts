import Singleton from './Singleton';

class GlobalState extends Singleton{
	protected static _instance: GlobalState;
	protected static _class : any = GlobalState;

	deltaTime: number = 0;
	fps: number = 0;
}

export default GlobalState;
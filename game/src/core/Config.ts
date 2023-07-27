import Singleton from './Singleton';
import {Dimension2D} from './interfaces';


class Config extends Singleton{
	protected static _instance: Config;
	protected static _class : any = Config;
	public viewport : Dimension2D = {width: 0, height: 0};
}

export default Config;
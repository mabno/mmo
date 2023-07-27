class Singleton{
	protected static _instance : any;
	protected static _class : any

	public static get instance() : any{
		if(this._instance === undefined){
			this._instance = new this._class();
		}
		return this._instance;
	}
}

export default Singleton;
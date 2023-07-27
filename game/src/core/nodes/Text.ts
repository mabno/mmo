import Node from '../Node';
import {Vector2D, TextStyle} from '../interfaces';


class Text extends Node{
	public content : string;
	public style : TextStyle;
	public lineHeight : number;
	public maxWidth : number;
	private _metrics : TextMetrics;

	constructor(pos: Vector2D, content: string, style : TextStyle, lineHeight:number = 1, maxWidth: number = undefined){
		super(pos);
		this.content = content;
		this.style = style;
		this.lineHeight = lineHeight
		this.maxWidth = maxWidth;
	}

	public get width() : number{
		return this._metrics.width;
	}

	public render() : void {
		super.render();
		let lines = this.content.split('\n');
		this.ctx.font = `${this.style.fontSize}px ${this.style.font}`;
		if(this.style.textAlign) this.ctx.textAlign = this.style.textAlign;
		if(this.style.textBaseline) this.ctx.textBaseline = this.style.textBaseline;
		if(this.style.direction) this.ctx.direction = this.style.direction;
		if(this.style.fillStyle) {
			this.ctx.fillStyle = this.style.fillStyle
			lines.forEach((line, i) => {
				this.ctx.fillText(line, this.x-this.camera.x, this.y+(this.lineHeight*i)-this.camera.y, this.maxWidth);
			});
		}
		if(this.style.strokeStyle) {
			this.ctx.strokeStyle = this.style.strokeStyle
				lines.forEach((line, i) => {
				this.ctx.strokeText(line, this.x-this.camera.x, this.y+(this.lineHeight*i)-this.camera.y, this.maxWidth);
			});
		}
		this._metrics = this.ctx.measureText(this.content);
	}

}

export default Text;

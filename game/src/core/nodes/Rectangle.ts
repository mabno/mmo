import Node from '../Node';
import { Vector2D, Dimension2D } from '../interfaces';

class Rectangle extends Node{
	width:number;
	height:number;

	constructor(pos: Vector2D, size: Dimension2D){
		super(pos);
		this.width = size.width;
		this.height = size.height;
	}

	public set right(value) {
		this.x = value - this.width;
	}

	public get right() : number {
		return this.x + this.width;
	}

	public set bottom(value) {
		this.y = value - this.height;
	}

	public get bottom() : number {
		return this.y + this.height;
	}

	public set centerX(value) {
		this.x = value - this.width/2;
	}

	public get centerX() : number {
		return this.x + this.width/2;
	}

	public set centerY(value) {
		this.y = value - this.height/2;
	}

	public get centerY() : number {
		return this.y + this.height/2;
	}

	public isInside(point : Vector2D) : boolean {
		return (point.x > this.x && point.x < this.right &&
				point.y > this.y && point.y < this.bottom);
	}

	public isColliding(rectangle : Rectangle) : boolean {
		return (rectangle.right > this.x && rectangle.x < this.right &&
				rectangle.bottom > this.y && rectangle.y < this.bottom);
	}
}
export default Rectangle;
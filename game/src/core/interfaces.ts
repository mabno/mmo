export interface Clip {
	sourceX: number;
	sourceY: number;
	sourceWidth: number;
	sourceHeight: number;
	offsetX: number;
	offsetY: number;
	width: number;
	height: number;
}

export interface Vector2D {
	x: number;
	y: number;
}

export interface Dimension2D {
	width: number;
	height: number;
}


export interface AssociativeArray<Any> {
	[key: string] : Any;
}

export interface InputEvent {
	nodeId: string;
	type: string;
	callback: Function;
}

export interface TextStyle {
	fillStyle?: string;
	strokeStyle?: string;
	font?: string;
	fontSize?: number;
	textAlign?: CanvasTextAlign; // start, end, left, right or center
	textBaseline?: CanvasTextBaseline; // top, hanging, middle, alphabetic, ideographic, bottom
	direction?: CanvasDirection; // ltr, rtl, inherit
}

export interface DeltaTime {
	now:number;
	oldTime:number;
	frames:number;
	deltaAccumulator:number;
}

export interface ConfigOptions {
	width:number;
	height:number;
}

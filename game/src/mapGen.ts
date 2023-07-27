function imageData(img : HTMLImageElement){
	const fakeCanvas = document.createElement('canvas');
	fakeCanvas.width = img.width;
	fakeCanvas.height = img.height;
	const fakeCtx = fakeCanvas.getContext('2d');
	fakeCtx.drawImage(img, 0, 0, img.width, img.height)
	return fakeCtx.getImageData(0, 0, img.width, img.height).data;

}

function mapGen(img: HTMLImageElement){
	const data = imageData(img);
	let world = [[]];
	let col = 0;
	let row = 0;

	for(let i = 0; i < data.length/4; i++){
		if(col === img.width){
			world.push([]);
			row++
			col = 0;
		}

		let r, g, b;
		r = data[i*4];
		g = data[i*4+1];
		b = data[i*4+2];

		if(r === 0 && g === 0 && b === 0){
			world[row][col] = 1;
		} else {
			world[row][col] = 0;
		}

		col++;
	}

	return world;
}

export default mapGen;
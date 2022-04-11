// Modules
const axios = require("axios");

// Constants
const FRAME_SIZE = 16*16;

function serializePixelData (frame) {
	return frame.map(pixel => `${pixel.r},${pixel.g},${pixel.b}`).join("|");
}

function drawFrame (data) {

	//console.log(serializePixelData(data));
	//console.log("-");

	axios.post("http://192.168.64.112", serializePixelData(data),
		{
		headers: {
			"Content-Type": "text/plain"
		}
	}).catch(err => console.error(err));
}

function clearFrame (frame) {
	for (let i = 0; i < FRAME_SIZE; i++) {
		frame[i] = { r: 0, g: 0, b: 0 };
	}
}

(() => {

	const frame = [];
	// let rowIndex = 0;

	// Initialize frame
	for (let i = 0; i < FRAME_SIZE; i++) {
		frame.push({ r: 0, g: 0, b: 0 });
	}

	clearFrame(frame);
	drawFrame(frame);

	let pixelIndex = 0;
	let colorIndex = 0;

	const colors = [
		{ r: 255, g: 0, b: 0 },
		{ r: 0, g: 255, b: 0 },
		{ r: 0, g: 0, b: 255 },
	]

	setInterval(() => {

		// if (pixelIndex === 0) {
		// 	frame[FRAME_SIZE - 1] = { r: 0, g: 0, b: 0 };
		// } else {
		// 	frame[pixelIndex - 1] = { r: 0, g: 0, b: 0 };
		// }

		// frame[pixelIndex] = { r: 255, g: 255, b: 255 };

		// pixelIndex++;

		// if (pixelIndex === FRAME_SIZE) {
		// 	pixelIndex = 0;
		// }

		// if (pixelIndex === 0) {
		// 	frame.fill({ r: 255, g: 0, b: 0 });
		// } else if (pixelIndex === 1) {
		// 	frame.fill({ r: 0, g: 255, b: 0 });
		// } else {
		// 	frame.fill({ r: 0, g: 0, b: 255 });
		// }

		if (pixelIndex === 0) {
			frame[FRAME_SIZE - 1] = { r: 0, g: 0, b: 0 };
		} else {
			frame[pixelIndex - 1] = { r: 0, g: 0, b: 0 };
		}

		frame[pixelIndex] = colors[colorIndex];

		pixelIndex++;
		colorIndex++;

		if (colorIndex === 3) {
			colorIndex = 0;
		}

		if (pixelIndex === FRAME_SIZE) {
			pixelIndex = 0;
		}

		drawFrame(frame);

		// const
		// 	rowStart = rowIndex * 16,
		// 	rowEnd = rowStart + 16;

		// clearFrame(frame);
	
		// for (let pixelIndex = rowStart; pixelIndex < rowEnd; pixelIndex++) {
		// 	frame[pixelIndex].r = 255;
		// }
	
		// rowIndex++;
	
		// if (rowIndex === 16) {
		// 	rowIndex = 0;
		// }
	
		// drawFrame(frame);
		// console.log(frame);


	
	}, 300);

})();
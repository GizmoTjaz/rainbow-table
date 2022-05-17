// Modules
import sharp from "sharp";

// Types
import { DrawnFrame, RawFrame } from "@typings/types";

export default async function (frame: RawFrame): Promise<DrawnFrame> {

	const
		image = sharp(frame, { sequentialRead: true }).raw(),
		imageData = await image.raw().toBuffer({ resolveWithObject: true });

	const {
		info: {
			width: IMAGE_WIDTH,
			height: IMAGE_HEIGHT
		},
		data: IMAGE_DATA
	} = imageData;

	let drawnFrame = "";

	for (let y = 0; y < IMAGE_HEIGHT; y++) {
		for (let x = 0; x < IMAGE_WIDTH; x++) {

			const pixelIndex = (x * 3) + (y * IMAGE_WIDTH * 3);

			// drawnFrame += `${IMAGE_DATA[pixelIndex]},${IMAGE_DATA[pixelIndex + 1]},${IMAGE_DATA[pixelIndex] + 2}|`;
			drawnFrame += `${IMAGE_DATA[pixelIndex]},${IMAGE_DATA[pixelIndex + 1]},${IMAGE_DATA[pixelIndex] + 2}|`;

		}
	}

	drawnFrame = drawnFrame.slice(0, -1);

	return {
		width: IMAGE_WIDTH,
		height: IMAGE_HEIGHT,
		data: drawnFrame
	};

}
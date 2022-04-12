#ifndef RENDER_H
#define RENDER_H

// Utils
#include "env.h"

void clearCanvas (const CRGBArray<NUM_LEDS> &canvas) {
	for (CRGB & pixel : canvas) {
		pixel = CRGB(0, 0, 0);
	}
}

void renderCanvas (const CRGBArray<NUM_LEDS> &canvas, const uint8_t (&canvasData)[MAX_PACKET_LENGTH], const size_t canvasDataLength) {

	uint8_t pixelIndex = 0;
	uint8_t colorChannelIndex = 0;
	uint8_t colorChannelValuePosition = 0;

	for (size_t i = 0; i < canvasDataLength; i++) {

		if (pixelIndex >= NUM_LEDS) {
			break;
		}

		char c = canvasData[i];

		if (c == '|') {

			colorChannelIndex = 0;
			colorChannelValuePosition = 0;

			pixelIndex++;

		} else if (c == ',') {

			colorChannelIndex++;
			colorChannelValuePosition = 0;

		} else {

			canvas[pixelIndex][colorChannelIndex] += (c - '0') * pow(10, 2 - colorChannelValuePosition);

			colorChannelValuePosition++;

			if (colorChannelValuePosition == 3) {
				colorChannelValuePosition = 0;
			}
		}
	}

}

#endif
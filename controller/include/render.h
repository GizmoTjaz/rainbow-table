#ifndef RENDER_H
#define RENDER_H

// Core
#include <string>

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

	bool isSkipMode = false;

	std::string skipIndex = "";

	CRGB _pixel = CRGB(0, 0, 0);

	for (size_t i = 0; i < canvasDataLength; i++) {

		// Don't allow non-existent LEDs to be called
		if (pixelIndex >= NUM_LEDS) {
			break;
		}

		char c = canvasData[i];

		switch (c) {
			case '|':

				if (isSkipMode) {

					pixelIndex = std::atoi(skipIndex.c_str());

					skipIndex = "";
					isSkipMode = false;

					break;
				}

				colorChannelIndex = 0;
				colorChannelValuePosition = 0;

				// Write temp pixel data to real pixel
				canvas[pixelIndex] = _pixel;
				_pixel = CRGB(0, 0, 0);

				pixelIndex++;

				break;
			case ',':
			
				colorChannelIndex++;
				colorChannelValuePosition = 0;
			
				break;
			case 'S':

				isSkipMode = true;

				break;
			default:

				if (isSkipMode) {

					skipIndex += c;

					break;
				} else if (colorChannelIndex < 3) {

					_pixel[colorChannelIndex] += (c - '0') * pow(10, 2 - colorChannelValuePosition);

					colorChannelValuePosition++;

					if (colorChannelValuePosition == 3) {
						colorChannelValuePosition = 0;
					}
				}

				// Write last pixel too
				if ((i + 1) == canvasDataLength) {
					canvas[pixelIndex] = _pixel;
					_pixel = CRGB(0, 0, 0);
				}
		}
	}

}

#endif
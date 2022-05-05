#ifndef RENDER_H
#define RENDER_H

// Core
#include <string>
#include <list>

// Utils
#include "env.h"

// Constants
const uint8_t ABSOLUTE_LED_INDEX_MAP[] = {
    15,  14,  13,  12,  11,  10,   9,   8,   7,   6,   5,   4,   3,   2,   1,   0,
    16,  17,  18,  19,  20,  21,  22,  23,  24,  25,  26,  27,  28,  29,  30,  31,
    47,  46,  45,  44,  43,  42,  41,  40,  39,  38,  37,  36,  35,  34,  33,  32,
    48,  49,  50,  51,  52,  53,  54,  55,  56,  57,  58,  59,  60,  61,  62,  63,
    79,  78,  77,  76,  75,  74,  73,  72,  71,  70,  69,  68,  67,  66,  65,  64,
    80,  81,  82,  83,  84,  85,  86,  87,  88,  89,  90,  91,  92,  93,  94,  95,
   111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101, 100,  99,  98,  97,  96,
   112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127,
   143, 142, 141, 140, 139, 138, 137, 136, 135, 134, 133, 132, 131, 130, 129, 128,
   144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159,
   175, 174, 173, 172, 171, 170, 169, 168, 167, 166, 165, 164, 163, 162, 161, 160,
   176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191,
   207, 206, 205, 204, 203, 202, 201, 200, 199, 198, 197, 196, 195, 194, 193, 192,
   208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223,
   239, 238, 237, 236, 235, 234, 233, 232, 231, 230, 229, 228, 227, 226, 225, 224,
   240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255
};

void writePixelData (const CRGBArray<NUM_LEDS> &canvas, const uint8_t &pixelIndex, const CRGB &pixelData) {
	canvas[ABSOLUTE_LED_INDEX_MAP[pixelIndex]] = pixelData;
}

void clearCanvas (const CRGBArray<NUM_LEDS> &canvas) {
	for (CRGB & pixel : canvas) {
		pixel = CRGB(0, 0, 0);
	}
}

void writeColorChannelValueToPixel (CRGB &pixel, std::list<char> &colorChannelValueDigits, const uint8_t &colorChannelIndex) {
	for (uint8_t i = 0; i < 3; i++) {
		if (colorChannelValueDigits.size() > 0) {
	
			pixel[colorChannelIndex] += (colorChannelValueDigits.back() - '0') * pow(10, i);

			colorChannelValueDigits.pop_back();
		}
	}
}

void renderCanvas (const CRGBArray<NUM_LEDS> &canvas, const char (&canvasData)[MAX_PACKET_LENGTH], const size_t &canvasDataLength) {

	uint8_t pixelIndex = 0;
	uint8_t colorChannelIndex = 0;
	uint8_t colorChannelValuePosition = 0;

	bool isSkipMode = false;

	std::string skipIndex = "";
	std::list<char> colorChannelValueDigits;

	CRGB _pixel = CRGB(0, 0, 0);

	for (size_t i = 0; i < canvasDataLength; i++) {

		const char c = canvasData[i];

		// Don't allow non-existent LEDs to be called
		if (pixelIndex >= NUM_LEDS) {
			break;
		}

		switch (c) {
			case '|':

				if (isSkipMode) {

					pixelIndex = std::atoi(skipIndex.c_str());

					skipIndex = "";
					isSkipMode = false;

				} else {

					writeColorChannelValueToPixel(_pixel, colorChannelValueDigits, colorChannelIndex);
					colorChannelValuePosition = 0;

					// Write temp pixel data to real pixel
					writePixelData(canvas, pixelIndex, _pixel);
					_pixel = CRGB(0, 0, 0);

					colorChannelIndex = 0;

					pixelIndex++;
				}

				break;
			case ',':

				writeColorChannelValueToPixel(_pixel, colorChannelValueDigits, colorChannelIndex);
				colorChannelValuePosition = 0;

				colorChannelIndex++;

				break;
			case 'C':

				clearCanvas(canvas);
				
				break;
			case 'S':

				isSkipMode = true;

				break;
			default:

				if (isSkipMode) {

					skipIndex += c;

				} else {

					colorChannelValueDigits.push_back(c);

					colorChannelValuePosition++;
				}
		}
	}

	int lastCharacterCode = (int)canvasData[canvasDataLength - 1];

	// Write last pixel if it's a number
	if (lastCharacterCode >= (int)'0' && lastCharacterCode <= (int)'9') {
		writeColorChannelValueToPixel(_pixel, colorChannelValueDigits, colorChannelIndex);
		writePixelData(canvas, pixelIndex, _pixel);
	}

}

#endif
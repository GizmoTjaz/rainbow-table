#ifndef ANIMATION_H
#define ANIMATION_H

// Utils
#include "render.h"

class AnimationProfile {
	
	public:

		int numFrames = NUM_LEDS;
		const CRGBArray<NUM_LEDS> &canvas;

		void renderPixel (const size_t &pixelIndex, const CRGB &pixelData) {
			writePixelData(this->canvas, pixelIndex, pixelData);
		}

		virtual void renderFrame (const size_t &frameNumber, const CRGB &animationColor) {
			this->renderPixel(frameNumber, animationColor);
		}

		AnimationProfile (const CRGBArray<NUM_LEDS> &canvas): canvas(canvas) {}

};

#endif
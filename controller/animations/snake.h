#pragma once

// Utils
#include "animation.h"

class SnakeAnimation : public AnimationProfile {

	public:
		
		void renderFrame (const size_t &frameNumber, const CRGB &animationColor) {
			this->renderPixel(frameNumber, animationColor);
		}

		SnakeAnimation (const CRGBArray<NUM_LEDS> &canvas): AnimationProfile(canvas) {}

};
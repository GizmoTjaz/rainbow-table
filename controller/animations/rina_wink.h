#pragma once

// Core
#include <string>

// Utils
#include "animation.h"
#include "render.h"

/*
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⣤⡞⠛⠛⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠏⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠷⡶⣿⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠛⠛⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠛⠛⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠿⠿⠀⠿⠿⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠿⠿⠀⠿⠿⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠿⠿⠀⠿⠿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠿⠿ ⠿⠿⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠶⣶⡶⡶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⣷⣆⡀⠀⠀⠀⠀⠀⣰⣾⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠚⢻⣤⠀⠀⣤⡟⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠹⠿⠿⠏⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
*/

const char RINA_WINK[MAX_PACKET_LENGTH] = {'0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','2','5','5',',','2','5','5',',','2','5','5','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','2','5','5',',','2','5','5',',','2','5','5','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','2','5','5',',','2','5','5',',','2','5','5','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','2','5','5',',','2','5','5',',','2','5','5','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','2','5','5',',','2','5','5',',','2','5','5','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','2','5','5',',','2','5','5',',','2','5','5','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','2','5','5',',','2','5','5',',','2','5','5','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','2','5','5',',','2','5','5',',','2','5','5','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','2','5','5',',','2','5','5',',','2','5','5','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','2','5','5',',','2','5','5',',','2','5','5','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','2','5','5',',','2','5','5',',','2','5','5','|','2','5','5',',','2','5','5',',','2','5','5','|','2','5','5',',','2','5','5',',','2','5','5','|','2','5','5',',','2','5','5',',','2','5','5','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|','0',',','0',',','0','|'};

size_t RINA_WINK_LENGTH = 1620;

class RinaWink : public AnimationProfile {

	public:
		
		void renderFrame (const size_t &frameNumber, const CRGB &animationColor) {
			renderCanvas(this->canvas, RINA_WINK, RINA_WINK_LENGTH);
		}

		RinaWink (const CRGBArray<NUM_LEDS> &canvas): AnimationProfile(canvas) {}

};
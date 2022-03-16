#include <Arduino.h>
#include <math.h>

// Networking
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>

// LED
#include <FastLED.h>
#define NUM_LEDS 16*16
#define NUM_LED_COLOR_VALUES NUM_LEDS*3

// Variables
CRGB leds[NUM_LEDS];
AsyncWebServer server(80);

void clearFrame () {
	for (size_t i = 0; i < NUM_LEDS; i++) {
		leds[i] = CRGB(0, 0, 0);
	}
}

void paintPixel (uint8_t pixelIndex, uint8_t channelIndex, uint8_t channelValue) {
	leds[pixelIndex][channelIndex] = channelValue;
}

void drawFrame (uint8_t *data, size_t dataLength) {

	clearFrame();

	uint8_t ledIndex = 0;

	uint8_t colorChannelIndex = 0;

	uint8_t colorChannelValue = 0;
	uint8_t colorChannelValueIndex = 0;

	size_t lastIndex = dataLength - 1;

	for (size_t i = 0; i < dataLength; i++) {

		char c = data[i];
		// Serial.print(c);

		if (c == '|') {

			colorChannelIndex = 0;

			colorChannelValue = 0;
			colorChannelValueIndex = 0;

			ledIndex++;

		} else if (c == ',') {
			
			paintPixel(ledIndex, colorChannelIndex, colorChannelValue);

			colorChannelValue = 0;
			colorChannelValueIndex = 0;

			colorChannelIndex++;

		} else if (colorChannelValueIndex < 3) { // Just in case

			colorChannelValue += (c - '0') * pow(10, 2 - colorChannelValueIndex);
			colorChannelValueIndex++;

			if (i == lastIndex) {
				paintPixel(ledIndex, colorChannelIndex, colorChannelValue);
			}

		}
		
	}


	// uint8_t pixelColorValues[NUM_LED_COLOR_VALUES] = { 0 };
	// int pixelColorValueIndex = 0;

	// uint8_t colorValue = 0;
	// uint8_t colorValueIndex = 0;

	// // Example payload: 0,255,0|255,0,0|255,255,255|0,0,0

	// for (size_t i = 0; i < dataLength; i++) {

	// 	char state = data[i];

	// 	if (state == '|') {

	// 		// Set the color value for the current pixel
	// 		pixelColorValues[pixelColorValueIndex] = colorValue;
	// 		pixelColorValueIndex++;

	// 		// Reset the color value
	// 		colorValue = 0;
	// 		colorValueIndex = 0;

	// 	} else if (state == ',') {



	// 	} else {

	// 		// Add the current color value to the current pixel
	// 		colorValue += (state - '0') * pow(10, 2 - colorValueIndex);
	// 		colorValueIndex++;

	// 	}




		
	// 	// if (state != ',' && colorValueIndex < 3) {
			
	// 	// 	/*
	// 	// 		Add parsed number to final color value

	// 	// 		first number = num*100
	// 	// 		second number = num*10
	// 	// 		third number = num*1

	// 	// 		color value = first + second + third
	// 	// 	*/

	// 	// 	colorValue += (state - '0') * pow(10, 2 - colorValueIndex);
	// 	// 	colorValueIndex++;
	// 	// }

	// 	// // Not using an else if because we want the last number to be pushed and parsed at the same time

	// 	// if (state == ',' || i == dataLength - 1) {

	// 	// 	// Push the color value to the pixel color values array
	// 	// 	pixelColorValues[pixelColorValueIndex] = colorValue;
			
	// 	// 	// Reset color value counting
	// 	// 	colorValueIndex = 0;
	// 	// 	colorValue = 0;

	// 	// 	pixelColorValueIndex++;
	// 	// }
	// }

	// // for (size_t i = 0; i < NUM_LEDS; i++) {
	// // 	leds[i] = CRGB(pixelColorValues[i*3], pixelColorValues[i*3 + 1], pixelColorValues[i*3 + 2]);
	// // }
}

// Utils
#include "constants.cpp"

void setup() {

	Serial.begin(9600);
  
	FastLED.addLeds<NEOPIXEL, 5>(leds, NUM_LEDS);

	WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

	while (WiFi.status() != WL_CONNECTED) {
		delay(500);
		Serial.print(".");
	}

	Serial.println("");
	Serial.println(WiFi.localIP());

	server.on(
		"/",
		HTTP_POST,
		[](AsyncWebServerRequest *request){},
		NULL,
		[](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
			
			Serial.print("LEN: ");
			Serial.println(len);
			Serial.print("TOTAL: ");
			Serial.println(total);

			drawFrame(data, len);
			
			//Serial.println();
			request->send(200);
		}
	);

	server.onNotFound([](AsyncWebServerRequest *request) {
		if (request->method() == HTTP_OPTIONS) {
			request->send(200);
		} else {
			request->send(404);
		}
	});

	DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
	DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "*");
	server.begin();
}

void loop() {

	// for (int row = 0; row < 16; row++) {
    
	// 	int startIndex = row * 16;

	// 	for (int i = 0; i < 16; i++) {
	// 		leds[i + startIndex] = CRGB::White;
	// 	}

	// 	FastLED.setBrightness(20);
	// 	FastLED.show();
	// 	delayMicroseconds(1);

	// 	for (int i = 0; i < 16; i++) {
	// 		leds[i + startIndex] = CRGB::Black;
	// 	}
	// }

	// for (int i = 0; i < 256; i++) {
	// 	if (i == X) {
	// 		leds[i] = CRGB::Black;
	// 	} else {
	// 		leds[i] = CRGB::White;
	// 	}
	// }

	// X++;
	// delay(100);

	// if (X > 0) {
	// 	leds[X-1] = CRGB::Black;
	// } else if (X == 0) {
	// 	leds[NUM_LEDS - 1] = CRGB::Black;
	// }

	// leds[X] = CRGB::White;

	// X++;

	// if (X == NUM_LEDS) {
	// 	X = 0;
	// }

	// delay(150);

	FastLED.setBrightness(15);
	FastLED.show();

	delay(10);
}
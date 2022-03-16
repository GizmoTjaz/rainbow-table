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

			drawFrame(data, len);
			
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

	FastLED.setBrightness(15);
	FastLED.show();

	delay(10);
}
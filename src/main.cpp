// Macros
#define NUM_LEDS 16 * 16
#define MAX_PACKET_SIZE NUM_LEDS * (3 * 3 + 2 + 1)

#include <Arduino.h>
#include <math.h>

// Networking
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>

// LED
#include <FastLED.h>

// Utils
#include "constants.cpp"

// Variables
uint8_t packet[MAX_PACKET_SIZE] = { 0 };
size_t packetSize = 0;
CRGB leds[NUM_LEDS];
AsyncWebServer server(80);

void clearFrame () {
	for (size_t i = 0; i < NUM_LEDS; i++) {
		leds[i] = CRGB(0, 0, 0);
	}
}

void paintPixel (const uint8_t pixelIndex, const uint8_t channelIndex, const uint8_t channelValue) {
	leds[pixelIndex][channelIndex] = channelValue;
}

void drawFrame (const uint8_t *data, const size_t dataLength) {

	// clearFrame();

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

			packetSize += len;

			for (size_t i = 0; i < len; i++) {
				packet[packetSize - len + i] = data[i];
			}

			if (packetSize == total) {

				drawFrame(packet, &packetSize);

				packetSize = 0;
				
				// Clear packet
				for (size_t i = 0; i < MAX_PACKET_SIZE; i++) {
					packet[i] = 0;
				}
			}
			
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
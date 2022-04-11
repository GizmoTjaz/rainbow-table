// Macros
#define NUM_LEDS 16 * 16
#define MAX_PACKET_LENGTH NUM_LEDS * (3 * 3 + 2 + 1)

// Core Libraries
#include <Arduino.h>
#include <math.h>

// Networking
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>

// LED
#include <FastLED.h>

// Utils
#include "wifi.cpp"

// Structs
CRGB leds[NUM_LEDS];
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

// Variables
uint8_t packet[MAX_PACKET_LENGTH] = { 0 };
size_t packetLength = 0;
bool isBusy = false;

void clearFrame () {
	for (size_t i = 0; i < NUM_LEDS; i++) {
		leds[i] = CRGB(0, 0, 0);
	}
}

void writeColorChannelValue (const uint8_t *ledIndex, const uint8_t *colorChannelIndex, const uint8_t *colorChannelValue) {
	leds[*ledIndex][*colorChannelIndex] = *colorChannelValue;
}

void paintFrame (const uint8_t *data, const size_t dataLength) {

	uint8_t ledIndex = 0;
	uint8_t colorChannelIndex = 0;
	uint8_t colorChannelValuePosition = 0;
	// uint8_t colorChannelValue = 0;

	isBusy = true;
	clearFrame();

	for (size_t i = 0; i < dataLength; i++) {

		char c = data[i];

		if (c == '|') {

			//writeColorChannelValue(&ledIndex, &colorChannelIndex, &colorChannelValue);
			
			colorChannelIndex = 0;
			colorChannelValuePosition = 0;

			ledIndex++;

		} else if (c == ',') {

			//writeColorChannelValue(&ledIndex, &colorChannelIndex, &colorChannelValue);
			
			colorChannelIndex++;
			colorChannelValuePosition = 0;

		} else {

			// switch (colorChannelValuePosition) {
			// 	case 0:
			// 		colorChannelValue += (c - '0') * 100;
			// 		break;
			// 	case 1:
			// 		colorChannelValue += (c - '0') * 10;
			// 		break;
			// 	case 2:
			// 		colorChannelValue += (c - '0');
			// 		break;
			// 	default:
			// 		break;
			// }

			// Fancier way, but less performant
			leds[ledIndex][colorChannelIndex] += (c - '0') * pow(10, 2 - colorChannelValuePosition);

			colorChannelValuePosition++;

			if (colorChannelValuePosition == 3) {
				colorChannelValuePosition = 0;
			}
		}

	}

	// Update the last LED's last color channel
	//writeColorChannelValue(&ledIndex, &colorChannelIndex, &colorChannelValue);

	// for (uint8_t row = 1; row <= 16; row++) {
	// 	if (row % 2 == 0) {
	// 		for (uint8_t pix = 0; pix < 8; pix++) {
				
	// 			uint8_t start = (row - 1) * 16;
	// 			uint8_t end = start + 15;

	// 			CRGB temp = leds[end - pix];

	// 			leds[end - pix] = leds[start + pix];
	// 			leds[start + pix] = temp;
	// 		}
	// 	}
	// }

	isBusy = false;
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

	ws.onEvent([](AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len) {
		
		AwsFrameInfo *info = (AwsFrameInfo*)arg;
		
		switch (type) {
			case WS_EVT_CONNECT:
				Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
				break;
			case WS_EVT_DISCONNECT:
				Serial.printf("WebSocket client #%u disconnected\n", client->id());
				break;
			case WS_EVT_DATA:

				if (info->index == 0 && info->len == len) { // Packets not split
					paintFrame(data, len);
				} else { // Incomplete packet

					for (size_t i = 0; i < len; i++) {
						packet[packetLength + i] = data[i];
					}

					packetLength += len;
				}

				if (packetLength == info->len) { // Final packet
					
					paintFrame(packet, packetLength);
					
					// Clear packet data
					for (size_t i = 0; i < MAX_PACKET_LENGTH; i++) {
						packet[i] = 0;
					}

					packetLength = 0;
				}

				break;
			case WS_EVT_PONG:
    		case WS_EVT_ERROR:
     			break;
		}
	});

	server.addHandler(&ws);

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

	if (!isBusy) {
		FastLED.setBrightness(10);
		FastLED.show();
	}

	delay(50);
}
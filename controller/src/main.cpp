#define CONFIG_ASYNC_TCP_EVENT_QUEUE_SIZE 512

// Core
#include <Arduino.h>
#include <math.h>
#include <list>

// Networking
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>

// LED
#include <FastLED.h>

// Utils
#include "env.h"
#include "render.h"

// Structs
CRGBArray<NUM_LEDS> canvas;
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

// Variables
std::list<char> packet;
size_t packetLength = 0;
bool isBusy = false;

void setup () {

	Serial.begin(9600);
  
	FastLED.addLeds<NEOPIXEL, MATRIX_DATA_PIN>(canvas, NUM_LEDS);
	FastLED.setMaxPowerInVoltsAndMilliamps(5, 800);

	WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

	while (WiFi.status() != WL_CONNECTED) {
		delay(500);
		Serial.print(".");
	}

	Serial.println("");
	Serial.println(WiFi.localIP());

	ws.onEvent([](AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t dataLength) {

		AwsFrameInfo *info = (AwsFrameInfo*)arg;
		
		switch (type) {
			case WS_EVT_CONNECT:
				Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
				break;
			case WS_EVT_DISCONNECT:
				Serial.printf("WebSocket client #%u disconnected\n", client->id());
				break;
			case WS_EVT_DATA:

				if (isBusy) {
					return;
				}

				for (size_t i = 0; i < dataLength; i++) {
					packet.push_back(data[i]);
				}

				packetLength += dataLength;

				if (packetLength == info->len) { // Final packet
					
					isBusy = true;
					// renderCanvas(canvas, packet, packetLength);
					isBusy = false;
					
					packet.clear();
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

void loop () {

	if (!isBusy) {
		FastLED.setBrightness(10);
		FastLED.show();
	}

}
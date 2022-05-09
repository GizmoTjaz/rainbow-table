#include "env.h"

#ifndef SERVER_MODE
#define SERVER_MODE true
#endif

#ifndef WIFI_SSID
#define WIFI_SSID "Rainbow Table"
#endif

#ifndef WIFI_PASSWORD
#define WIFI_PASSWORD "rainbowtable12345"
#endif

// Core
#include <Arduino.h>
#include <math.h>

// Networking
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>

// LED
#include <FastLED.h>

// Utils
#include "render.h"

// Structs
CRGBArray<NUM_LEDS> canvas;
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

// Variables
char packet[MAX_PACKET_LENGTH] = {};
size_t packetLength = 0;

bool isBusyRendering = false;

void setup () {

	Serial.begin(9600);

	FastLED.addLeds<NEOPIXEL, MATRIX_DATA_PIN>(canvas, NUM_LEDS);
	FastLED.setMaxPowerInVoltsAndMilliamps(5, 800);

	clearCanvas(canvas);

	if (SERVER_MODE) {

		WiFi.softAP(WIFI_SSID, WIFI_PASSWORD);

		IPAddress ipAddress = WiFi.softAPIP();

		WiFi.onEvent([](WiFiEvent_t event, WiFiEventInfo_t info) {
			switch (event) {
				case SYSTEM_EVENT_AP_STACONNECTED:
					Serial.println("Client connected: " + info.got_ip.ip_info.ip.addr);
					break;
				case SYSTEM_EVENT_AP_STADISCONNECTED:
					Serial.println("Client disconnected: " + info.got_ip.ip_info.ip.addr);
					break;
				default:
					break;
			}
		});

		Serial.println("Server IP address: " + ipAddress);

	} else {

		WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

		while (WiFi.status() != WL_CONNECTED) {
			delay(500);
			Serial.print(".");
		}

		Serial.println("\nLocal IP address: " + WiFi.localIP());
	}

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

				if (isBusyRendering) {
					return;
				}

				if (info->len > MAX_PACKET_LENGTH) {
					client->text("Packet too long.");
					return;
				}

				if ((packetLength + dataLength) > MAX_PACKET_LENGTH) {
					client->text("Partial packet exceeds packet length.");
					return;
				}

				memcpy(packet + packetLength, data, dataLength);
				packetLength += dataLength;

				if (packetLength == info->len) {

					isBusyRendering = true;

					renderCanvas(canvas, packet, packetLength);

					memset(packet, 0, sizeof packet);
					packetLength = 0;

					isBusyRendering = false;
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

	// Fix CORS preflight errors
	DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
	DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "*");

	server.begin();
}

void loop () {

	if (!isBusyRendering) {
		FastLED.setBrightness(10);
		FastLED.show();
	}

	ws.cleanupClients();
}
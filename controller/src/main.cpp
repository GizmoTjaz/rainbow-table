#include "env.h"

#ifndef SERVER_MODE
#define SERVER_MODE true
#endif

#ifndef WIFI_SSID
#define WIFI_SSID "Mavrična Tabla"
#endif

#ifndef WIFI_PASSWORD
#define WIFI_PASSWORD "123456789"
#endif

#define NUM_LEDS NUM_LEDS_ROW * NUM_LEDS_COLUMN
#define MAX_PACKET_LENGTH NUM_LEDS * (3 * 3 + 2 + 1)
#define FRAME_INTERVAL 1 / 30 * 1000

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
#include "animation.h"

// Animations
#include "snake.h"

// Structs
CRGBArray<NUM_LEDS> canvas;
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

// Animations
SnakeAnimation snakeAnimation = SnakeAnimation(canvas);

AnimationProfile *currentAnimation = &snakeAnimation; 
CRGB currentAnimationColor = CRGB(255, 255, 255);
int animationFrameCounter = 0;

// Variables
char packet[MAX_PACKET_LENGTH] = {};
size_t packetLength = 0;

bool isBusyRendering = false;
bool isInAnimationMode = false;
bool isStartupAnimation = false;

IPAddress localIP(172, 20, 10, 2);
IPAddress gateway(172, 20, 10, 1);
IPAddress subnet(255, 255, 255, 240);

void connectToWiFiNetwork () {
	WiFi.config(localIP, gateway, subnet);
	WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void createWiFiHotspot () {

	WiFi.softAP(WIFI_SSID, WIFI_PASSWORD);

	Serial.print("Server IP address: ");
	Serial.println(WiFi.softAPIP());
}

void setup () {

	// currentAnimation = &snakeAnimation;
	// isInAnimationMode = true;

	Serial.begin(9600);

	// Set up canvas

	FastLED.addLeds<NEOPIXEL, MATRIX_DATA_PIN>(canvas, NUM_LEDS);
	FastLED.setMaxPowerInVoltsAndMilliamps(5, 800);

	clearCanvas(canvas);

	WiFi.onEvent([](WiFiEvent_t event, WiFiEventInfo_t info) {
		switch (event) {
			case SYSTEM_EVENT_AP_STACONNECTED:
				
				// Serial.print("Client connected: ");
				// Serial.println(info.got_ip.ip_info.ip.addr);
				
				break;
			case SYSTEM_EVENT_AP_STADISCONNECTED:
				
				// Serial.print("Client disconnected: ");
				// Serial.println(info.got_ip.ip_info.ip.addr);

				break;
			case SYSTEM_EVENT_STA_DISCONNECTED:

				Serial.println("Disconnected from Wi-Fi network. Attempting to reconnect...");
				connectToWiFiNetwork();

			default:
				break;
		}
	});

	if (SERVER_MODE) {
		createWiFiHotspot();
	} else {
		connectToWiFiNetwork();
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
					isInAnimationMode = false;

					if (packet[0] == 'A') {

						//bool success = startAnimation(packet, packetLength, currentAnimation, currentAnimationColor);

						//isInAnimationMode = success;

					} else {
						renderCanvas(canvas, packet, packetLength);
					}

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

	delay(250);
	isInAnimationMode = true;
	isStartupAnimation = true;
}

void loop () {
	if (!isBusyRendering) {

		if (isInAnimationMode) {

			currentAnimation->renderFrame(animationFrameCounter, currentAnimationColor);

			animationFrameCounter++;

			if (animationFrameCounter > currentAnimation->numFrames) {

				if (isStartupAnimation) {
					isStartupAnimation = false;
					isInAnimationMode = false;
					currentAnimation = nullptr;
				}

				animationFrameCounter = 0;
				clearCanvas(canvas);
			}

			delay(FRAME_INTERVAL);
		}

		FastLED.setBrightness(10);
		FastLED.show();
	}
}
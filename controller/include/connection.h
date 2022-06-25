#pragma once

// Core
#include <WiFi.h>

IPAddress localIP(172, 20, 10, 2);
IPAddress gateway(172, 20, 10, 1);
IPAddress subnet(255, 255, 255, 240);

void connectToWiFiNetwork (const char* ssid, const char* password) {
	WiFi.config(localIP, gateway, subnet);
	WiFi.begin(ssid, password);
}

void createWiFiHotspot (const char* ssid, const char* password) {

	WiFi.softAP(ssid, password);

	Serial.print("Server IP address: ");
	Serial.println(WiFi.softAPIP());
}
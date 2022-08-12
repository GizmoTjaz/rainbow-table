#include "env.h"

// Core
#include <Arduino.h>

// Networking
#include <TinyMqtt.h>

// Variables
MqttBroker broker(PORT);

void setup () {

	Serial.begin(9600);

	WiFi.mode(WIFI_STA);
	WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

	broker.begin();

}

void loop () {
	broker.loop();
}
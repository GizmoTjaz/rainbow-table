#include "env.h"

// Core
#include <Arduino.h>

// Networking
#include <TinyMqtt.h>

// Variables
MqttBroker broker(PORT);

void onPublish (const MqttClient* cl, const Topic& topic, const char* payload, size_t length) {
	Serial.print(topic);
	Serial.print(" - ");
	Serial.println(payload);
}

void setup () {

	Serial.begin(9600);

	WiFi.mode(WIFI_STA);
	WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

	broker->setCallback(onPublish);
	broker->subscribe("", 0);
	broker.begin();

}

void loop () {
	broker.loop();
}
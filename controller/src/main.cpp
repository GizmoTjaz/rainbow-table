// #include "env.h"

// Core
#include <Arduino.h>

// Networking
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#define SERVICE_UUID "c79dadc2-4958-4dfd-8e38-c9609e6056ad"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

void setup () {

	Serial.begin(9600);

	Serial.println("Start");

	BLEDevice::init("Rainbow Table");

	BLEServer *pServer = BLEDevice::createServer();
	BLEService *pService = pServer->createService(SERVICE_UUID);

	BLECharacteristic *pCharacteristic = pService->createCharacteristic(
		CHARACTERISTIC_UUID,
		BLECharacteristic::PROPERTY_READ |
		BLECharacteristic::PROPERTY_WRITE
	);

	pCharacteristic->setValue("");
	pService->start();

	BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();

	pAdvertising->addServiceUUID(SERVICE_UUID);
	pAdvertising->setScanResponse(true);
	pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
	// pAdvertising->setMinPreferred(0x12);

	BLEDevice::startAdvertising();

	Serial.println("Characteristics defined");
}

void loop () {
	delay(100);
}
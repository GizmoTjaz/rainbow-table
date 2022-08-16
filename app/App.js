// Modules
import { registerRootComponent } from "expo";
import { BleManager } from "react-native-ble-plx";

// Components
import { useEffect } from "react";
import { SafeAreaView, Text } from "react-native";
import { StatusBar } from "expo-status-bar";

// Globals
const manager = new BleManager();

export default function App () {

	function scanAndConnect () {
		manager.startDeviceScan(null, null, (error, device) => {

			if (error) {
				console.error(err);
				return;
			}

			console.log(device.name);
	
			// if (device.name === 'TI BLE Sensor Tag' || 
			// 	device.name === 'SensorTag') {
				
			// 	// Stop scanning as it's not necessary if you are scanning for one device.
			// 	manager.stopDeviceScan();
	
			// 	// Proceed with connection.
			// }
		});
	}

	useEffect(() => {

		const subscription = manager.onStateChange((state) => {
			if (state === "PoweredOn") {
				scanAndConnect();
				subscription.remove();
			}
		}, true);

		return () => {
			subscription.remove();
			manager.destroy();
		};

	}, [ manager ]);



	return (
		<SafeAreaView>
			<StatusBar style="auto" />
			<Text>App</Text>
		</SafeAreaView>
	);
}

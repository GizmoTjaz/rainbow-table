// Modules
import { registerRootComponent } from "expo";

// Components
import { SafeAreaView, Text } from "react-native";

function App () {
	return (
		<SafeAreaView>
			<Text>App</Text>
		</SafeAreaView>
	);
}

export default registerRootComponent(App);
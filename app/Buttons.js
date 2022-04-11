import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

export default function Buttons (props) {

	const [ buttonIDs, _ ] = useState(Array(16*16).fill(0));
	
	function activateButton (buttonIndex) {
		props.onActivateButton(buttonIndex);
	}

	return (
		<View style={styles.buttonContainer}>
			{
				buttonIDs.map((_, index) => (
					<TouchableOpacity
						key={index}
						style={styles.button}
						title="O"
						onPress={ () => activateButton(index) }
					>
						<Text style={styles.buttonText}>O</Text>
					</TouchableOpacity>
				))
			}
		</View>
	);
}

const styles = StyleSheet.create({
	buttonContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		flexWrap: "wrap",
	},
	button: {
		width: "5.5%",
		height: "auto",
		margin : 1,
		backgroundColor: "#222222"
	},
	buttonText: {
		color: "transparent"
	}
});
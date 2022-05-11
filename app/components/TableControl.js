// Modules
import React from "react";

// Components
import { Button, StyleSheet, View, TouchableOpacity } from "react-native";

// Local Components
import ButtonGrid from "./ButtonGrid";

export default function TableControl (props) {
	return (
		<View>
			<View style={styles.buttonRow}>
				<TouchableOpacity style={styles.button}>
					<Button
						title="Clear"
						color="#fff"
						onPress={props.clearFrame}
					/>
				</TouchableOpacity>
			</View>
			<ButtonGrid
				clearSignal={props.clearSignal}
				style={styles.grid}
				paintFrame={props.paintFrame}
				paintRawFrame={props.sendData}
			/>
		</View>
	);
}

const styles = StyleSheet.create({

	buttonRow: {
		marginTop: 15,
		marginBottom: 15
	},
	button: {
		backgroundColor: "#a31ffc",
		borderRadius: 15,
		alignSelf: "center",
		paddingTop: 3,
		paddingBottom: 3,
		paddingLeft: 10,
		paddingRight: 10
	},

	grid: {
		flex: 1
	}

});
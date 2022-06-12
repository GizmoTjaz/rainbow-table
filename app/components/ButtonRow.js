// Modules
import React from "react";

// Components
import { Button, StyleSheet, View, TouchableOpacity, Switch, Text } from "react-native";

export default function ButtonRow (props) {
	return (
		<View style={styles.buttonRow}>
			<View style={styles.buttonContainer}>
				<TouchableOpacity style={styles.button}>
					<Button
						title="Počisti"
						color="#FFF"
						onPress={ () => props.clearFrame() }
					/>
				</TouchableOpacity>
				<TouchableOpacity style={styles.button}>
					<Button
						title="Zapolni"
						color="#FFF"
						onPress={ () => props.fillFrameWithCurrentColor() }
					/>
				</TouchableOpacity>
			</View>
			<View style={styles.switchContainer}>
				<Text style={styles.switchLabel}>Mreža</Text>
				<Switch
					trackColor={{ true: "#a31ffc", false: "#222" }}
					thumbColor="#FFF"
					onValueChange={ () => props.onGridLinesStateChange(!props.gridLinesState) }
					value={props.gridLinesState}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({

	buttonRow: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},

	buttonContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		marginLeft: 15
	},
	button: {
		backgroundColor: "#a31ffc",
		borderRadius: 15,
		alignSelf: "center",
		paddingTop: 3,
		paddingBottom: 3,
		paddingLeft: 10,
		paddingRight: 10,
		marginLeft: 5,
		marginRight: 5
	},

	switchContainer: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 15
	},
	switchLabel: {
		color: "#FFF",
		paddingBottom: 5
	}

});
// Modules
import React from "react";

// Components
import { Button, StyleSheet, View, TouchableOpacity, Switch, Text } from "react-native";
import Icon from "react-native-vector-icons/Foundation";

export default function ButtonRow (props) {
	return (
		<View style={styles.buttonRow}>
			<View style={styles.buttonRowContainer}>
				<View style={styles.buttonContainer}>
					<Icon.Button
						name="trash"
						size={30}
						style={styles.button}
						iconStyle={styles.buttonIcon}
						onPress={ () => props.clearFrame() }
					/>
				</View>
				<View style={styles.buttonContainer}>
					<Icon.Button
						name="paint-bucket"
						size={30}
						style={styles.button}
						iconStyle={styles.buttonIcon}
						onPress={ () => props.fillFrameWithCurrentColor() }
					/>
				</View>
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

	buttonRowContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		marginLeft: 10
	},
	buttonContainer: {
		paddingRight: 10
	},
	button: {
		backgroundColor: "#a31ffc",
		width: 45,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	buttonIcon: {
		marginRight: 0
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
import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Touchable, Dimensions } from "react-native";
import { Gesture, PanGestureHandler, State } from "react-native-gesture-handler";

export default function Grid (props) {

	function handlePress (e) {

		if (e.nativeEvent.state !== State.ACTIVE) {
			return;
		}

		const
			tile = Dimensions.get("window").width / 16,
			{ x, y } = e.nativeEvent;

		props.onActivateButton(Math.floor(x / tile), Math.floor(y / tile));
	}

	return (
		<PanGestureHandler
			onGestureEvent={handlePress}
			minDeltaX={20}
			minDeltaY={20}
			maxPointers={1}
		>
			<View style={styles.container}></View>
		</PanGestureHandler>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		paddingBottom: "100%",
		backgroundColor: "#222222"
	}
});

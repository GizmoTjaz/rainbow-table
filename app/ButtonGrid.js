import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Touchable, Dimensions, FlatList } from "react-native";
import { Gesture, GestureDetector, PanGestureHandler, State } from "react-native-gesture-handler";
import Grid from "react-native-grid-component";
export default function ButtonGrid (props) {

	const
		[ currentButtonID, setCurrentButtonID ] = useState(-1),
		[ buttonIDs, _ ] = useState(Array(16*16).fill(0)),
		[ activeButtonIDs, setActiveButtonIDs ] = useState([]),
		[ buttonHeight, __ ] = useState(Dimensions.get("window").width / 16);

	function handleTouch (e) {

		if (e.state !== State.ACTIVE) {
			return;
		}

		const
			{ x, y } = e,
			buttonWidth = buttonHeight,
			buttonIndex = (Math.floor(y / buttonWidth) * 16) + Math.floor(x / buttonWidth);

		if (buttonIndex >= 0 && buttonIndex < 16*16) {
			setCurrentButtonID(buttonIndex);
		}
	}

	useEffect(() => {
		props.onData([]);
	}, []);

	useEffect(() => {
		
		if (activeButtonIDs.includes(currentButtonID)) {
			setActiveButtonIDs(activeButtonIDs.filter(index => index !== currentButtonID));
			props.sendDirectly(`S${currentButtonID}|0,0,0`);
		} else {
			setActiveButtonIDs([ ...activeButtonIDs, currentButtonID ]);
			props.sendDirectly(`S${currentButtonID}|255,255,255`);
		}

	}, [ currentButtonID ] );

	const gestureHandler = Gesture.Pan().minDistance(0).maxPointers(1).shouldCancelWhenOutside(false).onStart(handleTouch).onUpdate(handleTouch);

	return (
		<GestureDetector gesture={gestureHandler}>
			<Grid
				style={styles.grid}
				renderItem={({ item, index }) => (
					<GridButton key={index} index={index} active={activeButtonIDs.includes(index)} style={{ height: buttonHeight }} />
				)}
				data={buttonIDs}
				numColumns={16}
			/>
		</GestureDetector>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		paddingBottom: "100%",
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-around",
		backgroundColor: "#fff"
	},
	list: {
		width: "100%",
		height: "100%"
	},
	button: {
		flex: 1,
		margin: 1
	},
	activeButton: {
		backgroundColor: "#fff"
	},
	inactiveButton: {
		backgroundColor: "#ff0000"
	},
	buttonLabel: {
		color: "transparent"
	}
});

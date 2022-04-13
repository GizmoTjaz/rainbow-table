import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Touchable, Dimensions, FlatList } from "react-native";
import { Gesture, GestureDetector, PanGestureHandler, State } from "react-native-gesture-handler";

const GridButton = ({ index, active }) => {
	return (
		<View
			style={[
				styles.button,
				active
					? styles.activeButton 
					: styles.inactiveButton
			]}
		>
			<Text style={styles.buttonLabel}>{ index }</Text>
		</View>
	);
};

export default function Grid (props) {

	const
		[ currentButtonID, setCurrentButtonID ] = useState(-1),
		[ buttonIDs, _ ] = useState(Array(16*16).fill(0)),
		[ activeButtonIDs, setActiveButtonIDs ] = useState([]);

	function handleTouch (e) {

		if (e.state !== State.ACTIVE) {
			return;
		}

		const
			{ x, y } = e,
			buttonWidth = Dimensions.get("window").width / 16,
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

	}, [currentButtonID] );

	const gestureHandler = Gesture.Pan().minDistance(0).maxPointers(1).shouldCancelWhenOutside(false).onStart(handleTouch).onUpdate(handleTouch);

	return (
		<GestureDetector gesture={gestureHandler}>
			{ <View style={styles.container}>
				{/* {
					buttonIDs.map((_, index) => (
						<View
							key={index}
							style={[
								styles.button,
								activeButtonIDs.includes(index)
									? styles.activeButton 
									: styles.inactiveButton
							]} 
						/>
					))
				} */}
			</View> }
			{/* <FlatList
				data={buttonIDs}
				numColumns={16}
				renderItem={({ _, index }) => (
					<GridButton index={index} active={activeButtonIDs.includes(index)} />
				)}
				keyExtractor={(_, index) => index.toString()}
				style={styles.list}
			/> */}
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
		flexBasis: "6.25%",
		borderColor: "red",
		borderWidth: 1
	},
	activeButton: {
		backgroundColor: "#fff"
	},
	inactiveButton: {
		//backgroundColor: "#ff0000"
	},
	buttonLabel: {
		color: "transparent"
	}
});

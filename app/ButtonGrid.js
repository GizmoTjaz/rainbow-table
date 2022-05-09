// Modules
import React, { useEffect, useState } from "react";

// Components
import { StyleSheet, Dimensions } from "react-native";
import { Gesture, GestureDetector, State } from "react-native-gesture-handler";
import Grid from "react-native-grid-component";

function GridButton (props) {
	return (
		<View
			style={[
				styles.button,
				props.active ? styles.activeButton : styles.inactiveButton,
				{ height: props.height }
			]}
		/>
	);
}

export default function ButtonGrid (props) {

	const
		[ currentPixelID, setCurrentPixelID ] = useState(-1),
		[ pixelMap, setPixelMap ] = useState(new Array(16*16).fill(null)),
		[ pixelIDs, _ ] = useState(Array(16*16).fill(1)),
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
			setCurrentPixelID(buttonIndex);
		}
	}

	function isPixelActive (pixelID) {
		
		const _pixel = pixelMap[pixelID];

		return (_pixel.r + _pixel.g + _pixel.b) > 0;
	}

	useEffect(() => {

		const
			on = { r: 255, g: 255, b: 255 },
			off = { r: 0, g: 0, b: 0 };

		let
			pixel = pixelMap[pixelID],
			pixelTotal = pixel.r + pixel.g + pixel.b;

		if (pixelTotal === 0) {
			pixel = on;
		} else if (pixelTotal === 255*3) {
			pixel = null;
		}

		pixelMap[pixelID] = pixel;

		if (pixel === null) {
			props.sendRawFrame(`S${currentPixelID}|0,0,0`);
		} else {
			props.sendRawFrame(`S${currentPixelID}|${pixel.r},${pixel.g},${pixel.b}`);
		}

	}, [ currentPixelID ] );

	const gestureHandler = Gesture.Pan().minDistance(0).maxPointers(1).shouldCancelWhenOutside(false).onStart(handleTouch).onUpdate(handleTouch);

	return (
		<GestureDetector gesture={gestureHandler}>
			<Grid
				style={styles.grid}
				renderItem={({ _, index }) => (
					<GridButton
						key={index}
						active={pixelMap[index] !== null}
						height={buttonHeight}
					/>
				)}
				data={pixelIDs}
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
	grid: {
		flex: 1
	},
	button: {
		flex: 1,
		margin: 1
	},
	activeButton: {
		backgroundColor: "#fff"
	},
	inactiveButton: {
		backgroundColor: "#000"
	}
});

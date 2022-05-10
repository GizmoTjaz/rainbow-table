// Modules
import React, { useEffect, useState } from "react";

// Components
import { StyleSheet, Dimensions, View } from "react-native";
import { Gesture, GestureDetector, State } from "react-native-gesture-handler";
import Grid from "react-native-grid-component";

function GridButton (props) {
	return (
		<View
			style={[
				styles.button,
				props.active
					? styles.activeButton
					: styles.inactiveButton,
				{
					height: props.height,
					backgroundColor: props.color
				}
			]}
		/>
	);
}

export default function ButtonGrid (props) {

	const
		[ currentPixelID, setCurrentPixelID ] = useState(-1),
		[ pixelMap, setPixelMap ] = useState(new Array(16*16).fill({ r: 0, g: 0, b: 0 })),
		[ pixelIDs, _ ] = useState(new Array(16*16).fill(1)),
		[ buttonHeight, __ ] = useState(Dimensions.get("window").width / 16);

	function handleTouch (e) {

		if (e.state !== State.ACTIVE) {
			return;
		}

		const
			{ x, y } = e,
			buttonWidth = buttonHeight,
			buttonIndex = (Math.floor(y / buttonHeight) * 16) + Math.floor(x / buttonWidth);

		if (buttonIndex >= 0 && buttonIndex < 16*16) {
			setCurrentPixelID(buttonIndex);
		}
	}

	function getPixelColor (pixelID) {
		
		const _pixel = pixelMap[pixelID];

		return `rgb(${_pixel.r}, ${_pixel.g}, ${_pixel.b})`;
	}

	useEffect(() => {

		if (currentPixelID === -1)
			return;

		let pixel = pixelMap[currentPixelID];
		const pixelTotal = (pixel.r + pixel.g + pixel.b) | 0;

		if (pixelTotal === 0) {
			pixel = { r: 255, g: 255, b: 255 };
		} else {
			pixel = { r: 0, g: 0, b: 0 };
		}

		setPixelMap(pixelMap.map((_pixel, index) => {
			if (index === currentPixelID) {
				return pixel;
			} else {
				return _pixel;
			}
		}));

		props.paintRawFrame(`S${currentPixelID}|${pixel.r},${pixel.g},${pixel.b}`);

	}, [ currentPixelID ] );

	const gestureHandler = Gesture.Pan()
		.minDistance(0)
		.maxPointers(1)
		.shouldCancelWhenOutside(false)
		.onStart(handleTouch)
		.onUpdate(handleTouch);

	return (
		<GestureDetector gesture={gestureHandler}>
			<Grid
				style={styles.grid}
				renderItem={(_, index) => (
					<GridButton
						key={index}
						color={getPixelColor(index)}
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

	grid: {
		flex: 1
	},

	button: {
		flex: 1,
		margin: 1
	}

});

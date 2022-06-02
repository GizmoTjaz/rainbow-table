// Modules
import React, { useEffect, useState } from "react";

// Components
import { Dimensions, View, StyleSheet } from "react-native";
import { Gesture, GestureDetector, State } from "react-native-gesture-handler";
import { FlatGrid } from "react-native-super-grid";

// Utils
import { PIXEL_COUNT } from "../utils/constants";

function GridButton (props) {
	return (
		<View
			style={[
				props.gridLinesState ? styles.buttonBorder : "",
				{
					width: props.dimension,
					height: props.dimension,
					backgroundColor: props.color
				}
			]}
		/>
	);
}

export default function PixelGrid (props) {

	const
		[ pixelIDs, _ ] = useState(new Array(PIXEL_COUNT).fill(1)),
		[ buttonSideLength, __ ] = useState(Dimensions.get("window").width / 16),
		[ currentPixelID, setCurrentPixelID ] = useState(-1),
		[ gestureID, setGestureID ] = useState(0);

	function getPixelColor (pixelIndex) {
	
		const _pixel = props.pixelMap[pixelIndex];

		return `rgb(${_pixel.r}, ${_pixel.g}, ${_pixel.b})`;
	}

	function getButtonKey (pixelIndex) {
		return `${pixelIndex}-${getPixelColor(pixelIndex)}`;
	}

	function handleTouch (e) {

		if (e.state !== State.ACTIVE) {
			return;
		}

		const
			{ x, y } = e,
			buttonWidth = buttonSideLength,
			buttonIndex = (Math.floor(y / buttonSideLength) * 16) + Math.floor(x / buttonWidth);

		if (buttonIndex >= 0 && buttonIndex < PIXEL_COUNT) {
			setCurrentPixelID(buttonIndex);
		}
	}

	useEffect(() => {

		if (currentPixelID === -1)
			return;

		const
			currentPixelData = props.pixelMap[currentPixelID],
			newPixelData = props.currentPixelColor;

		if (
			newPixelData.r !== currentPixelData.r ||
			newPixelData.g !== currentPixelData.g ||
			newPixelData.b !== currentPixelData.b
		) {
			props.paintPixel(currentPixelID, newPixelData);
		}

	}, [ gestureID, currentPixelID ]);

	const gestureHandler = Gesture.Pan()
		.minDistance(0)
		.maxPointers(1)
		.shouldCancelWhenOutside(false)
		.onUpdate(handleTouch)
		.onEnd(() => setGestureID(gestureID < 1000 ? gestureID + 1 : 0));

	return (
		<GestureDetector gesture={gestureHandler}>
			<FlatGrid
				renderItem={({ index }) => (
					<GridButton
						key={getButtonKey(index)}
						color={getPixelColor(index)}
						dimension={buttonSideLength}
						gridLinesState={props.gridLinesState}
					/>
				)}
				data={pixelIDs}
				itemDimension={buttonSideLength}
				fixed={true}
				spacing={0}
				maxItemsPerRow={16}
				scrollEnabled={false}
			/>
		</GestureDetector>
	);
}

const styles = StyleSheet.create({
	buttonBorder: {
		borderWidth: 1,
		borderColor: "#111"
	}
});
// Modules
import React, { useState } from "react";

// Components
import { Dimensions } from "react-native";
import { GestureDetector, Gesture, State } from "react-native-gesture-handler";
import { FlatGrid } from "react-native-super-grid";

// Local Components
import Pixel from "./Pixel";

// Utils
import { PIXEL_COUNT } from "../utils/constants";


export default function PixelGrid (props) {

	const
		[ pixelIDs, _ ] = useState(new Array(PIXEL_COUNT).fill(1)),
		[ buttonSideLength, __ ] = useState(Dimensions.get("window").width / 16),
		[ hoverPixelID, setHoverPixelID ] = useState(-1);

	function handleTouch (e) {

		if (e.state !== State.ACTIVE) {
			return;
		}

		const
			{ x, y } = e,
			buttonWidth = buttonSideLength,
			buttonIndex = (Math.floor(y / buttonSideLength) * 16) + Math.floor(x / buttonWidth);

		if (buttonIndex >= 0 && buttonIndex < PIXEL_COUNT) {
			setHoverPixelID(buttonIndex);
		}
	}

	const gestureHandler = Gesture.Pan()
		.minDistance(0)
		.maxPointers(1)
		.shouldCancelWhenOutside(false)
		.onUpdate(handleTouch)
		.onEnd(() => setHoverPixelID(-1));

	return (
		<GestureDetector gesture={gestureHandler}>
			<FlatGrid
				renderItem={({ index }) => (
					<Pixel
						key={index}
						index={index}
						currentColor={props.currentPixelColor}
						dimension={buttonSideLength}
						forcedPixelColor={props.forcedPixelColor}
						forcedHoverPixelColor={hoverPixelID === index ? props.currentPixelColor : null}
						gridLinesState={props.gridLinesState}
						paintPixel={props.paintPixel}
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
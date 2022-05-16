// Modules
import React, { useEffect, useState } from "react";

// Components
import { Dimensions, View } from "react-native";
import { Gesture, GestureDetector, State } from "react-native-gesture-handler";
import { FlatGrid } from "react-native-super-grid";

// !! TAPPING ON A PIXEL AGAIN DOESN'T WORK BECAUSE CURRENTPIXELID FORBIDS IT
// !! GRID LINES

function GridButton (props) {
	return (
		<View
			style={[
				{
					width: props.dimension,
					height: props.dimension,
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

		if (pixelTotal > 0) {
			pixel = { r: 0, g: 0, b: 0 };
		} else {
			pixel = props.pixelColor;
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

	useEffect(() => {
		setPixelMap(new Array(16*16).fill({ r: 0, g: 0, b: 0 }));
	}, [ props.clearSignal ]);

	const gestureHandler = Gesture.Pan()
		.minDistance(0)
		.maxPointers(1)
		.shouldCancelWhenOutside(false)
		.onStart(handleTouch)
		.onUpdate(handleTouch);

	return (
		<GestureDetector gesture={gestureHandler}>
			<FlatGrid
				renderItem={({ index }) => (
					<GridButton
						key={index}
						color={getPixelColor(index)}
						dimension={buttonHeight}
					/>
				)}
				data={pixelIDs}
				itemDimension={buttonHeight}
				fixed={true}
				spacing={0}
				maxItemsPerRow={16}
				scrollEnabled={false}
			/>
		</GestureDetector>
	);
}
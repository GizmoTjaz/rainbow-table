// Modules
import React, { useState } from "react";

// Components
import { Dimensions } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { FlatGrid } from "react-native-super-grid";

// Local Components
import Pixel from "./Pixel";

// Utils
import { PIXEL_COUNT } from "../utils/constants";


export default function PixelGrid (props) {

	const
		[ pixelIDs, _ ] = useState(new Array(PIXEL_COUNT).fill(1)),
		[ buttonSideLength, __ ] = useState(Dimensions.get("window").width / 16);

	return (
		<GestureDetector>
			<FlatGrid
				renderItem={({ index }) => (
					<Pixel
						key={index}
						index={index}
						currentColor={props.currentPixelColor}
						dimension={buttonSideLength}
						forcedPixelColor={props.forcedPixelColor}
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
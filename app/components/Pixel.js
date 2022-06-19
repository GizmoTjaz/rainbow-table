// Modules
import React, { useEffect, useState } from "react";

// Components
import { View, Pressable } from "react-native";

// Utils
import { formatRGBObject } from "../utils/color";

export default function Pixel (props) {

	const [ color, setColor ] = useState({ r: 0, g: 0, b: 0 });

	function updateColor (_color, echoUpdate) {
		
		setColor(_color);

		if (echoUpdate !== false) {
			props.paintPixel(props.index, _color);
		}
	}

	useEffect(() => {
		if (props.forcedPixelColor) {
			updateColor(props.forcedPixelColor, false);
		}
	}, [ props.forcedPixelColor ] );

	return (
		<Pressable
			hitSlop={0}
			onPressIn={() => updateColor(props.currentColor)}
		>
			<View
				style={[
					props.gridLinesState ? styles.buttonBorder : "",
					{
						width: props.dimension,
						height: props.dimension,
						backgroundColor: formatRGBObject(color)
					}
				]}
			/>
		</Pressable>
	);
}
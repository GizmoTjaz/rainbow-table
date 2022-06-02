// Modules
import React, { useState, useEffect } from "react";

// Components
import { Button, StyleSheet, View, TouchableOpacity, Switch, Text } from "react-native";
import { SliderHuePicker } from "react-native-slider-color-picker";

// https://gist.github.com/mjackson/5311256
function HSVtoRGB (h, s, v) {
  
	const hprime = h / 60;

	const c = v * s;
	const x = c * (1 - Math.abs(hprime % 2 - 1)); 
	const m = v - c;

	let r, g, b;

	if (!hprime) {r = 0; g = 0; b = 0; }
	if (hprime >= 0 && hprime < 1) { r = c; g = x; b = 0}
	if (hprime >= 1 && hprime < 2) { r = x; g = c; b = 0}
	if (hprime >= 2 && hprime < 3) { r = 0; g = c; b = x}
	if (hprime >= 3 && hprime < 4) { r = 0; g = x; b = c}
	if (hprime >= 4 && hprime < 5) { r = x; g = 0; b = c}
	if (hprime >= 5 && hprime < 6) { r = c; g = 0; b = x}
	
	r = Math.round( (r + m)* 255);
	g = Math.round( (g + m)* 255);
	b = Math.round( (b + m)* 255);
  
	return { r, g, b };
}

function formatPixelColor (pixelColor) {
	return `rgb(${pixelColor.r},${pixelColor.g},${pixelColor.b})`;
}

export default function ColorPicker (props) {

	const [ pixelColor, setPixelColor ] = useState({ r: 255, g: 255, b: 255 });

	useEffect(() => {
		props.onColorChange(pixelColor);
	}, [ pixelColor ]);

	return (
		<View style={styles.colorPickerContainer}>
			<View style={styles.colorPicker}>
				<SliderHuePicker
					useNativeDriver={true}
					oldColor={formatPixelColor(pixelColor)}
					trackStyle={styles.colorPickerTrack}
					thumbStyle={styles.colorPickerThumb}
					onColorChange={ color => setPixelColor(HSVtoRGB(color.h, 1, 1)) }
				/>
			</View>
			<View style={[ styles.colorPreviewBox, { backgroundColor: formatPixelColor(pixelColor) } ]} />
		</View>
	);
}

const styles = StyleSheet.create({

	colorPickerContainer: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 30
	},
	colorPicker: {
		width: "85%"
	},
	colorPickerTrack: {
		width: "100%",
		height: 25,
		borderRadius: 25,
		backgroundColor: "#ff0000"
	},
	colorPickerThumb: {
		backgroundColor: "#fff",
		width: 30,
		height: 30,
		borderRadius: 30
	},
	colorPreviewBox: {
		width: 50,
		height: 50,
		marginTop: 20,
		borderRadius: 50
	}

});
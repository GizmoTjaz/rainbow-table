// Modules
import React, { useState } from "react";

// Components
import { StyleSheet, View } from "react-native";
import { SliderHuePicker } from "react-native-slider-color-picker";

// Utils
import { formatRGBObject, HSVtoRGB } from "../utils/color";

export default function ColorPicker (props) {

	const [ pixelColor, setPixelColor ] = useState({ r: 255, g: 255, b: 255 });

	function updateCurrentColor (hsvColor) {
		
		const rgbColor = HSVtoRGB(hsvColor.h, 1, 1);

		setPixelColor(rgbColor);
		props.onColorChange(rgbColor);
	}

	return (
		<View style={styles.colorPickerContainer}>
			<View style={styles.colorPicker}>
				<SliderHuePicker
					useNativeDriver={true}
					oldColor={formatRGBObject(pixelColor)}
					trackStyle={styles.colorPickerTrack}
					thumbStyle={styles.colorPickerThumb}
					onColorChange={ hsvColor => updateCurrentColor(hsvColor) }
				/>
			</View>
			<View style={[ styles.colorPreviewBox, { backgroundColor: formatRGBObject(pixelColor) } ]} />
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
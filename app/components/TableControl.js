// Modules
import React, { useState } from "react";

// Components
import { Button, StyleSheet, View, TouchableOpacity } from "react-native";
import { SliderHuePicker } from "react-native-slider-color-picker";

// Local Components
import ButtonGrid from "./ButtonGrid";

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

export default function TableControl (props) {

	const [ pixelColor, setPixelColor ] = useState({ r: 255, g: 255, b: 255 });

	return (
		<View style={styles.container}>
			<View style={styles.buttonRow}>
				<TouchableOpacity style={styles.button}>
					<Button
						title="Clear"
						color="#fff"
						onPress={ () => props.clearFrame() }
					/>
				</TouchableOpacity>
			</View>
			<ButtonGrid
				style={styles.grid}
				pixelColor={pixelColor}
				clearFrame={props.clearSignal}
				paintFrame={ (frame) => props.paintFrame(frame) }
				paintRawFrame={ (data) => props.sendData(data) }
			/>
			<View style={styles.colorPickerContainer}>
				<SliderHuePicker
					useNativeDriver={true}
					oldColor={pixelColor}
					trackStyle={styles.colorPicker}
					thumbStyle={styles.colorPickerThumb}
					onColorChange={ color => setPixelColor(HSVtoRGB(color.h, 1, 1)) }
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({

	container: {
		justifyContent: "center",
		alignItems: "center"
	},

	buttonRow: {
		marginTop: 15,
		marginBottom: 15,
		flexDirection: "row",
		justifyContent: "center"
	},
	button: {
		backgroundColor: "#a31ffc",
		borderRadius: 15,
		alignSelf: "center",
		paddingTop: 3,
		paddingBottom: 3,
		paddingLeft: 10,
		paddingRight: 10,
		marginLeft: 5,
		marginRight: 5
	},

	grid: {
		flex: 1
	},

	colorPickerContainer: {
		width: "100%",
		flexDirection: "row"
	},
	colorPicker: {
		width: "90%",
		height: 25,
		borderRadius: 25,
		backgroundColor: "#ff0000"
	},
	colorPickerThumb: {
		backgroundColor: "#fff",
		width: 30,
		height: 30,
		borderRadius: 30
	}

});
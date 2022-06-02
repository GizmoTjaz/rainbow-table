// Modules
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Components
import { Fragment } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";

// Local Components
import ButtonRow from "./components/ButtonRow";
import PixelGrid from "./components/PixelGrid";
import ColorPicker from "./components/ColorPicker";

// Utils
import { PIXEL_COUNT } from "./utils/constants";

function generateEmptyPixelMap () {
	return new Array(PIXEL_COUNT).fill({ r: 0, g: 0, b: 0 });
}

export default class App extends React.Component {

	constructor (props) {

		super(props);

		this.state = {
			isReady: false,
			pixelMap: generateEmptyPixelMap(),
			currentPixelColor: { r: 255, g: 255, b: 255 },
			gridLinesState: false
		}

		this.ws = new WebSocket("ws://192.168.64.111/ws");
	}

	sendData (data) {
		if (this.state.isReady) {
			this.ws.send(data);
		}
	}

	paintPixel (pixelID, color) {

		let _frame = this.state.pixelMap;

		_frame[pixelID] = color;

		this.setState({
			pixelMap: _frame
		});

		this.sendData(`S${pixelID}|${color.r},${color.g},${color.b}|`);
	}

	fillFrame (color) {
		
		let _frame = this.state.pixelMap;

		for (let i = 0; i < PIXEL_COUNT; i++) {
			_frame[i] = color;
		}

		this.setState({
			pixelMap: _frame
		});

		this.sendData(`F${color.r},${color.g},${color.b}|`);
	}

	clearFrame () {

		this.setState({
			pixelMap: generateEmptyPixelMap()
		});

		this.sendData("C");
	}

	componentDidMount () {

		this.ws.onopen = () => {

			console.log("Connected");

			this.setState({
				isReady: true
			});
		};

		this.ws.onerror = (e) => {
			console.error(e);
		}

		this.ws.onclose = (e) => {
			console.error(e);
		}

		async function fetchSaveData (self) {

			const _gridState = JSON.parse(await AsyncStorage.getItem("@grid_state"));

			if (_gridState !== null) {
				self.setState({
					gridLinesState: _gridState
				});
			}

		};

		fetchSaveData(this);

	}

	componentDidUpdate (_, prevState) {
		if (prevState.gridLinesState !== this.state.gridLinesState) {
			AsyncStorage.setItem("@grid_state", JSON.stringify(this.state.gridLinesState));
		}
	}

	render () {
		return (
			<Fragment>
				<SafeAreaView style={styles.fakeHeader} />
				<SafeAreaView style={styles.container}>
					<StatusBar style="light" />
					<View style={styles.header}>
						<Text style={styles.itemName}>Mavrična Tabla</Text>
						<Text style={[ styles.itemStatus, this.state.isReady ? styles.itemStatusActive : styles.itemStatusInactive ]}>⬤</Text>
					</View>
					<View style={styles.contentContainer}>
						<ButtonRow
							gridLinesState={this.state.gridLinesState}
							onGridLinesStateChange={ (state) => this.setState({ gridLinesState: state }) }
							clearFrame={ () => this.clearFrame() }
							fillFrameWithCurrentColor={ () => this.fillFrame(this.state.currentPixelColor) }
						/>
						<PixelGrid
							pixelMap={this.state.pixelMap}
							currentPixelColor={this.state.currentPixelColor}
							gridLinesState={this.state.gridLinesState}
							paintPixel={ (pixelID, color) => this.paintPixel(pixelID, color) }
						/>
						<ColorPicker
							onColorChange={ (newColor) => this.setState({ currentPixelColor: newColor }) }
						/>
					</View>
				</SafeAreaView>
			</Fragment>
		);
	}
}

const styles = StyleSheet.create({

	container: {
		flex: 1,
		backgroundColor: "#0d0d0d"
	},

	fakeHeader: {
		backgroundColor: "#1f1f1f"
	},
	header: {
		width: "100%",
		backgroundColor: "#1f1f1f",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 5,
		paddingBottom: 15
	},

	itemName: {
		fontWeight: "bold",
		color: "#fff",
		marginRight: 10,
		fontSize: 25
	},
	itemStatus: {
		fontWeight: "bold",
		fontSize: 12,
	},
	itemStatusActive: {
		color: "#00ff00"
	},
	itemStatusInactive: {
		color: "#ff0000"
	},

	contentContainer: {
		flex: 1,
		flexDirection: "column"
	}

});

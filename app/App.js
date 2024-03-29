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

export default class App extends React.Component {

	constructor (props) {

		super(props);

		this.state = {
			isReady: false,
			gridLinesState: false,
			currentPixelColor: { r: 255, g: 255, b: 255 },
			forcedPixelColor: null,
			renderQueue: []
		}

		this.ws = null;
		this.reconnectInterval = 0;

		this.renderInterval = setInterval(this.sendRenderQueue.bind(this), 10);
	}

	// WebSocket Connection

	socketOpenHandler () {

		clearInterval(this.reconnectInterval);

		console.log("Connected");

		this.setState({
			isReady: true
		});
	}

	socketErrorHandler (e) {
		console.error(e);
	}

	socketCloseHandler () {
		
		console.log("Disconnected");

		this.setState({
			isReady: false
		});

		setTimeout(() => {
			this.connect();
		}, 500);
	}

	connect () {

		if (this.ws) {
			this.disconnect();
		}

		this.ws = new WebSocket("ws://172.20.10.2/ws");

		this.ws.addEventListener("open", this.socketOpenHandler.bind(this));
		this.ws.addEventListener("error", this.socketErrorHandler);
		this.ws.addEventListener("close", this.socketCloseHandler.bind(this));
	}

	disconnect () {
		if (this.ws) {

			this.ws.close();

			this.ws.removeEventListener("open", this.socketOpenHandler);
			this.ws.removeEventListener("error", this.socketErrorHandler);
			this.ws.removeEventListener("close", this.socketCloseHandler);

			this.ws = null;
		}
	}

	// Painting

	sendData (data) {
		if (this.state.isReady) {
			this.ws.send(data);
		}
		console.log(data);
	}

	sendRenderQueue () {
		
		if (this.state.renderQueue.length === 0) {
			return;
		}

		const lastQueueElement = this.state.renderQueue[this.state.renderQueue.length - 1];
		let _queue = "";

		if (lastQueueElement.startsWith("F") || lastQueueElement.startsWith("C")) {
			_queue = lastQueueElement;
		} else {
			_queue = this.state.renderQueue.map(cmd => {
				if (cmd[cmd.length - 1] !== "|") {
					return cmd + "|";
				} else {
					return cmd;
				}
			}).join("");
		}

		this.setState({
			renderQueue: []
		});

		this.sendData(_queue);	
	}

	queueRenderCommand (cmd) {
		this.setState({
			renderQueue: [ ...this.state.renderQueue, cmd ]
		});
	}

	paintPixel (pixelID, color) {
		this.queueRenderCommand(`P${pixelID}|${color.r},${color.g},${color.b}|`);
	}

	fillFrame (color) {
		
		this.setState({
			forcedPixelColor: color
		});

		this.queueRenderCommand(`F${color.r},${color.g},${color.b}|`);
	}

	clearFrame () {

		this.setState({
			forcedPixelColor: { r: 0, g: 0, b: 0 }
		});

		this.queueRenderCommand("C");
	}

	// Lifecycle Events

	componentDidMount () {

		this.connect();

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

	componentWillUnmount () {
		this.disconnect();
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
							currentPixelColor={this.state.currentPixelColor}
							forcedPixelColor={this.state.forcedPixelColor}
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

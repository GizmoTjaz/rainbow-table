// Modules
import React from "react";

// Components
import { Fragment } from "react";
import { Button, SafeAreaView, StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";

// Local Components
import TableControl from "./components/TableControl";

export default class App extends React.Component {

	constructor (props) {

		super(props);

		this.state = {
			isReady: false,
			clearSignal: 0
		}

		this.ws = new WebSocket("ws://192.168.64.109/ws");
	}

	sendData (data) {
		if (this.state.isReady) {
			this.ws.send(data);
		}
	}

	paintFrame (pixelMap) {
		
		let _frame = new Array(16*16);

		pixelMap.forEach((pixel, index) => {
			if (pixel === null) {
				_frame[index] = "0,0,0|";
			} else {
				_frame[index] = `${pixel.r},${pixel.g},${pixel.b}|`;
			}
		});

		_frame = _frame.join("").slice(0, -1);

		this.sendData(_frame);
	}

	clearFrame () {

		this.setState({
			clearSignal: this.state.clearSignal + 1
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

	}

	render () {
		return (
			<Fragment>
				<SafeAreaView style={styles.fakeHeader} />
				<SafeAreaView style={styles.container}>
					<StatusBar style="light" />
					<View style={styles.header}>
						<Text style={styles.itemName}>Rainbow Table</Text>
						<Text style={[ styles.itemStatus, this.state.isReady ? styles.itemStatusActive : styles.itemStatusInactive ]}>⬤</Text>
					</View>
					<View style={styles.contentContainer}>
						{
							this.state.isReady
								? (
									<TableControl
										sendData={ (data) => this.sendData(data) }
										paintFrame={ (frame) => this.paintFrame(frame) }
										clearFrame={ () => this.clearFrame() }
										clearSignal={this.clearSignal}
									/>
								)
								: <ActivityIndicator size="large" color="#fff" />
						}
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

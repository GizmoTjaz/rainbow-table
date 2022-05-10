// Modules
import React from "react";

// Components
import { Fragment } from "react";
import { Button, SafeAreaView, StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { StatusBar } from "expo-status-bar";

// Local Components
import ButtonGrid from "./ButtonGrid";

export default class App extends React.Component {

	constructor (props) {

		super(props);

		this.state = {
			isReady: false
		}

		this.ws = new WebSocket("ws://192.168.64.109/ws");
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

		this.ws.send(_frame);
	}

	clearFrame () {
		this.ws.send("C");
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
			console.error(e.message);
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
						<Text style={[ styles.itemStatus, this.isReady ? styles.itemStatusActive : styles.itemStatusInactive ]}>⬤</Text>
					</View>
					<View style={styles.contentContainer}>
						{
							this.state.isReady
								? (
									<View style={styles.contentContainer}>
										<Button
											title="Clear"
											color="#a31ffc"
											onPress={ () => this.clearFrame() }
										/>
										<ButtonGrid
											style={styles.grid}
											paintFrame={ data => this.paintFrame(data) }
											paintRawFrame={ data => this.ws.send(data) }
										/>
									</View>
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
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center"
	},
	grid: {
		flex: 1
	}
});

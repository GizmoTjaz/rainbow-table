// Modules
import React from "react";

// Components
import { Fragment } from "react";
import { Button, SafeAreaView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";

// Local Components
import ButtonGrid from "./ButtonGrid";

export default class App extends React.Component {

	constructor (props) {

		super(props);

		this.state = {
			isReady: false
		}

		this.ws = new WebSocket("ws://192.168.4.1/ws");
	}

	paintFrame (activePixels) {

		if (activePixels.length === 0) {
			this.clearFrame();
			return;
		}
		
		let _frame = new Array(16*16).fill("0,0,0|");

		activePixels.forEach(pixel => {
			_frame[pixel.index] = `${pixel.r},${pixel.g},${pixel.b}|`;
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
			console.error(`${e.code} - ${e.reason}`);
		}

	}

	render () {
		return (
			<Fragment>
				<StatusBar style="light" />
				<View style={styles.background}>
					<SafeAreaView style={styles.container}>
						<Button
							title="Clear"
							color="#a31ffc"
							onPress={ () => this.clearFrame() }
						/>
						{
							this.state.isReady
								? <ButtonGrid style={styles.grid} onData={ data => this.paintFrame(data) } sendDirectly={ data => this.ws.send(data) } />
								: <Text>Connecting...</Text> 
						}
					</SafeAreaView>
				</View>
			</Fragment>
		);
	}
}

const styles = StyleSheet.create({
	background: {
		position: "absolute",
		width: "100%",
		height: "100%",
		top: 0,
		left: 0,
		backgroundColor: "#222"
	},
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	grid: {
		width: "100%",
		height: "100%"
	}
});

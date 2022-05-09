import React, { Fragment, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";

import Buttons from "./Buttons";
import ButtonGrid from "./ButtonGrid";

export default class App extends React.Component {

	constructor (props) {

		super(props);

		this.state = {
			isReady: false,
			activeIndexes: []
		}

		this.ws = new WebSocket("ws://192.168.4.1/ws");
	}

	// addPixel (pixelIndex) {
	// 	if (!this.state.activeIndexes.includes(pixelIndex)) {

	// 		this.setState({
	// 			activeIndexes: [ ...this.state.activeIndexes, pixelIndex ]
	// 		});

	// 		//this.ws.send(`S${pixelIndex}|255,255,255`);
	// 	}
	// }

	// removePixel (pixelIndex) {

	// 	this.setState({
	// 		activeIndexes: this.state.activeIndexes.filter(index => index !== pixelIndex)
	// 	});

	// 	//this.ws.send(`S${pixelIndex}|0,0,0`);
	// }

	paintFrame (activeIndexes) {

		if (activeIndexes.length === 0) {
			this.clearFrame();
			return;
		}
		
		let _frame = new Array(16*16).fill("0,0,0|");

		activeIndexes.forEach(pixelIndex => {
			_frame[pixelIndex] = "255,255,255|";
		});

		_frame = _frame.join("").slice(0, -1);

		//console.log(this.state.activeIndexes);

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

			//this.paintFrame();
		};

		this.ws.onerror = (e) => {
			console.error(e);
		}

		this.ws.onclose = (e) => {
			console.log(e.code, e.reason);
		}

	}

	// componentDidUpdate () {
	// 	this.paintFrame();
	// }

	// sendButton (buttonIndex) {
		
	// 	if (this.state.activeIndexes.includes(buttonIndex)) {
	// 		this.removePixel(buttonIndex);
	// 	} else {
	// 		this.addPixel(buttonIndex);
	// 	}

	// 	this.paintFrame();		
	// }

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
						{ !this.state.isReady && <Text>Connecting...</Text> }
						{ /*this.state.isReady && <Buttons style={styles.grid} onActivateButton={ (buttonIndex) => this.sendButton(buttonIndex) } />*/ }
						{ this.state.isReady && <ButtonGrid style={styles.grid} onData={ data => this.paintFrame(data) } sendDirectly={ data => this.ws.send(data) } /> }
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

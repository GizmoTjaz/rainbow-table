import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import Buttons from "./Buttons";

export default class App extends React.Component {

	constructor (props) {

		super(props);

		this.state = {
			isReady: false,
			activeIndexes: []
		}

		this.ws = new WebSocket("ws://192.168.64.112/ws");
	}

	addPixel (pixelIndex) {
		if (!this.state.activeIndexes.includes(pixelIndex)) {
			this.setState({
				activeIndexes: [ ...this.state.activeIndexes, pixelIndex ]
			});
		}
	}

	removePixel (pixelIndex) {
		this.setState({
			activeIndexes: this.state.activeIndexes.filter(index => index !== pixelIndex)
		});
	}

	paintFrame () {

		let frame = "";

		for (let i = 0; i < 16*16; i++) {
			if (this.state.activeIndexes.includes(i)) {
				frame += "255,255,255|";
			} else {
				frame += "0,0,0|";
			}
		}

		frame = frame.slice(0, -1);

		//console.log(this.state.activeIndexes);

		this.ws.send(frame);
	}

	componentDidMount () {

		this.ws.onopen = () => {

			console.log("Connected");

			this.setState({
				isReady: true
			});

			this.paintFrame();
		};

		this.ws.onerror = (e) => {
			console.error(e);
		}

		this.ws.onclose = (e) => {
			console.log(e.code, e.reason);
		}

	}

	componentDidUpdate () {
		this.paintFrame();
	}

	sendButton (buttonIndex) {

		// console.log(buttonIndex);
		
		if (this.state.activeIndexes.includes(buttonIndex)) {
			this.removePixel(buttonIndex);
		} else {
			this.addPixel(buttonIndex);
		}

		this.paintFrame();		
	}

	render () {
		return (
			<View style={styles.container}>
				{ !this.state.isReady && <Text>Connecting...</Text> }
				{ this.state.isReady && <Buttons style={styles.grid} onActivateButton={ (buttonIndex) => this.sendButton(buttonIndex) } /> }
				<StatusBar style="auto" />
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
	  width: "100%",
	  height: "100%"
  }
});

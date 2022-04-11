// Modules
var WebSocketClient = require("websocket").client;

// Constants
const FRAME_SIZE = 16*16;

// Variables
const client = new WebSocketClient();
const frame = [];

function serializePixelData (frame) {

	const ff = frame.map((pixel, index) => {

		let a = "";

		if (pixel.r === 255) {
			a += "#";
		} else {
			a += ".";
		}

		if (((index + 1) / 16) % 1 === 0) {
			a += "\n";
		}

		return a;

	}).join("");

	console.log(ff);

	return frame.map(pixel => `${pixel.r},${pixel.g},${pixel.b}`).join("|");
}

client.on("connectFailed", function(error) {
    console.log("Connect Error: " + error.toString());
});

client.on("connect", function(connection) {

    console.log("WebSocket Client Connected");

    connection.on("error", function(error) {
        console.log("Connection Error: " + error.toString());
    });

    connection.on("close", function() {
        console.log("echo-protocol Connection Closed");
    });

	//let i = 0;
    
	// setInterval(() => {

	// 	frame[i] = { r: 255, g: 0, b: 0 };

	// 	if (i === (FRAME_SIZE - 1)) {
	// 		frame[FRAME_SIZE - 1] = { r: 0, g: 0, b: 0 };
	// 		i = 0;
	// 	} else {
	// 		frame[i - 1] = { r: 0, g: 0, b: 0 };
	// 		i++;
	// 	}

	// 	//console.log(serializePixelData(frame));
	// 	connection.sendUTF(serializePixelData(frame));
	// }, 100);

	for (let i = 0; i < FRAME_SIZE; i++) {
		if (i % 2 == 0) {
			frame.push({ r: 255, g: 255, b: 255 });
		} else {
			frame.push({ r: 0, g: 0, b: 0 });
		}
	}

	connection.sendUTF(serializePixelData(frame));
});

// for (let i = 0; i < FRAME_SIZE; i++) {
// 	frame.push({ r: 0, g: 0, b: 0 });
// }

client.connect("ws://192.168.64.112/ws");
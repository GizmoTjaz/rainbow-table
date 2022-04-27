// Modules
var WebSocketClient = require("websocket").client;

// Constants
const FRAME_SIZE = 16*16;

// Variables
const client = new WebSocketClient();
const frame = [];

client.on("connectFailed", function(error) {
    console.log("Connect Error: " + error.toString());
});

client.on("connect", function(connection) {

    console.log("WebSocket Client Connected");

    connection.on("error", function(error) {
        console.log("Connection Error: " + error.toString());
    });

    connection.on("close", function() {
        console.log("Connection Closed");
    });

	connection.sendUTF("250,250,252|250,250,252|250,250,252|250,250,252|255,255,257|124,124,126|0,0,2|0,0,2|0,0,2|0,0,2|0,0,2|45,45,47|242,242,244|252,252,254|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|252,252,254|246,246,248|49,49,51|0,0,2|0,0,2|0,0,2|0,0,2|0,0,2|122,122,124|255,255,257|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|254,254,256|201,201,203|5,5,7|0,0,2|0,0,2|0,0,2|1,1,3|200,200,202|255,255,257|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|252,252,254|245,245,247|34,34,36|0,0,2|0,0,2|0,0,2|0,0,2|180,180,182|255,255,257|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|255,255,257|74,74,76|0,0,2|0,0,2|0,0,2|0,0,2|134,134,136|255,255,257|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|253,253,255|244,244,246|41,41,43|0,0,2|0,0,2|0,0,2|0,0,2|117,117,119|255,255,257|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|255,255,257|124,124,126|0,0,2|0,0,2|0,0,2|0,0,2|0,0,2|143,143,145|255,255,257|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|253,253,255|230,230,232|12,12,14|0,0,2|0,0,2|0,0,2|0,0,2|0,0,2|86,86,88|255,255,257|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|255,255,257|221,221,223|4,4,6|0,0,2|0,0,2|0,0,2|0,0,2|0,0,2|16,16,18|228,228,230|254,254,256|250,250,252|250,250,252|250,250,252|250,250,252|251,251,253|250,250,252|130,130,132|0,0,2|0,0,2|0,0,2|0,0,2|0,0,2|3,3,5|0,0,2|167,167,169|255,255,257|250,250,252|250,250,252|250,250,252|250,250,252|252,252,254|246,246,248|41,41,43|0,0,2|0,0,2|0,0,2|0,0,2|0,0,2|0,0,2|0,0,2|107,107,109|255,255,257|250,250,252|250,250,252|250,250,252|250,250,252|250,250,252|255,255,257|72,72,74|0,0,2|0,0,2|0,0,2|0,0,2|17,17,19|65,65,67|0,0,2|91,91,93|255,255,257|250,250,252|250,250,252|250,250,252|250,250,252|252,252,254|242,242,244|30,30,32|0,0,2|0,0,2|0,0,2|0,0,2|52,52,54|103,103,105|0,0,2|73,73,75|255,255,257|250,250,252|250,250,252|250,250,252|250,250,252|255,255,257|197,197,199|0,0,2|0,0,2|0,0,2|0,0,2|0,0,2|75,75,77|105,105,107|0,0,2|68,68,70|255,255,257|250,250,252|250,250,252|250,250,252|250,250,252|255,255,257|117,117,119|0,0,2|0,0,2|0,0,2|0,0,2|0,0,2|69,69,71|107,107,109|0,0,2|49,49,51|250,250,252|251,251,253|250,250,252|250,250,252|252,252,254|243,243,245|37,37,39|0,0,2|0,0,2|0,0,2|0,0,2|0,0,2|60,60,62|113,113,115|0,0,2|2,2,4|205,205,207|255,255,257|250,250,252");

});

for (let i = 0; i < FRAME_SIZE; i++) {
	frame.push({ r: 0, g: 0, b: 0 });
}

client.connect("ws://192.168.64.109/ws");
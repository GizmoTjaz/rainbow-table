#!/usr/bin/env node

// Modules
import fs from "fs";
import cluster from "cluster";
import * as websocket from "websocket";

// Utils
import { FRAME_PERIOD, TEMP_PATH, VIDEO_PATH } from "@utils/constants";

// Components
import frameExtractor from "@components/frame_extractor";
import paintFrame from "@components/paint_frame";
import drawFrame from "@components/draw_frame";
import downloadVideo from "@components/download_video";

// Types
import { WorkerMessageType, Packet, DrawnFrame, RawFrame } from "@typings/types";

// Variables
const client = new websocket.client();
let connection: websocket.connection | null = null;
let extractorFinished = false;

const fileStream = fs.createWriteStream("test.txt");

function paintWebFrame (frame: DrawnFrame): void {
	if (connection) {

		// console.log(frame.data);
		// console.log("\n\n\n");
		//console.log(frame.data);
		//console.log("\n\n\n");
		//console.log(frame.data);
		//connection.sendUTF(frame.data);

		fileStream.write(frame.data + "\n/\n");
	}
}

client.on("connectFailed", (error) => {
	console.log("Connect Error: " + error.toString());
});

client.on("connect", (_connection) => {

	connection = _connection;
	console.log("Connected");

	connection.on("message", msg => {
		console.log(msg);
	});
	
});

(async () => {

	// Fix missing directories
	if (!fs.existsSync(TEMP_PATH)) fs.mkdirSync(TEMP_PATH);
	if (!fs.existsSync(VIDEO_PATH)) await downloadVideo();

	if (cluster.isMaster) {

		const worker = cluster.fork();
		const framePackets: Packet[] = [];

		worker.on("message", ({ type, data }: { type: WorkerMessageType; data: string | Packet }) => {
			switch (type) {
				case "message":
					console.log(data);
					break;
				case "packet":
					framePackets.push(data as Packet);
					break;
				default:
			}
		});

		const unpackPacket = (packet: Packet): void => {
			for (let i = 0; i <= packet.length; i++) {

				const frame = packet[i];

				if (frame) {
					setTimeout(() => {
						// paintFrame(frame);
						paintWebFrame(frame);
						if (i === (packet.length - 1)) fetchNewPacket();
					}, i * FRAME_PERIOD);
				}
			}
		};
		
		const fetchNewPacket = (): void => {
		
			const framePacket: Packet = framePackets[0];
		
			if (framePacket) {
				framePackets.shift();
				unpackPacket(framePacket);
			} else {
				setTimeout(() => {
					if (framePackets.length === 0 && extractorFinished) {
						process.exit(0);
					} else {
						fetchNewPacket();
					}
				}, FRAME_PERIOD);
			}
		
		};

		client.connect("ws://192.168.64.109/ws");

		fetchNewPacket();

	} else {

		const rawFrameQueue: RawFrame[] = [];

		setInterval(async () => {
			if (rawFrameQueue.length >= 10 && process.send) {

				
				// Get first 10 raw frames
				const
					_rawFrameQueue = rawFrameQueue.splice(0, 10),
					framePacketPromise: Promise<DrawnFrame>[] = [];

				for (let i = 0; i <= _rawFrameQueue.length; i++) {

					const rawFrame = _rawFrameQueue[i];

					if (rawFrame) {
						framePacketPromise.push(drawFrame(rawFrame));
					}
				}

				process.send({
					type: "packet",
					data: await Promise.all(framePacketPromise)
				});
			}
		}, FRAME_PERIOD);

		frameExtractor(VIDEO_PATH, (frame: RawFrame) => {
			rawFrameQueue.push(frame);
		}).then(() => {
			extractorFinished = true;
			//fileStream.end();
		}).catch(err => {
			throw err;
		});

	}

})();
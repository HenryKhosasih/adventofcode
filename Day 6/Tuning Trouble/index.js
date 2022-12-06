import { readFile } from "node:fs/promises";

async function loadSignalData() {
	try {
		const filePath = new URL("./data.txt", import.meta.url);
		return await readFile(filePath, { encoding: "utf8" });
	} catch (error) {
		console.log(error);
	}
}

function findPacketMarker(signalData) {
	const signalArray = signalData.split("");
	for (let i = 0; i < signalArray.length; i++) {
		const packet = signalArray.slice(i, i + 4);
		const nonDuplicatePacket = new Set(packet);

		if (nonDuplicatePacket.size === 4) return i + 4;
	}
}

function findMessageMarker(signalData) {
	const signalArray = signalData.split("");
	for (let i = 0; i < signalArray.length; i++) {
		const message = signalArray.slice(i, i + 14);
		const nonDuplicateMessage = new Set(message);

		if (nonDuplicateMessage.size === 14) return i + 14;
	}
}

const signalData = await loadSignalData();
const packetMarker = findPacketMarker(signalData);
const messageMarker = findMessageMarker(signalData);
console.log(
	`A valid packet is detected after scanning through ${packetMarker} signal bits`
);
console.log(
	`A valid message is detected after scanning through ${messageMarker} signal bits`
);

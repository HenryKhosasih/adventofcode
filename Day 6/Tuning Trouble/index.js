import { readFile } from "node:fs/promises";

const PACKET_CHAR = 4;
const MESSAAGE_CHAR = 14;

async function loadSignalData() {
	try {
		const filePath = new URL("./data.txt", import.meta.url);
		return await readFile(filePath, { encoding: "utf8" });
	} catch (error) {
		console.log(error);
	}
}

function findMarker(signalData, distinctChar) {
	const signalArray = signalData.split("");
	for (let i = 0; i < signalArray.length; i++) {
		const chunk = signalArray.slice(i, i + distinctChar);
		const nonDuplicateChunk = new Set(chunk);

		if (nonDuplicateChunk.size === distinctChar) return i + distinctChar;
	}
}

const signalData = await loadSignalData();
const packetMarker = findMarker(signalData, PACKET_CHAR);
const messageMarker = findMarker(signalData, MESSAAGE_CHAR);
console.log(
	`A valid packet is detected after scanning through ${packetMarker} signal bits`
);
console.log(
	`A valid message is detected after scanning through ${messageMarker} signal bits`
);

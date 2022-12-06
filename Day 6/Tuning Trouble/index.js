import { readFile } from "node:fs/promises";

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
		const message = signalArray.slice(i, i + distinctChar);
		const nonDuplicateMessage = new Set(message);

		if (nonDuplicateMessage.size === distinctChar) return i + distinctChar;
	}
}

const signalData = await loadSignalData();
const packetMarker = findMarker(signalData, 4);
const messageMarker = findMarker(signalData, 14);
console.log(
	`A valid packet is detected after scanning through ${packetMarker} signal bits`
);
console.log(
	`A valid message is detected after scanning through ${messageMarker} signal bits`
);

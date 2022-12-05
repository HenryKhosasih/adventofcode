import { readFile } from "node:fs/promises";

async function loadAssignmentData() {
	try {
		const filePath = new URL("./data.txt", import.meta.url);
		return await readFile(filePath, { encoding: "utf8" });
	} catch (error) {
		console.log(error);
	}
}

function findPartialRedundantPairs(assignmentData) {
	const assignmentArray = assignmentData.split("\r\n");

	let totalRedundantPairs = 0;
	for (let i = 0; i < assignmentArray.length; i++) {
		const [firstElfRange, secondElfRange] = assignmentArray[i]
			.split(",")
			.map((range) => range.split("-"));

		const [smallerRange, largerRange] =
			+firstElfRange[1] - +firstElfRange[0] <=
			+secondElfRange[1] - +secondElfRange[0]
				? [firstElfRange, secondElfRange]
				: [secondElfRange, firstElfRange];

		if (
			+smallerRange[0] >= +largerRange[0] &&
			+smallerRange[1] <= +largerRange[1]
		)
			totalRedundantPairs++;
	}
	return totalRedundantPairs;
}

function findFullRedundantPairs(assignmentData) {
	const assignmentArray = assignmentData.split("\r\n");

	let totalRedundantPairs = 0;
	for (let i = 0; i < assignmentArray.length; i++) {
		const [firstElfRange, secondElfRange] = assignmentArray[i]
			.split(",")
			.map((range) => range.split("-"));

		const [precedingRange, laterRange] =
			+firstElfRange[0] <= +secondElfRange[0]
				? [firstElfRange, secondElfRange]
				: [secondElfRange, firstElfRange];

		if (+laterRange[0] <= +precedingRange[1]) totalRedundantPairs++;
	}
	return totalRedundantPairs;
}

const assignmentData = await loadAssignmentData();

// quest 1
const totalPartialRedundantPairs = findPartialRedundantPairs(assignmentData);
console.log(`Total partial redundant pairs: ${totalPartialRedundantPairs}`);

// quest 2
const totalFullRedundantPairs = findFullRedundantPairs(assignmentData);
console.log(`Total full redundant pairs: ${totalFullRedundantPairs}`);

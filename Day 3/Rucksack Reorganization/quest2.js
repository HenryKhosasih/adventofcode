import { readFile } from "node:fs/promises";
import { alphabetsScore } from "./alphabets.js";

async function loadRucksackData() {
	try {
		const filePath = new URL("./data.txt", import.meta.url);
		return await readFile(filePath, { encoding: "utf8" });
	} catch (error) {
		console.log(error);
	}
}

function findDuplicateItem(itemsInElf1, itemsInElf2, itemsInElf3) {
	const sortedItems = [itemsInElf1, itemsInElf2, itemsInElf3].sort(
		(a, b) => a.length - b.length
	);

	const [leastItems, secondLeastItems, thirdLeastItems] = sortedItems.map(
		(items) => items.split("")
	);

	// start by finding duplicates in smaller bags
	const duplicatesInFirstComparison = [
		...new Set(leastItems.filter((item) => secondLeastItems.includes(item))),
	];

	const duplicatesInSecondComparison = duplicatesInFirstComparison.filter(
		(item) => thirdLeastItems.includes(item)
	)[0];

	return duplicatesInSecondComparison;
}

function calculateTotalItemPriorities(rucksackData) {
	const rucksackArray = rucksackData.split("\r\n");
	const duplicateItems = [];

	for (let i = 0; i < rucksackArray.length; i += 3) {
		const itemsInElf1 = rucksackArray[i];
		const itemsInElf2 = rucksackArray[i + 1];
		const itemsInElf3 = rucksackArray[i + 2];

		duplicateItems.push(
			findDuplicateItem(itemsInElf1, itemsInElf2, itemsInElf3)
		);
	}

	const totalDuplicateItemsPriorityScore = duplicateItems.reduce(
		(acc, item) => acc + alphabetsScore[item],
		0
	);

	return totalDuplicateItemsPriorityScore;
}

const rucksackData = await loadRucksackData();

// quest 2
const totalItemsPriorities = calculateTotalItemPriorities(rucksackData);
console.log(
	`The total priority score for duplicated items found in group of 3 Elves is ${totalItemsPriorities}`
);

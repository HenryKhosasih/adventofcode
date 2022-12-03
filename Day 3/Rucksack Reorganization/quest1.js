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

function findDuplicateItem(itemsInCompartment1, itemsInCompartment2) {
	const duplicateItem = itemsInCompartment1.filter((c1Item) =>
		itemsInCompartment2.includes(c1Item)
	)[0];
	return duplicateItem;
}

function calculateTotalItemPriorities(rucksackData) {
	const rucksackArray = rucksackData.split("\r\n");
	const duplicateItems = [];

	for (let i = 0; i < rucksackArray.length; i++) {
		const items = rucksackArray[i];
		const numberOfItemsInEachCompartment = items.length / 2;

		const itemsInCompartment1 = items
			.slice(0, numberOfItemsInEachCompartment)
			.split("");
		const itemsInCompartment2 = items
			.slice(numberOfItemsInEachCompartment, items.length)
			.split("");

		duplicateItems.push(
			findDuplicateItem(itemsInCompartment1, itemsInCompartment2)
		);
	}

	const totalDuplicateItemsPriorityScore = duplicateItems.reduce(
		(acc, item) => acc + alphabetsScore[item],
		0
	);

	return totalDuplicateItemsPriorityScore;
}

const rucksackData = await loadRucksackData();

// quest 1
const totalItemsPriorities = calculateTotalItemPriorities(rucksackData);
console.log(
	`The total priority score for duplicated items found in both rucksack compartments is ${totalItemsPriorities}`
);

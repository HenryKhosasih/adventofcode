import { readFile } from "node:fs/promises";

async function loadCaloriesData() {
	try {
		const filePath = new URL("./data.txt", import.meta.url);
		return await readFile(filePath, { encoding: "utf8" });
	} catch (error) {
		console.log(error);
	}
}

function accumulateCaloriesByElves(caloriesData) {
	const caloriesArray = caloriesData.split("\r\n");

	let caloriesByElves = [];
	let totalCalories = 0;
	for (let i = 0; i < caloriesArray.length; i++) {
		let currentCalories = caloriesArray[i];
		if (currentCalories !== "") {
			totalCalories += Number(currentCalories);
		} else {
			caloriesByElves.push(totalCalories);
			totalCalories = 0;
		}
	}
	return caloriesByElves;
}

function sortDescending(numbers) {
	return numbers.sort((a, b) => b - a);
}

function findLargestCalories(caloriesArray) {
	const sortedCaloriesArray = sortDescending(caloriesArray);
	return sortedCaloriesArray[0];
}

function calculateTotalCaloriesFromTop3Elves(caloriesArray) {
	const sortedCaloriesArray = sortDescending(caloriesArray);
	let totalCalories = 0;
	for (let i = 0; i < 3; i++) {
		totalCalories += sortedCaloriesArray[i];
	}
	return totalCalories;
}

// quest 1
const caloriesData = await loadCaloriesData();
const caloriesByElves = accumulateCaloriesByElves(caloriesData);
const largestCalories = findLargestCalories(caloriesByElves);
console.log(`Largest calories carried by a single elf: ${largestCalories}`);

// quest 2
const totalCaloriesFromTop3Elves =
	calculateTotalCaloriesFromTop3Elves(caloriesByElves);

console.log(
	`Our top 3 elves are carrying a total calories of ${totalCaloriesFromTop3Elves}`
);

import { readFile } from "node:fs/promises";

async function loadCratesAndProcedureData() {
	try {
		const filePath = new URL("./data.txt", import.meta.url);
		return await readFile(filePath, { encoding: "utf8" });
	} catch (error) {
		console.log(error);
	}
}

function extractCrates(cratesAndProcedureData) {
	// Extract the first 8 lines where the crates information (including stacks) are located into an array
	const cratesData = cratesAndProcedureData.split("\r\n").slice(0, 8);
	const cratesByStacks = [];

	// Loop through each row of crates (from top to bottom)
	for (let i = 0; i < cratesData.length; i++) {
		const cratesRow = cratesData[i].split("");

		// Starting stack position
		let stack = 1;

		/*
				Since the crate strings are located in every 4 characters in each row,
				we can loop through each character with starting from index 1 to 5, then 9, 13, 17, and so on.
				We use the stack variable to keep track of the stack position.
				If a crate string is found, add it to the stack array (or create a new array that contains the crate string, if array hasn't been created). 
		*/
		for (let j = 1; j < cratesRow.length; j += 4) {
			if (cratesRow[j] != " ") {
				cratesByStacks[stack]
					? cratesByStacks[stack].unshift(cratesRow[j])
					: (cratesByStacks[stack] = [cratesRow[j]]);
			}
			stack++;
		}
	}

	// note: stacks start from index 1, not 0
	return cratesByStacks;
}

function extractProcedure(cratesAndProcedureData) {
	// Extract procedure data from index 10 (line 11) to end of file
	const procedureData = cratesAndProcedureData.split("\r\n").slice(10);

	/*
		For every procedure, extract information about how many crates to be moved,
		from and to which stacks, using regex that matches the digits pattern.
		Then, return this information as an object.
	*/
	const procedureFormatted = procedureData.map((procedure) => {
		const [crates, from, to] = procedure.match(/\d+/g).map(Number);
		return {
			crates,
			from,
			to,
		};
	});

	// e.g. {crates: 2, from: 5, to: 9}
	return procedureFormatted;
}

function getCratesOnTop(cratesByStacks, procedureData) {
	let createsOnTop = "";
	procedureData.forEach((move) => {
		// enable .reverse() for quest 1, and disable for quest 2 (change retrieval mechanism)
		const cratesToMove = cratesByStacks[move.from].splice(-move.crates);

		// Move crates to target stack
		cratesByStacks[move.to].push(...cratesToMove);
	});

	// Retrieve all crates on top (end) of all stacks
	cratesByStacks.forEach((stack) => {
		const topCrate = stack.slice(-1);
		createsOnTop += topCrate;
	});
	return createsOnTop;
}

// quest 1 & quest 2
const cratesAndProcedureData = await loadCratesAndProcedureData();
const cratesByStacks = extractCrates(cratesAndProcedureData);
const procedureData = extractProcedure(cratesAndProcedureData);
const cratesOnTop = getCratesOnTop(cratesByStacks, procedureData);

console.log(`Crates ready to be unloaded from the ship: ${cratesOnTop}`);

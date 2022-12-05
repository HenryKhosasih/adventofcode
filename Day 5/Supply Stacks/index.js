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
	const cratesData = cratesAndProcedureData.split("\r\n").slice(0, 8);
	const cratesByStacks = [];
	for (let i = 0; i < cratesData.length; i++) {
		const cratesRow = cratesData[i].split("");
		let stack = 1;
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
	const procedureData = cratesAndProcedureData.split("\r\n").slice(10);
	const procedureFormatted = procedureData.map((procedure) => {
		const [crates, from, to] = procedure.match(/\d+/g).map(Number);
		return {
			crates,
			from,
			to,
		};
	});
	return procedureFormatted;
}

function getCratesOnTop(cratesByStacks, procedureData) {
	let createsOnTop = "";
	procedureData.forEach((move) => {
		// enable .reverse() for quest 1, and disable for quest 2 (change retrieval mechanism)
		const cratesToMove = cratesByStacks[move.from].splice(-move.crates);
		cratesByStacks[move.to].push(...cratesToMove);
	});
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

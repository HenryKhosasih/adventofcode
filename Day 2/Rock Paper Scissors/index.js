import { readFile } from "node:fs/promises";

const GAME_RULE_OLD = {
	WIN: ["A Y", "B Z", "C X"],
	LOSE: ["B X", "C Y", "A Z"],
	DRAW: ["A X", "B Y", "C Z"],
};

const GAME_RULE_NEW = {
	WIN: {
		A: "B",
		B: "C",
		C: "A",
	},
	LOSE: {
		A: "C",
		B: "A",
		C: "B",
	},
};

const SHAPE_SCORE_OLD = {
	X: 1,
	Y: 2,
	Z: 3,
};

const SHAPE_SCORE_NEW = {
	A: 1,
	B: 2,
	C: 3,
};

const OUTCOME_HINT = {
	WIN: "Z",
	LOSE: "X",
	DRAW: "Y",
};

const OUTCOME_SCORE = {
	WIN: 6,
	LOSE: 0,
	DRAW: 3,
};

async function loadStrategyData() {
	try {
		const filePath = new URL("./data.txt", import.meta.url);
		return await readFile(filePath, { encoding: "utf8" });
	} catch (error) {
		console.log(error);
	}
}

function calculateScoreBeforeEnlightment(strategyData) {
	const strategyArray = strategyData.split("\r\n");
	let myScore = 0;
	for (let i = 0; i < strategyArray.length; i++) {
		const challenge = strategyArray[i];
		const myShape = challenge.slice(-1);
		const shapeScore = SHAPE_SCORE_OLD[myShape];

		if (GAME_RULE_OLD.WIN.includes(challenge)) {
			myScore += shapeScore + OUTCOME_SCORE.WIN;
		} else if (GAME_RULE_OLD.LOSE.includes(challenge)) {
			myScore += shapeScore + OUTCOME_SCORE.LOSE;
		} else if (GAME_RULE_OLD.DRAW.includes(challenge)) {
			myScore += shapeScore + OUTCOME_SCORE.DRAW;
		}
	}
	return myScore;
}

function generateShape(outcomeHint, opponentShape) {
	let myShape;
	if (outcomeHint === OUTCOME_HINT.WIN) {
		myShape = GAME_RULE_NEW.WIN[opponentShape];
	} else if (outcomeHint === OUTCOME_HINT.LOSE) {
		myShape = GAME_RULE_NEW.LOSE[opponentShape];
	} else {
		myShape = opponentShape;
	}
	return myShape;
}

function calculateScoreAfterEnlightment(strategyData) {
	const strategyArray = strategyData.split("\r\n");
	let myScore = 0;
	for (let i = 0; i < strategyArray.length; i++) {
		const challenge = strategyArray[i];
		const outcomeHint = challenge.slice(-1);
		const opponentShape = challenge.slice(0, 1);
		const myShape = generateShape(outcomeHint, opponentShape);
		const shapeScore = SHAPE_SCORE_NEW[myShape];

		if (outcomeHint === OUTCOME_HINT.WIN) {
			myScore += shapeScore + OUTCOME_SCORE.WIN;
		} else if (outcomeHint === OUTCOME_HINT.LOSE) {
			myScore += shapeScore + OUTCOME_SCORE.LOSE;
		} else if (outcomeHint === OUTCOME_HINT.DRAW) {
			myScore += shapeScore + OUTCOME_SCORE.DRAW;
		}
	}
	return myScore;
}

const strategyData = await loadStrategyData();

// quest 1
const myScoreBeforeEnlightment = calculateScoreBeforeEnlightment(strategyData);
console.log(
	`If you follow this strategy, you'll get a total score of ${myScoreBeforeEnlightment}`
);

console.log("Uh oh... The game rules have changed!");

// quest 2
const myScoreAfterEnlightment = calculateScoreAfterEnlightment(strategyData);
console.log(
	`If you follow this strategy, you'll get a total score of ${myScoreAfterEnlightment}`
);

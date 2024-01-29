import winnerHelper from "../helpers/winnerHelper.js";

const calculateComputerMove = (computerGame) => {
	const computerColour = computerGame.redIsNext ? "Red" : "Blue";
	const numberOfColumns = computerGame.board.length;
	const numberOfRows = computerGame.board[0].length;

	let columnFound = false;
	let randomColumn = Math.floor(Math.random() * numberOfColumns);
	while (!columnFound) {
		randomColumn = Math.floor(Math.random() * numberOfColumns);
		if (computerGame.board[randomColumn][numberOfRows - 1] === "White") {
			columnFound = true;
		}
	}

	let maxScoreColumnIndex = 0;
	let maxScore = 0;
	for (
		let potentialColumnIndex = 0;
		potentialColumnIndex < numberOfColumns;
		potentialColumnIndex++
	) {
		const potentialBoard = computerGame.board.map((column) => column.slice());
		const potentialRowIndex = calculateRowIndexForColumn(
			potentialBoard[potentialColumnIndex],
		);
		potentialBoard[potentialColumnIndex][potentialRowIndex] = computerColour;

		const score = calculateScore(
			computerGame.numberToConnect,
			potentialBoard,
			computerColour,
		);
		if (score > maxScore) {
			maxScoreColumnIndex = potentialColumnIndex;
			maxScore = score;
		}
	}

	const rowIndex = calculateRowIndexForColumn(
		computerGame.board[maxScoreColumnIndex],
	);

	computerGame.board[maxScoreColumnIndex][rowIndex] = computerColour;
	computerGame.redIsNext = !computerGame.redIsNext;
	computerGame.winner = winnerHelper.calculateWinner(
		computerGame.board,
		maxScoreColumnIndex,
		rowIndex,
		computerGame.numberToConnect,
	);
	computerGame.score = calculateScore(
		computerGame.numberToConnect,
		computerGame.board,
		computerGame.isRedNext ? "Red" : "Blue",
	);

	return computerGame;
};

const calculateRowIndexForColumn = (columnSquares) => {
	for (let square = 0; square < columnSquares.length; square++) {
		if (columnSquares[square] === "White") {
			return square;
		}
	}
};

const calculateScore = (numberToConnect, board, playerColour) => {
	const numberOfColumns = board.length;

	let score = 1;
	for (
		let connectNumber = numberToConnect;
		connectNumber > 1;
		connectNumber--
	) {
		for (
			let potentialColumnIndex = 0;
			potentialColumnIndex < numberOfColumns;
			potentialColumnIndex++
		) {
			const potentialBoard = board.map((column) => column.slice());
			const potentialRowIndex = calculateRowIndexForColumn(
				potentialBoard[potentialColumnIndex],
			);
			potentialBoard[potentialColumnIndex][potentialRowIndex] = playerColour;
			if (
				winnerHelper.calculateWinner(
					potentialBoard,
					potentialColumnIndex,
					potentialRowIndex,
					connectNumber,
				)
			) {
				score *= connectNumber;
			}
		}
	}
	return score;
};

export default { calculateComputerMove, calculateScore };

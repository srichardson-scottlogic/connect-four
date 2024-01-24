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

	const rowIndex = calculateIndexForColumn(computerGame.board[randomColumn]);

	computerGame.board[randomColumn][rowIndex] = computerColour;
	computerGame.redIsNext = !computerGame.redIsNext;
	computerGame.winner = winnerHelper.calculateWinner(
		computerGame.board,
		randomColumn,
		rowIndex,
		computerGame.numberToConnect,
	);

	return computerGame;
};

const calculateIndexForColumn = (columnSquares) => {
	for (let square = 0; square < columnSquares.length; square++) {
		if (columnSquares[square] === "White") {
			return square;
		}
	}
};

export default { calculateComputerMove };

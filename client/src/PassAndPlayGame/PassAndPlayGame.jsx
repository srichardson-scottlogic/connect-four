import Board from "../Board/Board";

export default function Game({
	squares,
	winner,
	redIsNext,
	connectNumber,
	handlePlay,
}) {
	const onPlay = (columnIndex, rowIndex) => {
		const nextSquares = squares.slice();
		nextSquares[columnIndex][rowIndex] = redIsNext ? "Red" : "Blue";

		const nextWinner = calculateWinner(
			nextSquares,
			columnIndex,
			rowIndex,
			connectNumber,
		);
		handlePlay(nextSquares, nextWinner, !redIsNext);
	};
	return (
		<Board
			squares={squares}
			onPlay={onPlay}
			winner={winner}
			redIsNext={redIsNext}
		/>
	);
}

const calculateWinner = (squares, columnIndex, rowIndex, connectNumber) => {
	const colour = squares[columnIndex][rowIndex];
	const width = squares.length;
	const height = squares[0].length;

	const countUpColour = (column, row, count) => {
		if (squares[column][row] === colour) {
			count += 1;
		} else {
			count = 0;
		}
		return count;
	};

	//Calculate if horiztonal winner
	const horizontalNumberToSubtract = Math.min(columnIndex, connectNumber - 1);
	let count = 0;
	let i = columnIndex - horizontalNumberToSubtract;
	for (i; i < width; i++) {
		count = countUpColour(i, rowIndex, count);
		if (count === connectNumber) {
			return colour;
		}
	}

	//Calculate if vertical winner
	const verticalNumberToSubtract = Math.min(rowIndex, connectNumber - 1);
	count = 0;
	i = rowIndex - verticalNumberToSubtract;
	for (i; i < height; i++) {
		count = countUpColour(columnIndex, i, count);
		if (count === connectNumber) {
			return colour;
		}
	}

	//Calculate if positive diagonal winner
	const positiveDiagonalNumberToSubtract = Math.min(
		Math.min(columnIndex, rowIndex),
		connectNumber - 1,
	);
	count = 0;
	i = columnIndex - positiveDiagonalNumberToSubtract;
	let j = rowIndex - positiveDiagonalNumberToSubtract;
	while (i < width && j < height) {
		count = countUpColour(i, j, count);
		if (count === connectNumber) {
			return colour;
		}
		i++;
		j++;
	}

	//Calculate if negative diagonal winner
	const negativeDiagonalNumberToSubtract = Math.min(
		Math.min(width - 1 - columnIndex, rowIndex),
		connectNumber - 1,
	);
	count = 0;
	i = columnIndex + negativeDiagonalNumberToSubtract;
	j = rowIndex - negativeDiagonalNumberToSubtract;
	while (i >= 0 && j < height) {
		count = countUpColour(i, j, count);
		if (count === connectNumber) {
			return colour;
		}
		i--;
		j++;
	}

	//Calculate if it's a draw
	if (rowIndex === height - 1) {
		for (let i = 0; i < width; i++) {
			if (squares[i][rowIndex] === "White") {
				return null;
			}
		}
		return "Draw";
	}

	//If there's no winner return null
	return null;
};

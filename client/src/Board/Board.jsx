import "./Board.css";
import Square from "../Square/Square";

export default function Board({
	squares,
	onPlay,
	winner,
	redIsNext,
	playerColour,
}) {
	const numberOfColumns = squares.length;
	const numberOfRows = squares[0].length;

	const handlePlay = (columnIndex) => {
		if (
			squares[columnIndex][numberOfRows - 1] !== "White" ||
			winner ||
			(redIsNext && playerColour === "Blue") ||
			(!redIsNext && playerColour === "Red")
		) {
			return;
		}
		const rowIndex = calculateNextSquare(squares[columnIndex]);
		onPlay(columnIndex, rowIndex);
	};

	const grid = [];
	for (let j = 0; j < numberOfRows; j++) {
		for (let i = 0; i < numberOfColumns; i++) {
			grid.unshift(
				<Square
					key={i + ", " + j}
					colour={squares[i][j]}
					onSquareClick={() => handlePlay(i)}
				/>,
			);
		}
	}

	return (
		<div
			className="board"
			data-columns={numberOfColumns}
			data-rows={numberOfRows}
		>
			{grid}
		</div>
	);
}

const calculateNextSquare = (columnSquares) => {
	for (let square = 0; square < columnSquares.length; square++) {
		if (columnSquares[square] === "White") {
			return square;
		}
	}
};

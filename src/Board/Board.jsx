import './Board.css';
import Square from '../Square/Square';

export default function Board({ redIsNext, squares, onPlay, winner }) {
    const numberOfColumns = squares.length;
    const numberOfRows = squares[0].length;
    const handlePlay = (columnIndex) => {
        if (squares[columnIndex][numberOfRows - 1] !== "White"
            || winner) {
            return;
        }
        const nextSquares = squares.slice();
        const rowIndex = calculateNextSquare(nextSquares[columnIndex]);
        nextSquares[columnIndex][rowIndex] = redIsNext ? "Red" : "Blue";
        onPlay(nextSquares, redIsNext, columnIndex, rowIndex);
    }

    const grid = [];
    for (let i = 0; i < numberOfColumns; i++) {
        const rows = [];
        for (let j = 0; j < numberOfRows; j++) {
            rows.unshift(<Square
                key={i + ", " + j}
                colour={squares[i][j]}
                onSquareClick={() => handlePlay(i)}
            />);
        }
        grid.push(
            <div className="board-column" key={i}>{rows}</div>
        );
    }

    return (
        <div className="board">{grid}</div>
    );
}

const calculateNextSquare = (columnSquares) => {
    for (let square = 0; square < columnSquares.length; square++) {
        if (columnSquares[square] === "White") {
            return square;
        }
    }
}

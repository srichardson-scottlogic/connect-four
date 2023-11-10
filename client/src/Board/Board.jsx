import './Board.css';
import Square from '../Square/Square';

export default function Board({ squares, onPlay, winner, playerColour, redIsNext }) {
    const numberOfColumns = squares.length;
    const numberOfRows = squares[0].length;
    const handlePlay = (columnIndex) => {
        if (squares[columnIndex][numberOfRows - 1] !== "White"
            || winner
            || (redIsNext && playerColour === "Blue")
            || (!redIsNext && playerColour === "Red")) {
            return;
        }
        const rowIndex = calculateNextSquare(squares[columnIndex]);
        onPlay(columnIndex, rowIndex);
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

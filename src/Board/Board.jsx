import { cloneElement, useState } from 'react';
import './Board.css';
import Square from '../Sqaure/Square';

export default function Board() {
    const numberOfColumns = 7;
    const numberOfRows = 6;
    const [squares, setSquares] = useState(new Array(numberOfColumns).fill(0).map(() => new Array(numberOfRows).fill("White")));
    const [redIsNext, setRedIsNext] = useState(true);

    function handlePlay(columnIndex) {
        const nextSquares = squares.slice();
        const rowIndex = calculateNextSquare(nextSquares[columnIndex]);
        nextSquares[columnIndex][rowIndex] = redIsNext ? "red" : "blue";
        setSquares(nextSquares);
        setRedIsNext(!redIsNext);
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

function calculateNextSquare(columnSquares) {
    for (let square = 0; square < columnSquares.length; square++) {
        if (columnSquares[square] === "White") {
            return square;
        }
    }
    return columnSquares[columnSquares.length - 1];
}
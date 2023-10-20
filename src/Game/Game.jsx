import './Game.css';
import { useState } from 'react';
import Board from "../Board/Board";

export default function Game({ squares, connectNumber, handlePlay, winner }) {
    const [redIsNext, setRedIsNext] = useState(true);

    function onPlay(nextSquares, redIsNext, columnIndex, rowIndex) {
        setRedIsNext(!redIsNext);
        const nextWinner = calculateWinner(nextSquares, columnIndex, rowIndex, connectNumber);
        handlePlay(nextSquares, nextWinner);
    }

    let status;
    if (winner) {
        status = "Winner is " + winner + "!";
    }

    return (
        <>
            <div className="winnerStatus">{status}</div>
            <Board redIsNext={redIsNext} squares={squares} onPlay={onPlay} winner={winner} />
        </>
    );
}

const calculateWinner = (squares, columnIndex, rowIndex, connectNumber) => {
    const colour = squares[columnIndex][rowIndex];
    const width = squares.length;
    const height = squares[0].length;

    const countUpColour = (column, row, count) => {
        if (squares[column][row] === colour) {
            count += 1;
        }
        else {
            count = 0;
        }
        return count;
    }

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
    const positiveDiagonalNumberToSubtract = Math.min(Math.min(columnIndex, rowIndex), connectNumber - 1);
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
    const negativeDiagonalNumberToSubtract = Math.min(Math.min(((width - 1) - columnIndex), rowIndex), connectNumber - 1);
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

    //If there's no winner return null
    return null;
}
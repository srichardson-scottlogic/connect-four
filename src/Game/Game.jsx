import './Game.css';
import { useState } from 'react';
import Board from "../Board/Board";
import ResetButton from "../ResetButton/ResetButton";

export default function Game() {
    const numberOfColumns = 7;
    const numberOfRows = 6;
    const connectNumber = 4;
    const emptyBoard = new Array(numberOfColumns).fill(0).map(() => new Array(numberOfRows).fill("White"));
    const [squares, setSquares] = useState(emptyBoard);
    const [redIsNext, setRedIsNext] = useState(true);
    const [winner, setWinner] = useState(null);

    function handlePlay(nextSquares, redIsNext, columnIndex, rowIndex) {
        setSquares(nextSquares);
        setRedIsNext(!redIsNext);
        calculateWinner(nextSquares, columnIndex, rowIndex, connectNumber, setWinner);
    }

    function handleReplay() {
        if (winner) {
            setWinner(null);
        }
        setSquares(emptyBoard);
    }

    let status;
    if (winner) {
        status = "Winner is " + winner + "!";
    }

    let resetStatus = "Reset Game";
    if (winner) {
        resetStatus = "Play Again";
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="resetButtonContainer">
                <ResetButton resetStatus={resetStatus} onResetClick={handleReplay} />
            </div >
            <Board redIsNext={redIsNext} squares={squares} onPlay={handlePlay} winner={winner} />
        </>
    );
}

const calculateWinner = (squares, columnIndex, rowIndex, connectNumber, setWinner) => {
    const colour = squares[columnIndex][rowIndex];
    const width = squares.length;
    const height = squares[0].length;

    function calculateIfHorizontalWinner() {
        const numberToSubtract = Math.min(columnIndex, connectNumber - 1);

        let count = 0;
        let i = columnIndex - numberToSubtract;
        for (i; i < width; i++) {
            count = countUpColour(i, rowIndex, count);
        }
    }

    const calculateIfVerticalWinner = () => {
        const numberToSubtract = Math.min(rowIndex, connectNumber - 1);

        let count = 0;
        let i = rowIndex - numberToSubtract;
        for (i; i < height; i++) {
            count = countUpColour(columnIndex, i, count);
        }
    }

    const calculateIfPositiveDiagonalWinner = () => {
        const numberToSubtract = Math.min(Math.min(columnIndex, rowIndex), connectNumber - 1);

        let count = 0;
        let i = columnIndex - numberToSubtract;
        let j = rowIndex - numberToSubtract;

        while (i < width && j < height) {
            count = countUpColour(i, j, count);
            i++;
            j++;
        }
    }

    const calculateIfNegativeDiagonalWinner = () => {
        const numberToSubtract = Math.min(Math.min(((width - 1) - columnIndex), rowIndex), connectNumber - 1);

        let count = 0;
        let i = columnIndex + numberToSubtract;
        let j = rowIndex - numberToSubtract;

        while (i >= 0 && j < height) {
            count = countUpColour(i, j, count);
            i--;
            j++;
        }
    }

    const countUpColour = (column, row, count) => {
        if (squares[column][row] === colour) {
            count += 1;
        }
        else {
            count = 0;
        }
        if (count === connectNumber) {
            setWinner(colour);
        }
        return count;
    }

    calculateIfHorizontalWinner();
    calculateIfVerticalWinner();
    calculateIfPositiveDiagonalWinner();
    calculateIfNegativeDiagonalWinner();
}
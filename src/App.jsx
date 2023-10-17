import { useState } from 'react';
import './App.css';

function Square({ colour, onSquareClick }) {
  return (
    <button
      style={{ backgroundColor: colour }}
      className={"square"}
      onClick={onSquareClick}
    >
    </button >
  );
}

export default function Board() {
  const numberOfColumns = 7;
  const numberOfRows = 6;
  const [squares, setSquares] = useState(new Array(numberOfColumns).fill(0).map(() => new Array(numberOfRows).fill("White")));
  const [redIsNext, setRedIsNext] = useState(true);

  function handlePlay(i, j) {
    const nextSquares = squares.slice();
    nextSquares[i][j] = redIsNext ? "red" : "blue";
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
        onSquareClick={() => handlePlay(i, j)}
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

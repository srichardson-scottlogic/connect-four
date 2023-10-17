import './App.css';

function Square({ value }) {
  return (
    <button className='square'>{value}</button>
  );
}

export default function Board() {
  const numberOfColumns = 7;
  const numberOfRows = 6;

  const grid = [];
  for (let i = 0; i < numberOfColumns; i++) {
    const rows = [];
    for (let j = 0; j < numberOfRows; j++) {
      rows.unshift(<Square value={i + ", " + j} key={i + ", " + j} />);
    }
    grid.push(
      <div className="board-column" key={i}>{rows}</div>
    );
  }

  return (
    <div className="board">{grid}</div>
  );
}

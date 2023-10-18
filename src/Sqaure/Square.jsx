import './Square.css';

export default function Square({ colour, onSquareClick }) {
    return (
        <button
            style={{ backgroundColor: colour }}
            className={"square"}
            onClick={onSquareClick}
        >
        </button >
    );
}
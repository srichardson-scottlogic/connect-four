import "./Square.css";

export default function Square({ colour, onSquareClick }) {
	return (
		<div
			style={{ backgroundColor: colour }}
			className={"square"}
			onClick={onSquareClick}
		></div>
	);
}

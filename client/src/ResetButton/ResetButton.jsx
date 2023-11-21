import "./ResetButton.css";

export default function ResetButton({ winner, onClick }) {
	let resetStatus;
	if (winner) {
		resetStatus = "Play Again";
	} else resetStatus = "Reset Game";
	return (
		<div className="resetButtonContainer">
			<button className="buttonText" onClick={onClick}>
				{resetStatus}
			</button>
		</div>
	);
}

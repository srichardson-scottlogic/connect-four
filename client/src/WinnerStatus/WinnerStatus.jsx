import "./WinnerStatus.css";

export default function WinnerStatus({ winner, playerColour }) {
	let status;
	if (winner) {
		status =
			winner === "Draw"
				? "It's a draw 🥱"
				: playerColour === winner
				  ? "Congratulations, you won 😁"
				  : "You lost, better luck next time 😓";
	}

	return <div className="winnerStatus">{status}</div>;
}

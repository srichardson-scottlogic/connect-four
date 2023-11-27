import "./WinnerStatus.css";

export default function WinnerStatus({ winner, playerColour }) {
	let status;

	if (playerColour) {
		if (winner) {
			status =
				winner === "Draw"
					? "it's a draw 🥱"
					: playerColour === winner
					  ? "congratulations, you won 😁"
					  : "you lost, better luck next time 😓";
		}
	} else {
		if (winner) {
			status = winner === "Draw" ? "it's a draw 🥱" : winner + " wins 🎉";
		}
	}

	return <div className="winnerStatus">{status}</div>;
}

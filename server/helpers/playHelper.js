import winnerHelper from "../helpers/winnerHelper.js";

const itIsPlayersGo = (redIsNext, playerColour) => {
	return (
		(redIsNext && playerColour === "Red") ||
		(!redIsNext && playerColour === "Blue")
	);
};

const setCurrentMove = (room, playerColour, columnIndex, rowIndex) => {
	if (itIsPlayersGo(room.redIsNext, playerColour)) {
		room.board[columnIndex][rowIndex] = playerColour;
		room.redIsNext = !room.redIsNext;
		room.winner = winnerHelper.calculateWinner(
			room.board,
			columnIndex,
			rowIndex,
			room.numberToConnect,
		);
		return room;
	} else console.warn(`It is not ${playerColour}'s go!`);
};

export default { itIsPlayersGo, setCurrentMove };

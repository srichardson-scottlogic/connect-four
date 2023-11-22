import JoinExistingGame from "../JoinExistingGame/JoinExistingGame";
import "./GameModeSelection.css";

export default function GameModeSelection({ handleBoardCustomisationSubmit }) {
	return (
		<>
			<p className="text">
				🔴 Choose above how many columns and rows you want on your board, and
				the number you want to connect 🔵
			</p>
			<p className="text">
				🔵 Then, carefully pick how you want to play. Once you choose there is
				no return unless you refresh the page 🔴
			</p>
			<div className="twoPlayerButtonContainer">
				<button className="button" onClick={handleBoardCustomisationSubmit}>
					Create Online Room
				</button>
			</div>
			<p className="text">🔴 OR 🔴</p>
			<JoinExistingGame />
			<p className="text">🔵 OR 🔵</p>
			<div className="onePlayerButtonContainer">
				<button className="button">Pass and Play (Not Implemented Yet)</button>
			</div>
		</>
	);
}

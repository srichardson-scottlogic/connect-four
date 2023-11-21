import "./GameModeSelection.css";

export default function GameModeSelection({
	handleBoardCustomisationSubmit,
	handleJoinGame,
	inputtedRoomId,
	setInputtedRoomId,
}) {
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
				<button className="buttonText" onClick={handleBoardCustomisationSubmit}>
					Create Online Room
				</button>
			</div>
			<p className="text">🔴 OR 🔴</p>
			<div className="joinTwoPlayerGameContainer">
				<button className="buttonText" onClick={handleJoinGame}>
					Join Existing Game
				</button>
				<label>
					<input
						className="gameRoomId"
						placeholder="put game room code here"
						value={inputtedRoomId}
						onInput={(e) => setInputtedRoomId(e.target.value)}
					/>
				</label>
			</div>
			<p className="text">🔵 OR 🔵</p>
			<div className="onePlayerButtonContainer">
				<button className="buttonText">
					Pass and Play (Not Implemented Yet)
				</button>
			</div>
		</>
	);
}

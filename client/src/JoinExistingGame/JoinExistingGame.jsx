import "./JoinExistingGame.css";
import useWebSocket from "react-use-websocket";
import { useEffect, useState } from "react";

export default function JoinExistingGame() {
	const [inputtedRoomId, setInputtedRoomId] = useState("");
	const [errors, setErrors] = useState({});

	const { sendJsonMessage, lastJsonMessage } = useWebSocket(
		process.env.REACT_APP_WS_URL,
		{
			share: true,
		},
	);

	const handleValidation = () => {
		const roomIdErrors = {};

		if (!inputtedRoomId) {
			roomIdErrors["roomId"] = "cannot be empty";
			setErrors(roomIdErrors);
			return false;
		}

		if (!inputtedRoomId.match(/^[A-Z0-9]{5}$/)) {
			roomIdErrors["roomId"] = "invalid game room code";
			setErrors(roomIdErrors);
			return false;
		}
		return true;
	};

	const handleJoinGame = () => {
		if (handleValidation()) {
			sendJsonMessage({
				action: "join",
				roomId: inputtedRoomId,
			});
		}
	};

	useEffect(() => {
		if (lastJsonMessage) {
			const action = lastJsonMessage.action;

			switch (action) {
				case "roomIdError":
					setErrors(lastJsonMessage);
					break;

				default:
					break;
			}
		}
	}, [lastJsonMessage]);

	return (
		<div className="joinTwoPlayerGameContainer">
			<div className="buttonContainer">
				<button className="button" onClick={handleJoinGame}>
					Join Existing Game
				</button>
			</div>
			<div className="inputField">
				<input
					className="gameRoomId"
					placeholder="put game room code here"
					value={inputtedRoomId}
					onInput={(e) => setInputtedRoomId(e.target.value)}
				/>
				<div className="error">{errors["roomId"]}</div>
			</div>
		</div>
	);
}

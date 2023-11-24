import useWebSocket from "react-use-websocket";
import { useCallback, useState, useEffect } from "react";

import Game from "../Game/Game";
import GameInformation from "../GameInformation/GameInformation";
import WinnerStatus from "../WinnerStatus/WinnerStatus";
import CustomiseGameForm from "../CustomiseGameForm/CustomiseGameForm";
import ResetButton from "../ResetButton/ResetButton";
import GameModeSelection from "../GameModeSelection/GameModeSelection";

export default function Home() {
	const [squares, setSquares] = useState(null);
	const [winner, setWinner] = useState(null);
	const [gameCustomised, setGameCustomised] = useState(false);
	const [roomId, setRoomId] = useState(null);
	const [playerColour, setPlayerColour] = useState(null);
	const [redIsNext, setRedIsNext] = useState(null);

	const [numberOfColumns, setNumberOfColumns] = useState(7);
	const [numberOfRows, setNumberOfRows] = useState(6);
	const [numberToConnect, setNumberToConnect] = useState(4);
	const [customiseGameErrors, setCustomiseGameErrors] = useState({});

	const { sendJsonMessage, lastJsonMessage } = useWebSocket(
		process.env.REACT_APP_WS_URL,
		{
			share: true,
		},
	);

	const handleBoardCustomisationSubmit = () => {
		if (validateBoardCustomisationSubmit()) {
			const message = {
				action: "customise",
				numberOfColumns: Number(numberOfColumns),
				numberOfRows: Number(numberOfRows),
				numberToConnect: Number(numberToConnect),
			};

			if (!gameCustomised) {
				message.action = "create";
			}

			sendJsonMessage(message);
		}
	};

	const handlePlay = useCallback(
		(nextSquares, nextWinner, redIsNext) => {
			setSquares(nextSquares);
			setWinner(nextWinner);
			setRedIsNext(redIsNext);
		},
		[setSquares, setWinner, setRedIsNext],
	);

	const handleCustomisationFromOtherPlayer = useCallback(
		(numberOfColumns, numberOfRows, numberToConnect) => {
			setNumberOfColumns(numberOfColumns);
			setNumberOfRows(numberOfRows);
			setNumberToConnect(numberToConnect);
			alert((playerColour === "Red" ? "Red" : "Blue") + " changed the board!");
		},
		[setNumberOfColumns, setNumberOfRows, setNumberToConnect, playerColour],
	);

	useEffect(() => {
		const queryParameters = new URLSearchParams(window.location.search);
		const roomIdParam = queryParameters.get("gameRoomCode");
		if (roomIdParam) {
			sendJsonMessage({
				action: "join",
				roomId: roomIdParam,
			});
		}
	}, [sendJsonMessage]);

	useEffect(() => {
		if (lastJsonMessage) {
			const action = lastJsonMessage.action;

			switch (action) {
				case "create":
					setRoomId(lastJsonMessage.roomId);
					const location = window.history.location || window.location;

					var queryParams = new URLSearchParams(location.search);

					// Set new or modify existing parameter value.
					queryParams.set("gameRoomCode", lastJsonMessage.roomId);

					// Replace current querystring with the new one.
					window.history.replaceState(null, null, "?" + queryParams.toString());
					break;

				case "join":
					setRoomId(lastJsonMessage.roomId);
					handlePlay(
						lastJsonMessage.board,
						lastJsonMessage.winner,
						lastJsonMessage.redIsNext,
					);
					setPlayerColour(lastJsonMessage.playerColour);
					setGameCustomised(true);
					break;

				case "customiseFromOtherPlayer":
					handleCustomisationFromOtherPlayer(
						lastJsonMessage.numberOfColumns,
						lastJsonMessage.numberOfRows,
						lastJsonMessage.numberToConnect,
					);
					break;
				case "customise":
				case "play":
					handlePlay(
						lastJsonMessage.board,
						lastJsonMessage.winner,
						lastJsonMessage.redIsNext,
					);
					break;

				case "roomIdError":
					break;

				default:
					console.warn(`Type: ${action} unknown`);
					break;
			}
		}
	}, [lastJsonMessage, handlePlay, handleCustomisationFromOtherPlayer]);

	const validateBoardCustomisationSubmit = () => {
		const errors = { ...customiseGameErrors };

		validateFieldIsNotNull(errors, numberOfColumns, "numberOfColumns");
		validateFieldIsNotNull(errors, numberOfRows, "numberOfRows");
		validateFieldIsNotNull(errors, numberToConnect, "numberToConnect");

		if (!(Object.keys(errors).length === 0)) {
			setCustomiseGameErrors(errors);
			return false;
		}

		return true;
	};

	const validateFieldIsNotNull = (errors, field, fieldName) => {
		if (!field) {
			errors[fieldName] = "cannot be empty";
		}
		return errors;
	};

	return (
		<>
			<GameInformation
				roomId={roomId}
				redIsNext={redIsNext}
				gameCustomised={gameCustomised}
				playerColour={playerColour}
				winner={winner}
			/>
			<CustomiseGameForm
				numberOfColumns={numberOfColumns}
				setNumberOfColumns={setNumberOfColumns}
				numberOfRows={numberOfRows}
				setNumberOfRows={setNumberOfRows}
				numberToConnect={numberToConnect}
				setNumberToConnect={setNumberToConnect}
				customiseGameErrors={customiseGameErrors}
				setCustomiseGameErrors={setCustomiseGameErrors}
			/>
			<WinnerStatus winner={winner} playerColour={playerColour} />
			{!gameCustomised && !roomId && (
				<GameModeSelection
					handleBoardCustomisationSubmit={handleBoardCustomisationSubmit}
				/>
			)}
			{gameCustomised && (
				<>
					<ResetButton
						winner={winner}
						onClick={handleBoardCustomisationSubmit}
					/>
					<Game
						squares={squares}
						winner={winner}
						roomId={roomId}
						playerColour={playerColour}
						redIsNext={redIsNext}
					/>
				</>
			)}
		</>
	);
}

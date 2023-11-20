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
    const [inputtedRoomId, setInputtedRoomId] = useState(null);

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(process.env.REACT_APP_WS_URL, {
        share: true,
    });

    const handleBoardCustomisationSubmit = () => {
        const message = {
            action: "customise",
            numberOfColumns: numberOfColumns,
            numberOfRows: numberOfRows,
            numberToConnect: numberToConnect
        }

        if (!gameCustomised) {
            message.action = "create";
        }

        sendJsonMessage(message);
    }

    const handleJoinGame = () => {
        sendJsonMessage({
            action: "join",
            roomId: inputtedRoomId
        });
    }

    const handlePlay = useCallback((nextSquares, nextWinner, redIsNext) => {
        setSquares(nextSquares);
        setWinner(nextWinner);
        setRedIsNext(redIsNext);
    }, [setSquares, setWinner, setRedIsNext]);

    useEffect(() => {
        if (lastJsonMessage) {
            const action = lastJsonMessage.action;

            switch (action) {
                case "create":
                    setRoomId(lastJsonMessage.roomId);
                    break;

                case "join":
                    setRoomId(lastJsonMessage.roomId);
                    handlePlay(lastJsonMessage.board, lastJsonMessage.winner, lastJsonMessage.redIsNext);
                    setPlayerColour(lastJsonMessage.playerColour);
                    setGameCustomised(true);
                    break;

                case "customise":
                case "play":
                    handlePlay(lastJsonMessage.board, lastJsonMessage.winner, lastJsonMessage.redIsNext);
                    break;

                default:
                    console.warn(`Type: ${action} unknown`);
                    break;

            }
        }
    }, [lastJsonMessage, handlePlay]);

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
            />
            <WinnerStatus
                winner={winner}
                playerColour={playerColour}
            />
            {(!gameCustomised && !roomId) &&
                <GameModeSelection
                    handleBoardCustomisationSubmit={handleBoardCustomisationSubmit}
                    handleJoinGame={handleJoinGame}
                    inputtedRoomId={inputtedRoomId}
                    setInputtedRoomId={setInputtedRoomId}
                />
            }
            {gameCustomised &&
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
            }
        </>
    );
}
import "./CustomisedGame.css";
import useWebSocket from "react-use-websocket";
import { useCallback, useState, useEffect } from "react";
import Game from "../Game/Game";

export default function CustomisedGame() {
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
                    handlePlay(lastJsonMessage.board, lastJsonMessage.winner, lastJsonMessage.redIsNext);
                    break;

                case "play":
                    handlePlay(lastJsonMessage.board, lastJsonMessage.winner, lastJsonMessage.redIsNext);
                    break;

                default:
                    console.warn(`Type: ${action} unknown`);
                    break;

            }
        }
    }, [lastJsonMessage, handlePlay]);

    let status;
    if (winner) {
        status = winner === "Draw" ? "It's a draw 🥱" : (playerColour === winner) ? "Congratulations, you won 😁" : "You lost, better luck next time 😓";
    }

    let resetStatus;
    if (gameCustomised) {
        resetStatus = "Reset Game";
        if (winner) {
            resetStatus = "Play Again";
        }
    } else {
        resetStatus = "Play";
    }

    let whoIsNext;
    if ((redIsNext && playerColour === "Red")
        || (!redIsNext && playerColour === "Blue")) {
        whoIsNext = "It's Your Go!"
    }
    else whoIsNext = `It's ${redIsNext ? 'Red' : 'Blue'}'s Go!`;

    return (
        <>
            <div className="gameInfoContainer">
                {roomId && <div className="gameId">Game ID = {roomId}</div>}
                {gameCustomised && <div className="playerColour">You are {playerColour}</div>}
                {(gameCustomised && !winner) && <div className="whoIsNext">{whoIsNext}</div>}
            </div>
            <div className="customiseGame">
                <label >
                    Number of Columns:
                    <input
                        name="numberOfColumns"
                        value={numberOfColumns}
                        onInput={e => setNumberOfColumns(Number(e.target.value))}
                    />
                </label>
                <label>
                    Number of Rows:
                    <input
                        name="numberOfRows"
                        value={numberOfRows}
                        onInput={e => setNumberOfRows(Number(e.target.value))}
                    />
                </label>
                <label>
                    Number to Connect:
                    <input
                        name="connectNumber"
                        value={numberToConnect}
                        onInput={e => setNumberToConnect(Number(e.target.value))}
                    />
                </label>
            </div >
            <div className="winnerStatus">{status}</div>
            {gameCustomised && <div className="resetButtonContainer">
                <button className="buttonText" onClick={handleBoardCustomisationSubmit}>{resetStatus}</button >
            </div >}
            {(!gameCustomised && !roomId) && <div className="text">Pick (carefully) how you want to play:</div>}
            {(!gameCustomised && !roomId) && <div className="twoPlayerButtonContainer">
                <button className="buttonText" onClick={handleBoardCustomisationSubmit}>Create Online Room</button >
            </div >}
            {(!gameCustomised && !roomId) && <div className="text">OR</div>}
            {(!gameCustomised && !roomId) && <div className="joinTwoPlayerGameContainer">
                <button className="buttonText" onClick={handleJoinGame}>Join Existing Game</button >
                <label>
                    <input
                        className="gameRoomId"
                        placeholder="put game room code here"
                        value={inputtedRoomId}
                        onInput={e => setInputtedRoomId(e.target.value)}
                    />
                </label>
            </div>}
            {(!gameCustomised && !roomId) && <div className="text">OR</div>}
            {(!gameCustomised && !roomId) && <div className="onePlayerButtonContainer">
                <button className="buttonText">Pass and Play (Not Implemented Yet)</button >
            </div >}
            {(!gameCustomised && !roomId) && <div className="text">By the way, once you choose there is no return 😇</div>}
            {gameCustomised && < Game squares={squares} winner={winner} roomId={roomId} playerColour={playerColour} redIsNext={redIsNext} />}
        </>
    );
}
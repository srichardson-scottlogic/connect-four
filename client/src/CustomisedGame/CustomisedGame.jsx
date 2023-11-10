import "./CustomisedGame.css";
import useWebSocket from "react-use-websocket";
import { useCallback, useState, useEffect } from "react";
import Game from "../Game/Game";

export default function CustomisedGame() {
    const [squares, setSquares] = useState(null);
    const [winner, setWinner] = useState(null);
    const [gameCustomised, setGameCustomised] = useState(false);
    const [roomId, setRoomId] = useState(null);

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(process.env.REACT_APP_WS_URL, {
        share: true,
    });

    const handlePlay = useCallback((nextSquares, nextWinner) => {
        setSquares(nextSquares);
        setWinner(nextWinner);
    }, [setSquares, setWinner]);

    const handleJoinGame = (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        sendJsonMessage({
            action: "join",
            roomId: formJson.gameRoomId
        });
    }

    useEffect(() => {
        if (lastJsonMessage) {
            const action = lastJsonMessage.action;

            switch (action) {
                case "create":
                    setRoomId(lastJsonMessage.roomId);
                    break;

                case "join":
                    setRoomId(lastJsonMessage.roomId);
                    handlePlay(lastJsonMessage.board, lastJsonMessage.winner);
                    setGameCustomised(true);
                    break;

                case "customise":
                    handlePlay(lastJsonMessage.board, lastJsonMessage.winner);
                    break;

                case "play":
                    handlePlay(lastJsonMessage.board, lastJsonMessage.winner);
                    break;

                default:
                    console.warn(`Type: ${action} unknown`);
                    break;

            }
        }
    }, [lastJsonMessage, handlePlay]);

    const handleBoardCustomisationSubmit = (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        const message = {
            action: "customise",
            numberOfColumns: Number(formJson.numberOfColumns),
            numberOfRows: Number(formJson.numberOfRows),
            numberToConnect: Number(formJson.connectNumber)
        }

        if (!gameCustomised) {
            message.roomId = formData.roomId;
            message.action = "create";
        }

        sendJsonMessage(message);
    }

    let status;
    if (winner) {
        status = winner === "Draw" ? "It's a Draw!" : "Winner is " + winner + "!";
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

    return (
        <>
            {roomId && <div className="gameId">Game ID = {roomId}</div>}
            <form className="customiseGame" onSubmit={handleBoardCustomisationSubmit}>
                <div className="formContainer">
                    <label>
                        Number of Columns:
                        <input
                            defaultValue={7}
                            name="numberOfColumns"
                        />
                    </label>
                    <label>
                        Number of Rows:
                        <input
                            defaultValue={6}
                            name="numberOfRows"
                        />
                    </label>
                    <label>
                        Number to Connect:
                        <input
                            defaultValue={4}
                            name="connectNumber"
                        />
                    </label>
                </div>
                <div className="winnerStatus">{status}</div>
                {gameCustomised && <div className="resetButtonContainer">
                    <button className="reset" type="submit">{resetStatus}</button >
                </div >}
                {!gameCustomised && <div className="twoPlayerButtonContainer">
                    <button className="reset" type="submit">Play Online</button >
                </div >}
                {/* {!gameCustomised && <div className="onePlayerButtonContainer">
                    <button className="reset" type="submit" onClick={handleBoardCustomisationSubmit}>Pass and Play</button >
                </div >} */}
            </form>
            {!gameCustomised && <form className="joinExistingGame" onSubmit={handleJoinGame}>
                <div className="joinGameContainer">
                    <label>
                        Game Room ID:
                        <input name="gameRoomId" />
                    </label>
                </div>
                <div className="joinGameButtonContainer">
                    <button className="join" type="submit">Join</button >
                </div >
            </form>}
            {gameCustomised && < Game squares={squares} winner={winner} roomId={roomId} />}
        </>
    );
}
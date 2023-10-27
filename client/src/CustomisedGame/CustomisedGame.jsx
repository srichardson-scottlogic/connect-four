import "./CustomisedGame.css";
import useWebSocket from "react-use-websocket";
import { useCallback, useState, useEffect } from "react";
import Game from "../Game/Game";

export default function CustomisedGame() {
    const [connectNumber, setConnectNumber] = useState(null);
    const [squares, setSquares] = useState(new Array(7).fill(0).map(() => new Array(6).fill("White")));
    const [winner, setWinner] = useState(null);
    const [gameCustomised, setGameCustomised] = useState(false);

    const WS_URL = `ws://192.168.1.168:8080`;

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
        share: true,
    });

    const handlePlay = useCallback((nextSquares, nextWinner) => {
        setSquares(nextSquares);
        setWinner(nextWinner);
    }, [setSquares, setWinner]);

    const handleRefresh = useCallback((nextSquares) => {
        sendJsonMessage({
            winner: null,
            replay: true
        });
        if (winner) {
            setWinner(null);
        }
        setSquares(nextSquares);
    }, [setSquares, setWinner, sendJsonMessage, winner]);

    useEffect(() => {
        if (lastJsonMessage) {
            console.log(lastJsonMessage);
            if (lastJsonMessage.winner) {
                handlePlay(lastJsonMessage.board, lastJsonMessage.winner);
            }
        }
    }, [lastJsonMessage, handlePlay]);

    const handleBoardCustomisationSubmit = (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        const numberOfColumns = Number(formJson.numberOfColumns);
        const numberOfRows = Number(formJson.numberOfRows);
        const emptyBoard = new Array(numberOfColumns).fill(0).map(() => new Array(numberOfRows).fill("White"));

        setConnectNumber(Number(formJson.connectNumber));
        setGameCustomised(true);
        handleRefresh(emptyBoard);
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
        resetStatus = "Play"
    }

    return (
        <>
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
                <div className="resetButtonContainer">
                    <button className="reset" type="submit">{resetStatus}</button >
                </div >
            </form>
            {gameCustomised && < Game squares={squares} handlePlay={handlePlay} winner={winner} />}
        </>
    );
}
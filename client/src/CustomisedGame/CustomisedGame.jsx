import "./CustomisedGame.css";
import useWebSocket from "react-use-websocket";
import { useCallback, useState, useEffect } from "react";
import Game from "../Game/Game";

export default function CustomisedGame() {
    const [squares, setSquares] = useState(null);
    const [winner, setWinner] = useState(null);
    const [gameCustomised, setGameCustomised] = useState(false);

    const WS_URL = `ws://127.0.0.1:8080`;

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
        share: true,
    });

    const handlePlay = useCallback((nextSquares, nextWinner) => {
        setSquares(nextSquares);
        setWinner(nextWinner);
    }, [setSquares, setWinner]);

    useEffect(() => {
        if (lastJsonMessage) {
            handlePlay(lastJsonMessage.board, lastJsonMessage.winner);
            if (lastJsonMessage.gameCustomised) {
                setGameCustomised(true);
            }
        }
    }, [lastJsonMessage, handlePlay]);

    const handleBoardCustomisationSubmit = (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        sendJsonMessage({
            numberOfColumns: Number(formJson.numberOfColumns),
            numberOfRows: Number(formJson.numberOfRows),
            numberToConnect: Number(formJson.connectNumber)
        });
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
            {gameCustomised && < Game squares={squares} winner={winner} />}
        </>
    );
}
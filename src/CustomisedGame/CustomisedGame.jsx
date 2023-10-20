import "./CustomisedGame.css";
import { useState } from "react";
import Game from "../Game/Game";

export default function CustomisedGame() {
    const [connectNumber, setConnectNumber] = useState(null);
    const [squares, setSquares] = useState(null);
    const [winner, setWinner] = useState(null);
    const [gameCustomised, setGameCustomised] = useState(false);

    function handlePlay(nextSquares, nextWinner) {
        setSquares(nextSquares);
        setWinner(nextWinner);
    }

    function handleRefresh(nextSquares) {
        if (winner) {
            setWinner(null);
        }
        setSquares(nextSquares);
    }

    function handleBoardCustomisationSubmit(e) {
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
                <div className="resetButtonContainer">
                    <button className="reset" type="submit">{resetStatus}</button >
                </div >
            </form>
            {gameCustomised && < Game squares={squares} connectNumber={connectNumber} handlePlay={handlePlay} winner={winner} />}
        </>
    );
}
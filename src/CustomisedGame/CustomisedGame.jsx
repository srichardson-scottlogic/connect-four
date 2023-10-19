import "./CustomisedGame.css";
import { useState } from "react";
import Game from "../Game/Game";

export default function CustomisedGame() {
    const [numberOfColumns, setNumberOfColumns] = useState('7');
    const [numberOfRows, setNumberOfRows] = useState('6');
    const [connectNumber, setConnectNumber] = useState('4');
    const numberOfColumnsAsNumber = Number(numberOfColumns);
    const numberOfRowsAsNumber = Number(numberOfRows);
    const connectNumberAsNumber = Number(connectNumber);

    return (
        <>
            <div className="customiseGame">
                <label>
                    Number of Columns:
                    <input
                        value={numberOfColumns}
                        onChange={e => setNumberOfColumns(e.target.value)}
                        name="numberOfColumns"
                    />
                </label>
                <label>
                    Number of Rows:
                    <input
                        value={numberOfRows}
                        onChange={e => setNumberOfRows(e.target.value)}
                        name="numberofRows"
                    />
                </label>
                <label>
                    Number to Connect:
                    <input
                        value={connectNumber}
                        onChange={e => setConnectNumber(e.target.value)}
                        name="connectNumber"
                    />
                </label>
            </div>
            <Game numberOfColumns={numberOfColumnsAsNumber} numberOfRows={numberOfRowsAsNumber} connectNumber={connectNumberAsNumber} />
        </>
    );
}
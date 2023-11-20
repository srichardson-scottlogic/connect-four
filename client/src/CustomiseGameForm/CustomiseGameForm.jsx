import "./CustomiseGameForm.css"

export default function CustomiseGameForm({ numberOfColumns, setNumberOfColumns, numberOfRows, setNumberOfRows, numberToConnect, setNumberToConnect }) {
    return (
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
    );
}
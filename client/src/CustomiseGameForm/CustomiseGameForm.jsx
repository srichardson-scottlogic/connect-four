import "./CustomiseGameForm.css";
import { useState } from "react";

export default function CustomiseGameForm({
	numberOfColumns,
	setNumberOfColumns,
	numberOfRows,
	setNumberOfRows,
	numberToConnect,
	setNumberToConnect,
}) {
	const [errors, setErrors] = useState({});

	return (
		<div className="customiseGame">
			<div className="inputFieldContainer">
				<label className="inputLabel">Number of Columns:</label>
				<div className="inputField">
					<input
						name="numberOfColumns"
						value={numberOfColumns}
						onInput={(e) => setNumberOfColumns(Number(e.target.value))}
					/>
					<div className="error">{errors["numberOfColumns"]}</div>
				</div>
			</div>
			<div className="inputFieldContainer">
				<label className="inputLabel">Number of Rows:</label>
				<div className="inputField">
					<input
						name="numberOfRows"
						value={numberOfRows}
						onInput={(e) => setNumberOfRows(Number(e.target.value))}
					/>
					<div className="error">{errors["numberOfRows"]}</div>
				</div>
			</div>
			<div className="inputFieldContainer">
				<label className="inputLabel">Number to Connect:</label>
				<div className="inputField">
					<input
						name="connectNumber"
						value={numberToConnect}
						onInput={(e) => setNumberToConnect(Number(e.target.value))}
					/>
					<div className="error">{errors["numberToConnect"]}</div>
				</div>
			</div>
		</div>
	);
}

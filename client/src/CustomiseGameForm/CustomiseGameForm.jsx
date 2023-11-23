import "./CustomiseGameForm.css";

export default function CustomiseGameForm({
	numberOfColumns,
	setNumberOfColumns,
	numberOfRows,
	setNumberOfRows,
	numberToConnect,
	setNumberToConnect,
	customiseGameErrors,
	setCustomiseGameErrors,
}) {
	const validateBoardDimensions = (
		dimension,
		dimensionValue,
		messageForTooSmall,
	) => {
		const gameCustomisationErrors = { ...customiseGameErrors };

		if (!dimensionValue) {
			delete gameCustomisationErrors[dimension];
			setCustomiseGameErrors(gameCustomisationErrors);
			return true;
		}

		if (!dimensionValue.match(/^(\d+|L)$/)) {
			gameCustomisationErrors[dimension] = "please enter a positive number";
			setCustomiseGameErrors(gameCustomisationErrors);
			return false;
		}

		if (Number(dimensionValue) < 3) {
			gameCustomisationErrors[dimension] = messageForTooSmall;
			setCustomiseGameErrors(gameCustomisationErrors);
			return false;
		}

		delete gameCustomisationErrors[dimension];
		setCustomiseGameErrors(gameCustomisationErrors);
		return true;
	};

	return (
		<div className="customiseGame">
			<div className="inputFieldContainer">
				<label className="inputLabel">Number of Columns:</label>
				<div className="inputField">
					<input
						name="numberOfColumns"
						value={numberOfColumns}
						onInput={(e) => {
							setNumberOfColumns(e.target.value);
							validateBoardDimensions(
								"numberOfColumns",
								e.target.value,
								"the board would be too small!",
							);
						}}
					/>
					<div className="error">{customiseGameErrors["numberOfColumns"]}</div>
				</div>
			</div>
			<div className="inputFieldContainer">
				<label className="inputLabel">Number of Rows:</label>
				<div className="inputField">
					<input
						name="numberOfRows"
						value={numberOfRows}
						onInput={(e) => {
							setNumberOfRows(e.target.value);
							validateBoardDimensions(
								"numberOfRows",
								e.target.value,
								"the board would be too small!",
							);
						}}
					/>
					<div className="error">{customiseGameErrors["numberOfRows"]}</div>
				</div>
			</div>
			<div className="inputFieldContainer">
				<label className="inputLabel">Number to Connect:</label>
				<div className="inputField">
					<input
						name="connectNumber"
						value={numberToConnect}
						onInput={(e) => {
							setNumberToConnect(e.target.value);
							validateBoardDimensions(
								"numberToConnect",
								e.target.value,
								"that wouldn't be fair",
							);
						}}
					/>
					<div className="error">{customiseGameErrors["numberToConnect"]}</div>
				</div>
			</div>
		</div>
	);
}

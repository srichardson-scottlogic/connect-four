import "./GameInformation.css";
import copyIcon from ".././resources/copyIcon.png";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState } from "react";

export default function GameInformation({
	roomId,
	gameCustomised,
	redIsNext,
	playerColour,
	winner,
}) {
	const [copyStatus, setCopyStatus] = useState("Copy");

	let whoIsNext;
	if (
		(redIsNext && playerColour === "Red") ||
		(!redIsNext && playerColour === "Blue")
	) {
		whoIsNext = "it's your go!";
	} else whoIsNext = `it's ${redIsNext ? "red" : "blue"}'s go`;

	const onCopyClick = () => {
		setCopyStatus("Copied to clipboard!");
	};

	return (
		<div className="gameInfoContainer">
			{roomId && <div className="gameId">Game Room Code = {roomId}</div>}
			{roomId && !gameCustomised && (
				<>
					<div className="shareText">
						To play, share the game code with a friend
					</div>
					<div className="urlLink">
						<div className="urlText">
							Hover over me to see url
							<span className="tooltipText">{window.location.href}</span>
						</div>
						<div className="copy">
							<CopyToClipboard className="copyGame" text={window.location.href}>
								<button className="copyButton" onClick={onCopyClick}>
									<img
										src={copyIcon}
										className="copyIcon"
										alt="copy to clipboard"
									/>
								</button>
							</CopyToClipboard>
							<span className="tooltipText">{copyStatus}</span>
						</div>
					</div>
				</>
			)}
			{gameCustomised && playerColour && (
				<div className="playerColour">You are {playerColour}</div>
			)}
			{gameCustomised && !winner && (
				<div className="whoIsNext">{whoIsNext}</div>
			)}
		</div>
	);
}

import "./GameInformation.css";
import copyIcon from ".././resources/copyIcon.png";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function GameInformation({
	roomId,
	gameCustomised,
	redIsNext,
	playerColour,
	winner,
}) {
	let whoIsNext;
	if (
		(redIsNext && playerColour === "Red") ||
		(!redIsNext && playerColour === "Blue")
	) {
		whoIsNext = "It's Your Go!";
	} else whoIsNext = `It's ${redIsNext ? "Red" : "Blue"}'s Go!`;

	return (
		<div className="gameInfoContainer">
			{roomId && <div className="gameId">Game Room Code = {roomId}</div>}
			{roomId && !gameCustomised && (
				<>
					<div className="shareText">
						To play, share the game code with a friend
					</div>
					<div className="urlLink">
						<div className="urlText">{window.location.href}</div>
						<CopyToClipboard className="copyGame" text={window.location.href}>
							<button className="copyButton">
								<img
									src={copyIcon}
									className="copyIcon"
									alt="copy to clipboard"
								/>
							</button>
						</CopyToClipboard>
					</div>
				</>
			)}
			{gameCustomised && (
				<div className="playerColour">You are {playerColour}</div>
			)}
			{gameCustomised && !winner && (
				<div className="whoIsNext">{whoIsNext}</div>
			)}
		</div>
	);
}

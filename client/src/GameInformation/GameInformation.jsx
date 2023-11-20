import "./GameInformation.css";

export default function GameInformation({ roomId, gameCustomised, redIsNext, playerColour, winner }) {
    let whoIsNext;
    if ((redIsNext && playerColour === "Red")
        || (!redIsNext && playerColour === "Blue")) {
        whoIsNext = "It's Your Go!"
    }
    else whoIsNext = `It's ${redIsNext ? 'Red' : 'Blue'}'s Go!`;

    return (
        <div className="gameInfoContainer">
            {roomId && <div className="gameId">Game Room Code = {roomId}</div>}
            {(roomId && !gameCustomised) && < div className="shareText">To play, share the game code with a friend!</div>}
            {gameCustomised && <div className="playerColour">You are {playerColour}</div>}
            {(gameCustomised && !winner) && <div className="whoIsNext">{whoIsNext}</div>}
        </div>
    );
}
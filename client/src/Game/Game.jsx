import useWebSocket from "react-use-websocket";
import Board from "../Board/Board";

export default function Game({ squares, winner, roomId }) {

    console.log("Game customised"); //TODO: why is this being logged three (or six) times?

    const { sendJsonMessage } = useWebSocket(process.env.REACT_APP_WS_URL, {
        share: true,
    });

    const onPlay = (columnIndex, rowIndex) => {
        sendJsonMessage({
            action: "play",
            columnIndex: columnIndex,
            rowIndex: rowIndex
        });
    }
    return (
        <Board squares={squares} onPlay={onPlay} winner={winner} />
    );
}

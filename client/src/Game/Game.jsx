import useWebSocket from "react-use-websocket";
import Board from "../Board/Board";

export default function Game({ squares, winner }) {

    const { sendJsonMessage } = useWebSocket(process.env.REACT_APP_WS_URL, {
        share: true,
    });

    const onPlay = (columnIndex, rowIndex) => {
        sendJsonMessage({
            play: true,
            columnIndex: columnIndex,
            rowIndex: rowIndex
        });
    }
    return (
        <Board squares={squares} onPlay={onPlay} winner={winner} />
    );
}

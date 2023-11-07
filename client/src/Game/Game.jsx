import useWebSocket from "react-use-websocket";
import Board from "../Board/Board";

export default function Game({ squares, winner }) {
    const WS_URL = `ws://51.20.87.128:8080`;

    const { sendJsonMessage } = useWebSocket(WS_URL, {
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

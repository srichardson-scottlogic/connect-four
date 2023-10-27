import useWebSocket from "react-use-websocket";
import { useEffect } from 'react';
import Board from "../Board/Board";

export default function Game({ squares, handlePlay, winner }) {
    const WS_URL = `ws://192.168.1.168:8080`;

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
        share: true,
    });

    useEffect(() => {
        if (lastJsonMessage) {
            handlePlay(lastJsonMessage.board, lastJsonMessage.winner);
        }
    }, [lastJsonMessage, handlePlay]);

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

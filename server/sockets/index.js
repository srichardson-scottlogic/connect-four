import { WebSocketServer } from "ws";
import { v4 } from "uuid";
import winnerHelper from "../helpers/winnerHelper.js";
import roomIdHelper from "../helpers/roomIdHelper.js";

const port = 8080;
const wsServer = new WebSocketServer({ port: { port } });
const connections = {};
const users = {};

const maxClients = 2;
const rooms = {};

let isRedNext = true;
let numberToConnect;
let board;

const handleMessage = (bytes) => {
    const message = JSON.parse(bytes.toString());
    const action = message.action;

    switch (action) {
        case "create":

            break;

        case "customise":
            numberToConnect = message.numberToConnect;
            board = new Array(message.numberOfColumns).fill(0).map(() => new Array(message.numberOfRows).fill("White"));
            broadcast(null, true);
            break;

        case "play":
            const columnIndex = message.columnIndex;
            const rowIndex = message.rowIndex;

            board[columnIndex][rowIndex] = isRedNext ? "Blue" : "Red";
            isRedNext = !isRedNext;
            const winner = winnerHelper.calculateWinner(board, columnIndex, rowIndex, numberToConnect);
            broadcast(winner, null);
            break;

        default:
            console.warn(`Type: ${type} unknown`);
            break;
    }
}

const handleClose = uuid => {
    console.log(`${users[uuid].state.colour} disconnected`);

    delete connections[uuid];
    delete users[uuid];
}

const createRoom = () => {
    const roomId = roomIdHelper.genId(5);
}

const broadcast = (winner, gameCustomised) => {
    Object.keys(connections)
        .forEach(uuid => {
            const connection = connections[uuid];
            const message = JSON.stringify({
                board: board,
                isRedNext: isRedNext,
                winner: winner,
                gameCustomised: gameCustomised
            });
            console.log(`Broadcasting to user ${uuid}`);
            connection.send(message);
        })
}

wsServer.on('connection', (connection) => {
    const playerColour = isRedNext ? "Red" : "Blue";
    isRedNext = !isRedNext;

    console.log(`${playerColour} connected`);

    const uuid = v4();
    connections[uuid] = connection;

    users[uuid] = {
        state: {
            colour: playerColour
        }
    };

    broadcast();

    connection.on('message', message => handleMessage(message));
    connection.on('close', () => handleClose(uuid));
});

console.log(`WebSocket server is running on port ${port}`);

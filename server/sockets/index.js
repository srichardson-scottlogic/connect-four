import { WebSocketServer } from "ws";
import { v4 } from "uuid";
import winnerHelper from "../helpers/winnerHelper.js";
import roomIdHelper from "../helpers/roomIdHelper.js";

const port = 8080;
const wsServer = new WebSocketServer({ port: { port } });
const connections = {};
const users = {};
const rooms = {};
const maxPlayers = 2;

const handleMessage = (bytes, userId) => {
    const message = JSON.parse(bytes.toString());
    const action = message.action;

    switch (action) {
        case "create":
            const roomId = createRoom(userId, message.numberOfColumns, message.numberOfRows, message.numberToConnect);
            broadcast("create", roomId);
            break;

        case "join":
            joinRoom(message.roomId, userId);
            broadcast("join", message.roomId);
            break;

        case "customise":
            customiseRoom(userId, message.numberToConnect, message.numberOfColumns, message.numberOfRows);
            broadcast("customise", users[userId].roomId);
            break;

        case "play":
            handlePlay(userId, message.columnIndex, message.rowIndex);
            broadcast("play", users[userId].roomId);
            break;

        default:
            console.warn(`Type: ${type} unknown`);
            break;
    }
}

const handleClose = userId => {
    const roomId = users[userId].roomId;
    const indexOfUserInRoomUsers = rooms[roomId].users.indexOf(userId);
    rooms[roomId].users.splice(indexOfUserInRoomUsers, indexOfUserInRoomUsers);

    delete connections[userId];
    delete users[userId];

    console.log(`${userId} disconnected`);
}

const createRoom = (userId, numberOfColumns, numberOfRows, numberToConnect) => {
    const roomId = roomIdHelper.genId(5);
    rooms[roomId] = {
        users: [userId],
        board: new Array(numberOfColumns).fill(0).map(() => new Array(numberOfRows).fill("White")),
        numberToConnect: numberToConnect,
        winner: null,
        redIsNext: true
    };
    users[userId] = {
        roomId: roomId,
        colour: "Red"
    };
    return roomId;
}

const joinRoom = (roomId, userId) => {
    if (!Object.keys(rooms).includes(roomId)) {
        console.warn(`Room ${roomId} does not exist!`);
        return;
    }

    if (rooms[roomId].length >= maxPlayers) {
        console.warn(`Room ${roomId} is full!`);
        return;
    }

    rooms[roomId].users.push(userId);
    users[userId] = {
        roomId: roomId,
        colour: "Blue"
    };
}

const customiseRoom = (userId, numberToConnect, numberOfColumns, numberOfRows) => {
    const room = rooms[users[userId].roomId];
    room.board = new Array(numberOfColumns).fill(0).map(() => new Array(numberOfRows).fill("White"));
    room.numberToConnect = numberToConnect;
    room.winner = null;
}

const handlePlay = (userId, columnIndex, rowIndex) => {
    const room = rooms[users[userId].roomId];
    const playerColour = users[userId].colour;
    if ((room.redIsNext && playerColour === "Red")
        || (!room.redIsNext && playerColour === "Blue")) {
        room.board[columnIndex][rowIndex] = room.redIsNext ? "Red" : "Blue";
        room.redIsNext = !room.redIsNext;
        room.winner = winnerHelper.calculateWinner(room.board, columnIndex, rowIndex, room.numberToConnect);
    }
    else console.warn(`It is not ${playerColour}'s turn!`);
}

const broadcast = (action, roomId) => {
    const room = rooms[roomId];
    room.users.forEach(userId => {
        const connection = connections[userId];
        const message = {
            roomId: roomId,
            board: room.board,
            redIsNext: room.redIsNext,
            winner: room.winner,
            action: action
        };
        if (action === "join") {
            message.playerColour = users[userId].colour;
        }
        console.log(`Broadcasting to user ${userId} in room ${roomId}`);
        connection.send(JSON.stringify(message));
    })
}

wsServer.on('connection', (connection) => {
    const userId = v4();
    connections[userId] = connection;

    console.log(`${userId} connected`);

    connection.on('message', message => handleMessage(message, userId));
    connection.on('close', () => handleClose(userId));
});

console.log(`WebSocket server is running on port ${port}`);

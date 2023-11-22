import { WebSocketServer } from "ws";
import { v4, validate } from "uuid";
import winnerHelper from "../helpers/winnerHelper.js";
import roomIdHelper from "../helpers/roomIdHelper.js";
import roomIdValidator from "./validation/roomIdValidator.js";

const port = 8080;
const wsServer = new WebSocketServer({ port: { port } });
const connections = {};
const roomUsers = {};
const rooms = {};
const maxPlayers = 2;

const handleMessage = (bytes, userId) => {
	const message = JSON.parse(bytes.toString());
	const action = message.action;

	switch (action) {
		case "create":
			const roomId = createRoom(
				userId,
				message.numberOfColumns,
				message.numberOfRows,
				message.numberToConnect,
			);
			broadcastToRoom("create", roomId);
			break;

		case "join":
			const errors = roomIdValidator.validate(
				rooms,
				message.roomId,
				maxPlayers,
			);
			if (errors) {
				errors["action"] = "roomIdError";
				broadcastErrorToUser(userId, errors);
				break;
			}
			joinRoom(message.roomId, userId);
			broadcastToRoom("join", message.roomId);
			break;

		case "customise":
			customiseRoom(
				userId,
				message.numberToConnect,
				message.numberOfColumns,
				message.numberOfRows,
			);
			broadcastToRoom("customise", roomUsers[userId].roomId);
			break;

		case "play":
			handlePlay(userId, message.columnIndex, message.rowIndex);
			broadcastToRoom("play", roomUsers[userId].roomId);
			break;

		default:
			console.warn(`Type: ${type} unknown`);
			break;
	}
};

const handleClose = (userId) => {
	if (roomUsers[userId]) {
		const roomId = roomUsers[userId].roomId;
		const usersInRoom = [...rooms[roomId].roomUsers];

		const remainingUsersInRoom = usersInRoom.filter((uuid) => {
			return uuid !== userId;
		});
		if (remainingUsersInRoom.length === 0) {
			delete rooms[roomId];
		} else rooms[roomId].roomUsers = remainingUsersInRoom;
	}

	delete connections[userId];
	delete roomUsers[userId];

	console.log(`${userId} disconnected`);
};

const createRoom = (userId, numberOfColumns, numberOfRows, numberToConnect) => {
	const roomId = roomIdHelper.genId(5);
	rooms[roomId] = {
		roomUsers: [userId],
		board: new Array(numberOfColumns)
			.fill(0)
			.map(() => new Array(numberOfRows).fill("White")),
		numberToConnect: numberToConnect,
		winner: null,
		redIsNext: true,
	};
	roomUsers[userId] = {
		roomId: roomId,
		colour: "Red",
	};
	return roomId;
};

const joinRoom = (roomId, userId) => {
	const room = rooms[roomId];

	room.roomUsers.push(userId);
	roomUsers[userId] = {
		roomId: roomId,
		colour: "Blue",
	};
};

const customiseRoom = (
	userId,
	numberToConnect,
	numberOfColumns,
	numberOfRows,
) => {
	const room = rooms[roomUsers[userId].roomId];
	room.board = new Array(numberOfColumns)
		.fill(0)
		.map(() => new Array(numberOfRows).fill("White"));
	room.numberToConnect = numberToConnect;
	room.winner = null;
};

const handlePlay = (userId, columnIndex, rowIndex) => {
	const room = rooms[roomUsers[userId].roomId];
	const playerColour = roomUsers[userId].colour;
	if (
		(room.redIsNext && playerColour === "Red") ||
		(!room.redIsNext && playerColour === "Blue")
	) {
		room.board[columnIndex][rowIndex] = room.redIsNext ? "Red" : "Blue";
		room.redIsNext = !room.redIsNext;
		room.winner = winnerHelper.calculateWinner(
			room.board,
			columnIndex,
			rowIndex,
			room.numberToConnect,
		);
	} else console.warn(`It is not ${playerColour}'s turn!`);
};

const broadcastToRoom = (action, roomId) => {
	const room = rooms[roomId];
	room.roomUsers.forEach((userId) => {
		const connection = connections[userId];
		const message = {
			roomId: roomId,
			board: room.board,
			redIsNext: room.redIsNext,
			winner: room.winner,
			action: action,
		};
		if (action === "join") {
			message.playerColour = roomUsers[userId].colour;
		}
		console.log(`Broadcasting to user ${userId} in room ${roomId}`);
		connection.send(JSON.stringify(message));
	});
};

const broadcastErrorToUser = (userId, message) => {
	const connection = connections[userId];
	console.log(`Broadcasting to user ${userId}`);
	connection.send(JSON.stringify(message));
};

wsServer.on("connection", (connection) => {
	const userId = v4();
	connections[userId] = connection;

	console.log(`${userId} connected`);

	connection.on("message", (message) => handleMessage(message, userId));
	connection.on("close", () => handleClose(userId));
});

console.log(`WebSocket server is running on port ${port}`);

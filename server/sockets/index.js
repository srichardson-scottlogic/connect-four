import { WebSocketServer } from "ws";
import { v4 } from "uuid";
import roomIdHelper from "../helpers/roomIdHelper.js";
import roomIdValidator from "./validation/roomIdValidator.js";
import computerMoveHelper from "../helpers/computerMoveHelper.js";
import playHelper from "../helpers/playHelper.js";

const port = 8080;
const wsServer = new WebSocketServer({ port: { port } });
const connections = {};
const roomUsers = {};
const rooms = {};
const computerGames = {};
const maxPlayers = 2;

const handleMessage = (bytes, userId) => {
	const message = JSON.parse(bytes.toString());
	const action = message.action;

	switch (action) {
		case "createOnline":
			const roomId = createRoom(
				userId,
				message.numberOfColumns,
				message.numberOfRows,
				message.numberToConnect,
			);
			broadcastToRoom("create", roomId);
			break;

		case "createComputer":
			const computerRoomId = createComputerGame(
				userId,
				message.numberOfColumns,
				message.numberOfRows,
				message.numberToConnect,
			);
			broadcastComputerGameToUser(
				userId,
				computerGames[computerRoomId],
				"join",
			);
			break;

		case "join":
			const errors = roomIdValidator.validate(
				rooms,
				message.roomId,
				maxPlayers,
			);
			if (errors) {
				errors["action"] = "roomIdError";
				broadcastToUser(userId, errors);
				break;
			}
			joinRoom(message.roomId, userId);
			broadcastToRoom("join", message.roomId);
			break;

		case "customiseComputer":
			const customisedBoard = customiseRoom(
				userId,
				message.numberToConnect,
				message.numberOfColumns,
				message.numberOfRows,
			);

			broadcastComputerGameToUser(userId, customisedBoard, "customise");

			//If it's the computer's go then it makes a move
			const computerGameId = roomUsers[userId].computerGameId;
			const computerGame = computerGames[computerGameId];
			if (
				!playHelper.itIsPlayersGo(
					computerGame.redIsNext,
					roomUsers[userId].colour,
				)
			) {
				makeComputerMove(userId);
			}

			break;

		case "customiseOnline":
			const customisedRoom = customiseRoom(
				userId,
				message.numberToConnect,
				message.numberOfColumns,
				message.numberOfRows,
			);

			//Inform the other room user that the board has been customised
			if (customisedRoom.roomUsers.length > 1) {
				const otherPlayer = customisedRoom.roomUsers.filter(
					(user) => user !== userId,
				);
				const userMessage = {
					action: "customiseFromOtherPlayer",
					numberToConnect: message.numberToConnect,
					numberOfColumns: message.numberOfColumns,
					numberOfRows: message.numberOfRows,
				};

				broadcastToUser(otherPlayer, userMessage);
			}

			broadcastToRoom("customise", roomUsers[userId].roomId);
			break;

		case "play":
			handlePlay(userId, message.columnIndex, message.rowIndex);
			break;

		default:
			console.warn(`Type: ${type} unknown`);
			break;
	}
};

const handleClose = (userId) => {
	if (roomUsers[userId]) {
		if (roomUsers[userId].roomId) {
			const roomId = roomUsers[userId].roomId;
			const usersInRoom = [...rooms[roomId].roomUsers];

			const remainingUsersInRoom = usersInRoom.filter((uuid) => {
				return uuid !== userId;
			});
			if (remainingUsersInRoom.length === 0) {
				delete rooms[roomId];
			} else rooms[roomId].roomUsers = remainingUsersInRoom;
		}
		if (roomUsers[userId].computerGameId) {
			delete computerGames[roomUsers[userId].computerGameId];
		}
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

	let colour;
	if (room.roomUsers.length > 0) {
		colour = roomUsers[room.roomUsers[0]].colour === "Red" ? "Blue" : "Red";
	} else colour = "Red";

	room.roomUsers.push(userId);
	roomUsers[userId] = {
		roomId: roomId,
		colour: colour,
	};
};

const customiseRoom = (
	userId,
	numberToConnect,
	numberOfColumns,
	numberOfRows,
) => {
	if (roomUsers[userId].computerGameId) {
		computerGames[roomUsers[userId].computerGameId] = handleCustomisation(
			computerGames[roomUsers[userId].computerGameId],
			numberOfColumns,
			numberOfRows,
			numberToConnect,
		);
		return computerGames[roomUsers[userId].computerGameId];
	}
	rooms[roomUsers[userId].roomId] = handleCustomisation(
		rooms[roomUsers[userId].roomId],
		numberOfColumns,
		numberOfRows,
		numberToConnect,
	);
	return rooms[roomUsers[userId].roomId];
};

const createComputerGame = (
	userId,
	numberOfColumns,
	numberOfRows,
	numberToConnect,
) => {
	const computerGameId = roomIdHelper.genId(5);
	computerGames[computerGameId] = {
		board: new Array(numberOfColumns)
			.fill(0)
			.map(() => new Array(numberOfRows).fill("White")),
		numberToConnect: numberToConnect,
		winner: null,
		redIsNext: true,
	};
	roomUsers[userId] = {
		computerGameId: computerGameId,
		colour: "Red",
	};
	return computerGameId;
};

const handlePlay = (userId, columnIndex, rowIndex) => {
	const playerColour = roomUsers[userId].colour;
	const roomId = roomUsers[userId].roomId;

	if (roomUsers[userId].computerGameId) {
		handleComputerPlay(userId, playerColour, columnIndex, rowIndex);
		return;
	}

	rooms[roomId] = playHelper.setCurrentMove(
		rooms[roomId],
		playerColour,
		columnIndex,
		rowIndex,
	);
	broadcastToRoom("play", roomId);
};

const handleComputerPlay = (userId, playerColour, columnIndex, rowIndex) => {
	const computerGameId = roomUsers[userId].computerGameId;
	const computerGame = computerGames[computerGameId];

	if (playHelper.itIsPlayersGo(computerGame.redIsNext, playerColour)) {
		computerGames[computerGameId] = playHelper.setCurrentMove(
			computerGame,
			playerColour,
			columnIndex,
			rowIndex,
		);
		broadcastComputerGameToUser(userId, computerGames[computerGameId], "play");
	}

	if (!computerGame.winner) {
		makeComputerMove(userId);
	}
};

const makeComputerMove = (userId) => {
	computerGames[roomUsers[userId].computerGameId] =
		computerMoveHelper.calculateComputerMove(
			computerGames[roomUsers[userId].computerGameId],
		);
	setTimeout(function () {
		broadcastComputerGameToUser(
			userId,
			computerGames[roomUsers[userId].computerGameId],
			"play",
		);
	}, 1000);
};

const handleCustomisation = (
	room,
	numberOfColumns,
	numberOfRows,
	numberToConnect,
) => {
	room.board = new Array(numberOfColumns)
		.fill(0)
		.map(() => new Array(numberOfRows).fill("White"));
	room.numberToConnect = numberToConnect;
	room.winner = null;
	return room;
};

const broadcastToRoom = (action, roomId) => {
	const room = rooms[roomId];
	room.roomUsers.forEach((userId) => {
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
		broadcastToUser(userId, message);
	});
};

const broadcastComputerGameToUser = (userId, computerGame, action) => {
	const message = {
		board: computerGame.board,
		redIsNext: computerGame.redIsNext,
		winner: computerGame.winner,
		action: action,
	};
	if (action === "join") {
		message.playerColour = roomUsers[userId].colour;
	}
	broadcastToUser(userId, message);
};

const broadcastToUser = (userId, message) => {
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

const validate = (rooms, roomId, maxPlayers) => {
	const errors = {};

	if (!Object.keys(rooms).includes(roomId)) {
		console.warn(`Room ${roomId} does not exist!`);
		errors["roomId"] = "game room does not exist";
		return errors;
	}

	const room = rooms[roomId];

	if (room.roomUsers.length >= maxPlayers) {
		console.warn(`Room ${roomId} is full!`);
		errors["roomId"] = "sorry, that game is full";
		return errors;
	}

	return null;
};

export default { validate };

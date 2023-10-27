import { WebSocketServer } from "ws";
import { v4 } from "uuid";

const port = 8080;
const wsServer = new WebSocketServer({ port: { port } });

const connections = {};
const users = {};
let isRedNext = true;
let board = new Array(7).fill(0).map(() => new Array(6).fill("White"));

const handleMessage = (bytes) => {
    const message = JSON.parse(bytes.toString());
    if (message.play) {
        console.log("Play");

        const columnIndex = message.columnIndex;
        const rowIndex = message.rowIndex;

        board[columnIndex][rowIndex] = isRedNext ? "Blue" : "Red";
        isRedNext = !isRedNext;
        const winner = calculateWinner(board, columnIndex, rowIndex, 4);
        broadcast(winner);
    }

    if (message.replay) {
        console.log("Resetting play");
        board = new Array(7).fill(0).map(() => new Array(6).fill("White"));
        broadcast();
    }
}

const handleClose = uuid => {
    console.log(`${users[uuid].state.colour} disconnected`);

    delete connections[uuid];
    delete users[uuid];

    board = new Array(7).fill(0).map(() => new Array(6).fill("White"));
    broadcast();
}

const broadcast = (winner) => {
    Object.keys(connections)
        .forEach(uuid => {
            const connection = connections[uuid];
            const message = JSON.stringify({
                board: board,
                isRedNext: isRedNext,
                winner: winner
            });
            console.log(`Broadcasting to user ${uuid}:`);
            connection.send(message);
        })
}

wsServer.on('connection', (connection, request) => {
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

const calculateWinner = (squares, columnIndex, rowIndex, connectNumber) => {
    const colour = squares[columnIndex][rowIndex];
    const width = squares.length;
    const height = squares[0].length;

    const countUpColour = (column, row, count) => {
        if (squares[column][row] === colour) {
            count += 1;
        }
        else {
            count = 0;
        }
        return count;
    }

    //Calculate if horiztonal winner
    const horizontalNumberToSubtract = Math.min(columnIndex, connectNumber - 1);
    let count = 0;
    let i = columnIndex - horizontalNumberToSubtract;
    for (i; i < width; i++) {
        count = countUpColour(i, rowIndex, count);
        if (count === connectNumber) {
            return colour;
        }
    }

    //Calculate if vertical winner
    const verticalNumberToSubtract = Math.min(rowIndex, connectNumber - 1);
    count = 0;
    i = rowIndex - verticalNumberToSubtract;
    for (i; i < height; i++) {
        count = countUpColour(columnIndex, i, count);
        if (count === connectNumber) {
            return colour;
        }
    }

    //Calculate if positive diagonal winner
    const positiveDiagonalNumberToSubtract = Math.min(Math.min(columnIndex, rowIndex), connectNumber - 1);
    count = 0;
    i = columnIndex - positiveDiagonalNumberToSubtract;
    let j = rowIndex - positiveDiagonalNumberToSubtract;
    while (i < width && j < height) {
        count = countUpColour(i, j, count);
        if (count === connectNumber) {
            return colour;
        }
        i++;
        j++;
    }

    //Calculate if negative diagonal winner
    const negativeDiagonalNumberToSubtract = Math.min(Math.min(((width - 1) - columnIndex), rowIndex), connectNumber - 1);
    count = 0;
    i = columnIndex + negativeDiagonalNumberToSubtract;
    j = rowIndex - negativeDiagonalNumberToSubtract;
    while (i >= 0 && j < height) {
        count = countUpColour(i, j, count);
        if (count === connectNumber) {
            return colour;
        }
        i--;
        j++;
    }

    //Calculate if it's a draw
    if (rowIndex === height - 1) {
        for (let i = 0; i < width; i++) {
            if (squares[i][rowIndex] === 'White') {
                return null;
            }
        }
        return 'Draw';
    }

    //If there's no winner return null
    return null;
}

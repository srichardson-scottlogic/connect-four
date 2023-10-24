import { WebSocketServer } from "ws";
import { URLSearchParams } from "url";

const port = 8080;
const wsServer = new WebSocketServer({ port: { port } });

const connections = {};
const users = {};

const handleMessage = (bytes, playerColour) => {
    const message = JSON.parse(bytes.toString());
    users[playerColour].state = message;
    broadcast()

    console.log(
        `${playerColour} updated their state: ${JSON.stringify(
            users[playerColour].state,
        )}`
    );
}

const handleClose = playerColour => {
    delete connections[playerColour]
    delete users[playerColour]
    broadcast()

    console.log(`${playerColour} disconnected`)
}

const broadcast = () => {
    Object.keys(connections)
        .forEach(playerColour => {
            const connection = connections[playerColour]
            const message = JSON.stringify(users)
            connection.send(message)
        })
}

wsServer.on('connection', (connection, request) => {
    const params = new URLSearchParams(request.url.slice(1)); //TODO: Improve this
    const playerColour = params.get("playerColour");
    console.log(`${playerColour} connected`);

    connections[playerColour] = connection;
    users[playerColour] = {
        state: {}
    };
    connection.on('message', message => handleMessage(message, playerColour));
    connection.on('close', () => handleClose(playerColour));
});


console.log(`WebSocket server is running on port ${port}`);

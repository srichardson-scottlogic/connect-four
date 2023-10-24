import http from "http";

const server = http.createServer();
const port = 8080;

server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`);
});
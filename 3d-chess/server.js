import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let clients = [];

wss.on('connection', function connection(ws) {
    clients.push(ws);

    console.log('Client connected');

    ws.on('message', function incoming(message) {
        console.log(`Received message: ${message}`);
        ws.send(`"Hi from server ${clients.indexOf(ws)} ` );

    });

    ws.on('close', function close() {
        console.log('Client disconnected');

        // Remove the client from the array of connected clients
        clients = clients.filter(function(client) {
            return client !== ws;
        });
    });
});

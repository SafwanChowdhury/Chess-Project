import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let clients = [];
let rooms = {};

wss.on('connection', function connection(ws) {
    clients.push(ws);

    ws.on('message', function(event) {
        const message = JSON.parse(event.data);

        switch (message.type) {
            case 'join':
                const room = message.room;

                if (!rooms[room]) {
                    rooms[room] = [];
                }

                rooms[room].push(ws);
                console.log(`Client ${clients.indexOf(ws)} connected to lobby ${room}`);
                break;

            case 'loaded':
                // Your existing 'loaded' case logic
                break;

            case 'action':
                // Your existing 'action' case logic
                break;
        }
    });

    ws.on('close', function close() {
        console.log('Client disconnected');

        // Remove the client from the array of connected clients
        clients = clients.filter(function(client) {
            return client !== ws;
        });

        // Remove the client from rooms
        for (const room in rooms) {
            rooms[room] = rooms[room].filter(function(client) {
                return client !== ws;
            });
        }
    });
});
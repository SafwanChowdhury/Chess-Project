import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let clients = [];
let rooms = {};
let once = 0;
let counter = 0

wss.on('connection', function connection(ws) {
    clients.push(ws);

    ws.on('message', function(event) {
        const message = JSON.parse(event);

        switch (message.type) {
            case 'join':
                const room = message.room;

                if (!rooms[room]) {
                    rooms[room] = [];
                }

                if (rooms[room].length < 2) {
                    rooms[room].push(ws);
                    console.log(`Client ${clients.indexOf(ws)} connected to lobby ${room}`);
                } else {
                    console.log(`Lobby ${room} is full, cannot join.`);
                }
                break;

            case 'create':
                const newRoomName = message.roomName;
                if (!rooms[newRoomName]) {
                    rooms[newRoomName] = [];
                    console.log(`Lobby ${newRoomName} created.`);
                } else {
                    console.log(`Lobby ${newRoomName} already exists.`);
                }
                break;

            case 'refresh':
                const roomList = Object.keys(rooms).map(room => ({
                    name: room,
                    players: rooms[room].length
                }));
                ws.send(JSON.stringify({ type: 'roomList', rooms: roomList }));
                break;

            case 'loaded':
                const rejoinRoom = message.room;
                ws.send(JSON.stringify({ type: 'clientIndex', index: rooms[rejoinRoom].indexOf(ws) }));
                break;

            case 'action':
                const actionRoom = message.room;
                const actionData = message.data;
                if (rooms[actionRoom]) {
                    rooms[actionRoom].forEach(client => {
                        if (client !== ws) {
                            client.send(JSON.stringify({
                                type: 'action',
                                data: actionData
                            }));
                        }
                    });
                }
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

import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let clients = [];
let rooms = {};

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
                    console.log(`Client ${clients.indexOf(ws)} connected to room ${room}`);
                } else {
                    console.log(`Room ${room} is full, cannot join.`);
                }
                break;

            case 'create':
                const newRoomName = message.roomName;
                if (!rooms[newRoomName]) {
                    rooms[newRoomName] = [];
                    console.log(`Room ${newRoomName} created.`);
                } else {
                    console.log(`Room ${newRoomName} already exists.`);
                }
                break;

            case 'delete':
                const existingRoomName = message.roomName;
                if (rooms[existingRoomName]) {
                    delete rooms[existingRoomName];
                    console.log(`Room ${existingRoomName} deleted.`);
                }
                break;

            case 'chat':
                const chatRoom = message.room;
                const chatMessage = message.message;
                if (rooms[chatRoom]) {
                    rooms[chatRoom].forEach(client => {
                        if (client !== ws) {
                            client.send(JSON.stringify({
                                type: 'chat',
                                message: chatMessage
                            }));
                        }
                    });
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
            if (rooms[room].includes(ws)) {
                rooms[room] = rooms[room].filter(function(client) {
                    return client !== ws;
                });

                if (rooms[room].length === 0) {
                    delete rooms[room];
                    console.log(`Room ${room} closed.`);
                } else if (rooms[room].length === 1) {
                    const partner = rooms[room][0];
                    partner.send(JSON.stringify({
                        type: 'partnerDisconnected'
                    }));
                }
            }
        }
    });
});

setInterval(function() {
    for (const room in rooms) {
        if (rooms[room].length === 0) {
            delete rooms[room];
            console.log(`Room ${room} closed.`);
    }
}, 60000)}; // Close empty rooms after 1 minute

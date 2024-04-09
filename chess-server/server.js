const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

const httpsOptions = {
  cert: fs.readFileSync('/home/bitnami/certs/fullchain.pem'),
  key: fs.readFileSync('/home/bitnami/certs/privkey.pem')
};

const server = https.createServer(httpsOptions);
const wss = new WebSocket.Server({ server });

server.listen(443);

let clients = [];
let rooms = {};

console.log("Server started on port 443");
wss.on("connection", function connection(ws) {
	clients.push(ws);

	ws.on("message", function(event) {
		const message = JSON.parse(event);

		switch (message.type) {
		case "join":
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
			if (rooms[room].length === 2) {
				console.log(rooms[room].length);
				rooms[room].forEach(client => {
					client.send(JSON.stringify({ type: "start" }));
				});
			}
			break;

		case "create":
			const newRoomName = message.roomName;
			if (!rooms[newRoomName]) {
				rooms[newRoomName] = [];
				console.log(`Lobby ${newRoomName} created.`);
			} else {
				console.log(`Lobby ${newRoomName} already exists.`);
			}
			break;

		case "delete":
			const existingRoomName = message.roomName;
			if (rooms[existingRoomName]) {
				delete rooms[existingRoomName];
				console.log(`Lobby ${existingRoomName} deleted.`);
			  }
			break;

		case "refresh":
			const roomList = Object.keys(rooms).map(room => ({
				name: room,
				players: rooms[room].length
			}));
			ws.send(JSON.stringify({ type: "roomList", rooms: roomList }));
			break;

		case "loaded":
			const rejoinRoom = message.room;
			ws.send(JSON.stringify({ type: "clientIndex", index: rooms[rejoinRoom].indexOf(ws) }));
			break;

		case "action":
			const actionRoom = message.room;
			const actionData = message.data;
			console.log(actionData);
			if (rooms[actionRoom]) {
				rooms[actionRoom].forEach(client => {
					if (client !== ws) {
						client.send(JSON.stringify({
							type: "action",
							data: actionData
						}));
					}
				});
			}
			break;
		}
	});

	ws.on("close", function close() {
		console.log("Client disconnected");

		// Remove the client from the array of connected clients
		clients = clients.filter(function(client) {
			return client !== ws;
		});

		// Remove the client from rooms and send a disconnect message to the partner
		for (const room in rooms) {
			const roomIndex = rooms[room].indexOf(ws);
			if (roomIndex !== -1) {
				// Send a disconnect message to the remaining clients in the room
				rooms[room].forEach(client => {
					if (client !== ws) {
						client.send(JSON.stringify({ type: "disconnect" }));
					}
				});

				// Remove the disconnected client from the room
				rooms[room].splice(roomIndex, 1);
			}
		}
	});
});
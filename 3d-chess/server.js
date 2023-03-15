import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let clients = [];

let once = 0;
let counter = 0
wss.on('connection', function connection(ws) {
    clients.push(ws);

    console.log('Client connected');


    ws.onmessage = function(event) {
        if (event.data === 'loaded'){
            counter++
            console.log("loaded", counter)
        }
        if (counter === 2){
            clients.forEach(function(client) {
                client.send(clients.indexOf(client));
            });
            counter++
        }
        else if (counter > 2) {
            once = 1;
            const jsonString = event.data;
            const array = JSON.parse(jsonString);
            console.log(array)
            const jsonString2 = JSON.stringify(array);
            if (once !== 0) {
                clients[array[2] ? 0 : 1].send(jsonString2);
                once = 0
            }

        }
    }

    ws.on('close', function close() {
        console.log('Client disconnected');

        // Remove the client from the array of connected clients
        clients = clients.filter(function(client) {
            return client !== ws;
        });
    });
});
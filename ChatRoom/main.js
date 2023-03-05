// server.js

// Import modules
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

// Create an express app
const app = express();

// Create a http server
const server = http.createServer(app);

// Create a socket.io instance
const io = socketio(server);

// Listen for connection events from clients
io.on('connection', (socket) => {
    // Log the connection
    console.log(`New connection: ${socket.id}`);

    // Join a room based on query parameter
    const room = socket.handshake.query.room;
    socket.join(room);

    // Emit a welcome message to the client
    socket.emit('message', 'Welcome to the chat room!');

    // Broadcast a message to other clients in the same room when a new user joins
    socket.broadcast.to(room).emit('message', `A new user has joined the chat`);

    // Listen for chatMessage events from clients
    socket.on('chatMessage', (msg) => {
        // Emit the message to all clients in the same room
        io.to(room).emit('message', msg);
    });

    // Listen for disconnect events from clients
    socket.on('disconnect', () => {
        // Log the disconnection
        console.log(`User disconnected: ${socket.id}`);

        // Broadcast a message to other clients in the same room when a user leaves
        io.to(room).emit('message', `A user has left the chat`);
    });
});

// Define a port number
const PORT = process.env.PORT || 3000;

// Start listening on the port number
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const { Server } = require('socket.io');
const express = require('express');
const { createServer } = require('http');



const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})


const users = {}

io.on('connection', (socket) => {

    socket.on('user connected', (newLoginUser) => {
        console.log(socket.id);
        users[newLoginUser] = socket.id;
    });

    // Private message event
    socket.on('private-message', ({ message, to, sender }) => {
        let targetSocketId = users[to];
        console.log(message);
        if (targetSocketId) {
            io.to(targetSocketId).emit('check', { sender, message });
        }
    });
});




module.exports = { app, io, server, express };
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
        let { userName } = newLoginUser
        users[userName] = socket.id;
        console.log(socket.id);
    });

    // Private message event
    socket.on('personal-chat', ({ message, to, sender }) => {
        let targetSocketId = users[to];
        console.log(message);
        console.log(to);
        console.log(sender);
        console.log(targetSocketId);
        // if (targetSocketId) {
        io.to(targetSocketId).emit('personal-chat', { sender, message, to });
        // }
    });
});




module.exports = { app, io, server, express };
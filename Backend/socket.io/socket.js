const { Server } = require('socket.io');
const express = require('express');
const { createServer } = require('http');



const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'//set frontend server url over here to get requests and responses
    }
})


const users = {}
// implement or setup io connection for first time 
io.on('connection', (socket) => {
//get event from front end when uesr is connected
    socket.on('user connected', (newLoginUser) => {
        users[newLoginUser] = socket.id;
        console.log(newLoginUser);
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
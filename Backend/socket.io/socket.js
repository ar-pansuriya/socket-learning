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
const onlineuserList = [];
// implement or setup io connection for first time 
io.on('connection', (socket) => {
    //get event from front end when uesr is connected
    socket.on('user connected', (newLoginUser) => {
        users[newLoginUser] = socket.id;
        console.log(newLoginUser);
        console.log(socket.id);
    });
    //get event form frontend when user send any messages
    socket.on('personal-chat', ({ message, to, sender, createdAt }) => {
        let targetSocketId = users[to];
        console.log(message);
        console.log(to);
        console.log(sender);
        console.log(targetSocketId);
        io.to(targetSocketId).emit('personal-chat', { sender, message, to, createdAt });
    });
    // get event of if user is typing or not
    socket.on('typing', ({ istyping, to }) => {
        console.log(istyping);
        let targetId = users[to];
        io.to(targetId).emit('typing', { istyping });
    })

    socket.on('online', ({ user }) => {
        if (!onlineuserList.includes(user)) {
            onlineuserList.push(user);
        }
        io.emit('online', onlineuserList);
    })


    socket.on('userdisconnect', ({ user }) => {
        console.log(user);
        let index = onlineuserList.findIndex((v) => v === user);
        onlineuserList.splice(index, 1);
        io.emit('online', onlineuserList);
    })

    // add more event like this over this in io connection

});




module.exports = { app, io, server, express };
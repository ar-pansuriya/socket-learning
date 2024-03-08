const { Server } = require('socket.io');
const express = require('express');
const { createServer } = require('http');

// Create an Express app
const app = express();

// Create an HTTP server using the Express app
const server = createServer(app);

// Create a Socket.IO server instance attached to the HTTP server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000' // Set frontend server URL to handle requests and responses
    }
});

// Store user information, online user list, and groups
const users = {};
const onlineuserList = [];
const groups = {};

// Handle the initial connection event
io.on('connection', (socket) => {
    // Handle the 'user connected' event from the frontend
    socket.on('user connected', (newLoginUser) => {
        // Save the socket ID associated with the user
        users[newLoginUser] = socket.id;
    });

    // Handle the 'personal-chat' event from the frontend
    socket.on('personal-chat', ({ message, to, sender, createdAt }) => {
        // Find the target socket ID based on the recipient user
        let targetSocketId = users[to];
        // Emit the 'personal-chat' event to the target socket
        io.to(targetSocketId).emit('personal-chat', { sender, message, to, createdAt });
    });

    // Handle the 'typing' event from the frontend
    socket.on('typing', ({ istyping, to }) => {
        // Find the target socket ID based on the recipient user
        let targetId = users[to];
        // Emit the 'typing' event to the target socket
        io.to(targetId).emit('typing', { istyping });
    });

    // Handle the 'online' event from the frontend
    socket.on('online', ({ user }) => {
        // Add the user to the online user list if not already present
        if (!onlineuserList.includes(user)) {
            onlineuserList.push(user);
        }
        // Emit the 'online' event to all connected sockets
        io.emit('online', onlineuserList);
    });

    // Handle the 'createGroup' event from the frontend
    socket.on('createGroup', ({ data }) => {
        // Initialize an array for the group in groups object if not exists
        groups[data.name] = groups[data.name] || [];
        // Add the current socket ID to the group
        groups[data.name].push(socket.id);
        // Join the room corresponding to the group
        socket.join(data.name);
        // Emit the 'groupCreated' event to the current socket
        io.to(socket.id).emit('groupCreated', { groupName: data.name });
    });

    // Handle the 'joinGroup' event from the frontend
    socket.on('joinGroup', ({ group }) => {
        // Check if the group exists
        if (groups[group.name]) {
            // Add the current socket ID to the group if not already present
            if (!groups[group.name].includes(socket.id)) {
                groups[group.name].push(socket.id);
            }
            // Join the room corresponding to the group
            socket.join(group.name);
        } else {
            // Notify the user that the group doesn't exist
            io.to(socket.id).emit('groupError', 'Group does not exist');
        }
    });

    // Handle the 'sendGroupMessage' event from the frontend
    socket.on('sendGroupMessage', ({ text, Gdata, sender }) => {
        // Get the array of socket IDs for the group
        const groupSockets = groups[Gdata.name];

        // Emit the message to all sockets in the specified group
        if (groupSockets) {
            console.log('Sending group message to sockets:', groupSockets);
            io.sockets.in(Gdata.name).emit('group message', {
                sender,
                text,
                groupId: Gdata._id
            });
        } else {
            console.log('No sockets found for group:', Gdata.name);
        }
    });

    // Handle the 'userdisconnect' event from the frontend
    socket.on('userdisconnect', ({ user }) => {
        // Find the index of the user in the online user list
        let index = onlineuserList.findIndex((v) => v === user);
        // Remove the user from the online user list
        onlineuserList.splice(index, 1);
        // Emit the 'online' event to all connected sockets
        io.emit('online', onlineuserList);
    });
});

// Export the Express app, Socket.IO instance, and the HTTP server
module.exports = { app, io, server, express };

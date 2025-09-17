const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

const users = [];

const userJoin = (id, username, room) => {
    const user = { id, username, room };
    users.push(user);
    return user;
};

const userLeave = (id) => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getRoomUsers = (room) => {
    return users.filter(user => user.room === room);
};

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', {
            user: 'Admin',
            text: `Welcome, ${user.username}, to the chat! :)`,
            time: new Date().toLocaleTimeString(),
            msg_id: 'join'
        });

        socket.broadcast.to(user.room).emit('message', {
            user: 'Admin',
            text: `${user.username} has joined the chat!`,
            time: new Date().toLocaleTimeString(),
            msg_id: 'join'
        });

        io.to(user.room).emit('roomUsers', {
            users: getRoomUsers(user.room)
        });

        socket.on('chatMessage', msg => {
            io.to(user.room).emit('message', {
                user: user.username,
                text: msg,
                time: new Date().toLocaleTimeString(),
                msg_id: 'chat-msg'
            });
        });

        socket.on('disconnect', () => {
            const user = userLeave(socket.id);

            if (user) {
                io.to(user.room).emit('message', {
                    user: 'Admin',
                    text: `${user.username} has left the chat`,
                    time: new Date().toLocaleTimeString(),
                    msg_id: 'leave'
                });

                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                });
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

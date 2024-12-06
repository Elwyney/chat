const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Import the cors package
var ip = require('ip');

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["secretHeader"],
        credentials: true
    }
})

const settingChat = {
    room: 'Общая комната',
    maxOnline: 10,
};
const stats = {
    online: 0,
    listUsers: [],
    listAdminIp: ['127.0.0.1']
}

io.on('connection', (socket) => {

    socket.on('name', (name) => {
        stats.listUsers.push({ name: name, ip: ip.address(), isBlock: false })
    })
    stats.online++;
    io.emit('onlineUsers', stats.online)
    socket.join('общая комната');
    socket.on('ggg', (message) => {
        io.to('общая комната').emit('chat', { ...message, ip: ip.address(), admin: stats.listAdminIp.some(item => item === ip.address()) })
    });
    socket.on('disconnect', () => {
        stats.online--;
        stats.listUsers = stats.listUsers.filter(user => user.ip !== socket.ip)
        io.emit('onlineUsers', stats.online)
    });
});

server.listen(3001, () => {

    console.log('WebSocket Server is listening on port 3001');
});

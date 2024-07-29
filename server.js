const express =require('express')
const app = express()
app.use(express.static('public'))
const expressServer= app.listen(4000)
const socketIo= require('socket.io')
// io is the socket.io server
const io= socketIo(expressServer,{
    cors:{origin:['http://localhost:4000',]}
})
let users = [];
let chatHistory = [];
// on is a regular js/node event listener
io.on('connect', socket => {
    console.log(socket.handshake);
    console.log(`${socket.id} has joined the server`);

    socket.emit('welcome', 'Welcome to the chat app');
    socket.emit('chatHistory', chatHistory);

    socket.on('newUser', username => {
        socket.username = username;
        users.push({ id: socket.id, username });
        io.emit('userJoined', `${username} has joined the chat`);
        console.log(`Users connected: ${users.length}`);
    });

    socket.on('sendMessageToServer', ({ user, msg }) => {
        const message = { user, msg };
        chatHistory.push(message);
        io.emit('messageFromServerToAll', message);
    });

    socket.on('disconnect', reason => {
        const user = users.find(u => u.id === socket.id);
        if (user) {
            io.emit('userLeft', `${user.username} has left the chat`);
            users = users.filter(u => u.id !== socket.id);
        }
        console.log(reason); // "ping timeout"
    });
});
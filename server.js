const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins for simplicity, adjust as needed
    methods: ['GET', 'POST']
  }
});

let users = [];
let chatHistory = [];

io.on('connect', socket => {
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

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

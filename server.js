const express =require('express')
const app = express()
app.use(express.static('public'))
const expressServer= app.listen(4000)
const socketIo= require('socket.io')
// io is the socket.io server
const io= socketIo(expressServer,{
    cors:{origin:['http://localhost:4000',]}
})
// on is a regular js/node event listener
io.on('connect',socket=>{
    console.log(socket.handshake)
    // Capital S for Socket in docs is the constructor
    console.log(socket.id,'has joined the server');
    socket.emit('Id',socket.id)
    // first arg of emit is the event name
    // second arg is the data to send which is pushed to the client/browser
    socket.emit('welcome','welcome message')
    io.emit('newUser',socket.id)
    // THIS IS THE IMPORTANT PART
    socket.on('sendMessageToServer',msg=>{
        console.log('message:',msg)
        io.emit('messageFromServerToAll',msg)
    })
})
io.on("disconnect", (reason) => {
    console.log(reason); // "ping timeout"
  });
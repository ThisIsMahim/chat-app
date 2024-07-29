// io() connects to the socket.io server at the url specified
const socket = io('http://localhost:4000',{
    reconnectionAttempts: Infinity, // we want to keep trying to reconnect indefinitely
    reconnectionDelay: 1000 ,// we want to wait 1 second before trying to reconnect
})

// just like the server, our socket has an on method and an emit method
socket.on('welcome', data=>{
    console.log(data)
    // emit a message to the server with the client's username
    socket.on('newUser', data=>{console.log('A new client has joined:',data)})
})
socket.on('messageFromServerToAll', msg=>{
    document.getElementById('messages').innerHTML += `<li> <span class="font-bold text-red-500">${socket.id}</span>: ${msg}</li>`
})

// Message sent to the server
const sendBtn= document.getElementById('sendMessageBtn');
sendBtn.addEventListener('click',e=>{
    e.preventDefault();
    const message=document.getElementById('messageInput').value;
    document.getElementById('messageInput').value='';
    socket.emit('sendMessageToServer', message)
})
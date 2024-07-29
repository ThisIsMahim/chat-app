// io() connects to the socket.io server at the url specified
const socket = io('http://localhost:4000',{
    reconnectionAttempts: Infinity, // we want to keep trying to reconnect indefinitely
    reconnectionDelay: 1000 ,// we want to wait 1 second before trying to reconnect
})
// ----------------------------------------------------------------
// username settings
let username = '';

document.getElementById('setUsernameBtn').addEventListener('click', e => {
    e.preventDefault();
    username = document.getElementById('usernameInput').value.trim();
    if (username) {
        document.getElementById('usernameForm').style.display = 'none';
        document.getElementById('chatForm').style.display = 'flex';
        socket.emit('newUser', username);
    } else {
        alert('Please enter a username.');
    }
});

// just like the server, our socket has an on method and an emit method
socket.on('welcome', data=>{
    console.log(data)
    // emit a message to the server with the client's username
    socket.on('newUser', data=>{console.log('A new client has joined:',data)})
})
socket.on('messageFromServerToAll', ({ user, msg })=>{
    document.getElementById('messages').innerHTML += `<li class="p-1 border-[1px] rounded-md w-max border-gray-300 mb-1"> <span class="font-bold text-red-500">${user}</span>: ${msg}</li>`
})

// Message sent to the server
const sendBtn= document.getElementById('sendMessageBtn');
sendBtn.addEventListener('click',e=>{
    e.preventDefault();
    const message=document.getElementById('messageInput').value;
    document.getElementById('messageInput').value='';
    socket.emit('sendMessageToServer', { user: username, msg: message })
})
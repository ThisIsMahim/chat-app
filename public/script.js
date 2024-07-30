const socket = io("http://localhost:4000", {
  reconnectionAttempts: Infinity, // we want to keep trying to reconnect indefinitely
  reconnectionDelay: 1000, // we want to wait 1 second before trying to reconnect
});

let username = localStorage.getItem("username") || "";

document.addEventListener("DOMContentLoaded", () => {
  if (username) {
    document.getElementById("usernameForm").style.display = "none";
    document.getElementById("chatForm").style.display = "flex";
    socket.emit("newUser", username);
  }
});

socket.on("chatHistory", (history) => {
  const messageList = document.getElementById("messages");
  history.forEach(({ user, msg }) => {
    const newMessage = document.createElement("li");
    newMessage.innerHTML = `<span class="font-bold text-red-500">${user}</span>: ${msg}`;
    messageList.appendChild(newMessage);
  });
});

socket.on("userJoined", (msg) => {
  const messageList = document.getElementById("messages");
  const newMessage = document.createElement("li");
  newMessage.classList.add("text-center");
  newMessage.innerHTML = `<span class="font-bold text-green-500 ">${msg}</span>`;
  messageList.appendChild(newMessage);
});

socket.on("userLeft", (msg) => {
  const messageList = document.getElementById("messages");
  const newMessage = document.createElement("li");
  newMessage.classList.add("text-center");
  newMessage.innerHTML = `<span class="font-bold text-gray-500 ">${msg}</span>`;
  messageList.appendChild(newMessage);
});

document.getElementById("setUsernameBtn").addEventListener("click", (e) => {
  e.preventDefault();
  username = document.getElementById("usernameInput").value.trim();
  if (username) {
    document.getElementById("usernameForm").style.display = "none";
    document.getElementById("chatForm").style.display = "flex";
    socket.emit("newUser", username);
  } else {
    alert("Please enter a username.");
  }
});

socket.on("welcome", (data) => {
  console.log(data);
});

socket.on("messageFromServerToAll", ({ user, msg }) => {
  document.getElementById(
    "messages"
  ).innerHTML += `<li class="p-1 border-[1px] rounded-md w-max border-gray-300 mb-1 text-right"> <span class="font-bold text-red-500">${user}</span>: ${msg}</li>`;
});

const sendBtn = document.getElementById("sendMessageBtn");
sendBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const message = document.getElementById("messageInput").value;
  document.getElementById("messageInput").value = "";
  socket.emit("sendMessageToServer", { user: username, msg: message });
});

socket.on("connect_error", () => {
  alert("Connection failed. Please try again later.");
});

socket.on("disconnect", (reason) => {
  console.log(reason); // "ping timeout"
});

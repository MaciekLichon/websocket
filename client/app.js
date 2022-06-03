
const socket = io(); // inicjalizacja klienta (socketa)

const loginForm = document.getElementById("welcome-form");
const messagesSection = document.getElementById("messages-section");
const messagesList = document.getElementById("messages-list");
const addMessageForm = document.getElementById("add-messages-form");
const userNameInput = document.getElementById("username");
const messageContentInput = document.getElementById("message-content");

let userName = '';

const login = e => {
  e.preventDefault();
  if (userNameInput.value) {
    userName = userNameInput.value;
    socket.emit('join', userName); // emitter nazwy uzytkownika do serwera
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  } else {
    alert('Please choose the username');
  }
};

const addMessage = (author, content) => {
  const message = document.createElement('li');

  message.classList.add('message');
  message.classList.add('message--received');

  if (author === userName) {
    message.classList.add('message--self');
  };

  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;

  messagesList.appendChild(message);
};

const sendMessage = e => {
  e.preventDefault();
  let messageContent = messageContentInput.value;

  if (messageContent) {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent }); // emmiter eventu message do serwera
    messageContentInput.value = '';
  } else {
    alert('No message found');
  }
};


loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);

socket.on('message', (event) => addMessage(event.author, event.content)); // nasluchiwacz na event 'message' od serwera, ktory przy wykryciu wygeneruje html funkcja addMessage
socket.on('newUser', (user) => addMessage('Chat Bot', `${user} has joined the conversation`));
socket.on('removeUser', (user) => addMessage('Chat Bot', `${user} has left the conversation`)); 

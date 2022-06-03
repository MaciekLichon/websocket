const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();
const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
const io = socket(server); // polaczenie serwera z paczka socket

// tablica zawierajaca wiadomosci, nie ma tu zastosowania z perspektywy uzytkownika, poniewaz archiwalne wiadomosci nie beda przesylane
// taka tablice mozna potraktowac jako log wiadomosci, do ktorego dostep ma administrator
const messages = [];
const users = [];

io.on('connection', (socket) => {
  // console.log('New client! Its id – ' + socket.id);
  socket.on('message', (message) => {
    // console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('join', (userName) => {
    // console.log('user joins ' + userName);
    users.push({ name: userName, id: socket.id });
    socket.broadcast.emit('newUser', userName);
  })
  socket.on('disconnect', () => {
    // console.log('Oh, socket ' + socket.id + ' has left');
    const disconnectedUser = users.find(user => user.id === socket.id);
    const userIndex = users.indexOf(disconnectedUser);
    users.splice(userIndex, 1);

    if (disconnectedUser) {
      socket.broadcast.emit('removeUser', disconnectedUser.name);
    };
  });
  // console.log('I\'ve added a listener on message and disconnect events \n');
});

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

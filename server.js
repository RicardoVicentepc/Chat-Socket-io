const express = require('express');
const path = require('path');

const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server); // configuração http e web socket

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) =>{
    res.render('index.html');
});



let messages = [];

// forma de conexão
io.on('connection', socket => {
    console.log(`Socket Conectado ${socket.id}`);
    socket.emit('previousMessages', messages)
    socket.on('sendMessage', data =>{
        console.log(data)
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data) // enviar msg pra todos que estão conectados
    });
});

server.listen(3000);
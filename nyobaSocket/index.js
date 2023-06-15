const express = require('express');
const socketio = require('socket.io');
const path = require('path');

const app = express();

app.get('/', (req, res) => {
    // res.send('Hello from Codedamn');
    // mengirim file sebagai respons dari permintaan HTTP.
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
})

// memberi tahu Express bahwa direktori 'client' adalah direktori yang berisi konten statis yang dapat diakses secara publik.
app.use(express.static(path.resolve(__dirname, 'client')));

const server = app.listen(1611, () => {
    console.log('Server running!')
})

const io = socketio(server)

io.on('connection', (socket) => {
    // console.log('New connection')
    // console.log(`New connection: ${socket.id}`);

    // ngirim pesan "notification" ke client
    socket.emit('notification', 'Thanks for connecting to Codedamn!')

    // nerima pesan dari client
    socket.on('message', (data) => {
        console.log(`New message from ${socket.id}: ${data}`);
    })
})
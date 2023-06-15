const socket = io();

// ngirim "message" ke server
socket.emit('message', 'halo halo bandung');

// nerima event listener "notification" dari server
socket.on('notification', (data) => {
    console.log(`New notification: ${data}`);
})
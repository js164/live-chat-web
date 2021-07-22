const io = require('socket.io')( process.env.PORT || 8000, {
    cors: {
      origin: '*',
    }
  });

const users = {};

io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        io.emit('user-joined', {name:name,users:users});
    });

    socket.on('send', message =>{
        // socket.broadcast.
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect', message =>{
        var disconnectuser=users[socket.id]
        delete users[socket.id];
        socket.broadcast.emit('leave', {name:disconnectuser,users:users});
    });


})

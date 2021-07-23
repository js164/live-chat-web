const io = require('socket.io')( process.env.PORT || 8000, {
    cors: {
      origin: '*',
    }
  });

var path = require('path');

const express=require('express')
const app=express()
const route=express.Router()
const port= process.env.PORT || 3000

route.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/index.html'))
})
route.get('/client.js',(req,res)=>{
    res.sendFile(path.join(__dirname,'/client.js'))
})
route.get('/client.css',(req,res)=>{
    res.sendFile(path.join(__dirname,'/client.css'))
})
route.get('/Message_notification.mp3',(req,res)=>{
    res.sendFile(path.join(__dirname,'/Message_notification.mp3'))
})
route.get('/wallpaper.png',(req,res)=>{
    res.sendFile(path.join(__dirname,'/wallpaper.png'))
})

app.use('/', route);
app.listen(port,()=>{
    console.log(`starting Server`)
})

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

const io = require('socket.io')( process.env.PORT || 8000, {
    cors: {
      origin: '*',
    }
  });

var path = require('path');

const express=require('express')
const app=express()
const route=express.Router()
var http = require('http').createServer(app);
var io = require('socket.io')(http);

http.listen(process.env.PORT || 8000, function() {
    var host = http.address().address
    var port = http.address().port
    console.log('App listening at ', port)
});

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

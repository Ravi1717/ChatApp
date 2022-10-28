const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/user');

const app = express();

const botName = 'ChatCord Bot';

const server = http.createServer(app);

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
require("dotenv").config();


// import{models} from './database';

const {models, sequelize} = require('./database');

console.log('model', models)

const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Runs when client connects
io.on('connection', socket =>{

    //Joining a specific room
    socket.on('joinRoom', ({username, room})=>{
        console.log('socket id', socket.id);
        const user = userJoin(socket.id, username, room);

           const chatUser = models.chatUser.create(
              {
                socketId:socket.id,
                username: username,
                room:room
              },
            );
          

        socket.join(user.room);

        //Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    //Broadcast when a user connects
    socket.broadcast.to(user.room).emit('message',formatMessage(botName, `${user.username} has joined the chat`));

    //Send users and room info
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
    })

    })
    
    //Listen for chat message
    socket.on('chatMessage', msg=>{

        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message',  formatMessage(user.username, msg))
    })

    //Runs when client disconnects
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
            //Send users and room info
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
    })
        }
    })
})

const PORT = 3000 || process.env.PORT;

const eraseDatabaseOnSync = true;

sequelize.sync({force: true}).then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Example app listening on port ${process.env.PORT}!`);
    });
  });
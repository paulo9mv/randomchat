var express = require('express');
var app = express();

var cors = require('cors') 

app.use(express.static('public'))
app.use(cors())


const server = app.listen(process.env.PORT || 3000, () => {
    console.log('server is running on port', server.address().port);
});
const io = require('socket.io').listen(server);

const users = [];
const connections = [];

io.sockets.on('connection',(socket) => {
  
  
  console.log(' %s sockets is connected', connections.length);

  socket.on('disconnect', () => {
    let a = connections.splice(connections.indexOf(socket.id), 1);
    let userRemoved = a[0][1];
    
    io.sockets.emit('newmessage', `${userRemoved} saiu da sala.`);
    users.splice(users.indexOf(userRemoved), 1);
    
 });

 socket.on('sendmessage', (message) => {
    console.log(socket.id);
    if(message.newconnection)
      connections.push([socket.id, message.user]);
      
           
    io.sockets.emit('newmessage', message.message);
 });
});

app.get('/login', function(req, res){
  let user = req.query.user;
  console.log('received something')

  if(users.includes(user)){
    res.send({
      error : true,
      type : 'user_already_exists'
    })
    return;
  }

  users.push(user);

  res.send({
    error : false,
    type: 'user_added'
  })
  
})
var express = require('express');
var app = require('express')();
var http = require ('http').createServer(app);
var io = require('socket.io').listen(http);
users = [];
connections = [];

var fs = require('fs'); //require for file serving

http.listen(process.env.PORT || 3000, function(){
	console.log('Server running... on port 3000');
});


//location to index.html
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  // Diconnect
  socket.on('disconnect', function(data){
	connections.splice(connections.indexOf(socket), 1);
	console.log('Disconnected %s sockets connected', connections.length);
  });
});

io.sockets.on('connection', function(socket){
	fs.readFile(__dirname + '/image.jpg', function(err, buf){
		//it's impossible to ebed binary data
		socket.emit('image', { image: true, buffer: buf.toString('base64') });
		console.log('image file is initialized: ' + __dirname + '/image.jpg');
	});
});

var watch = require('node-watch');

watch('image.jpg', function(evt, filename) {
  console.log(filename, ' changed.');
});
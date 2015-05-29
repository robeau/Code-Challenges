var express = require('express'),       //include express package 
jade = require('jade'),                 // and jade lib
http = require('http'),
app = express();

var io = require('socket.io');          //include sockei.io
var server = http.createServer(app);

io = io.listen(server);
server.listen(process.env.PORT || 3000);                    // set to port 3000


io.sockets.on('connection', function (socket) {
    socket.on('setName', function (data) {
        socket.nickName = data;         //assigns name variable to socket
    });

    socket.on('message', function (message) {

        var data = { 'message': message,
            'nickName': socket.nickName
        };
        socket.broadcast.emit('message', data);     //broadcast message and log it
        socket.broadcast.emit('stopTyping');
        console.log('user ' + socket.nickName + ' sent this : ' + message);

    });

    socket.on('typing', function (isTyping) {   //broadcast when someone's typing
        socket.broadcast.emit('typing');
        console.log('Someone began typing.');   //and log it
    })
});


app.set('views', __dirname + '/views');     //uses the jade template
app.set('view engine', 'jade');
app.set('view options', { layout: false});

app.use(express.static(__dirname + '/public')); //JS is in here

app.get('/', function(req, res) {
	res.render('home.jade');
});


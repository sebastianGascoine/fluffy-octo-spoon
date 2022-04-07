var express = require('express');
var bodyParser = require('body-parser');
var myDatabase = require("./myDatabase");
var routes = require("./routes");
let http = require('http');
let app = express();
let server = http.createServer(app);
let io = require('socket.io').listen(server);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static('./public'));
app.use('/db', express.static('./myDatabase'));

app.use(routes);



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routes);

io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });

    socket.on('update', function (data) {
        // Broadcast to everyone (including self)
        io.emit('update', data.ident );
    });
});


let port = process.env.PORT || 3000;

//app.listen(port);
server.listen(port);
console.log("hosted on port "+ port);


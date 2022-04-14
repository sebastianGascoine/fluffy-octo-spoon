const express = require('express');
const bodyParser = require('body-parser');
const myDatabase = require("./myDatabase");
const routes = require("./routes");
const morgan = require('morgan');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(morgan('short'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static('./public'));
app.use(routes);

io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });

    socket.on('update', function (data) {
        // Broadcast to everyone (including self)
        io.emit('update', data.ident);
    });
});

const port = process.env.PORT || 3000;

server.listen(port);
console.log('Hosted on port ' + port);
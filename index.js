const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const flash = require('connect-flash');
const http = require('http');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const shared = require('./shared');
const socket = require('./socket');
const setupPassport = require('./setupPassport');
const routes = require('./routes');

mongoose.connect('mongodb://localhost:27017/userdb');
setupPassport();

const app = express();
const server = http.createServer(app);

app.use(shared.sessionMiddleware);

app.use(morgan('short'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', express.static('./public'));
app.use(routes);

const port = 3000;
app.set('port', process.env.PORT || port);

socket.setup(server);

server.listen(port);
console.log('Hosted on port ' + port);
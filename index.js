const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

const socket = require('./socket');
const setupPassport = require('./setuppassport');
const routes = require('./routes');

mongoose.connect('mongodb://localhost:27017/userdb');
setupPassport();

const app = express();
const server = http.createServer(app);

app.use(session({
    secret: 'LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t',
    resave: true,
    saveUninitialized: true
}));

app.use(morgan('short'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', express.static('./public'));
app.use(routes);

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

const port = 3000;
app.set('port', process.env.PORT || 3000);

socket(server);

server.listen(port);
console.log('Hosted on port ' + port);
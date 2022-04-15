const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');

const socket = require("./socket");
const routes = require("./routes");

const app = express();
const server = http.createServer(app);

app.use(morgan('short'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static('./public'));
app.use(routes);

const port = process.env.PORT || 3000;

socket(server);

server.listen(port);
console.log('Hosted on port ' + port);
//Test commit

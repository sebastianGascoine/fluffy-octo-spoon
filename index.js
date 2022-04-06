var express = require('express');
var bodyParser = require('body-parser');

var myDatabase = require("./Server/myDatabase");
var routes = require("./Server/routes");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static('./../public'));
app.use('/db', express.static('./Server/myDatabase'));

app.use(routes);

var port = process.env.PORT || 3000;
app.listen(port);

console.log('index.js')
var express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const http = require("http");
var cookieParser = require("cookie-parser");
var flash = require("connect-flash");
var mongoose = require("mongoose");
var passport = require("passport");
var path = require("path");
var session = require("express-session");


var setUpPassport = require("./setuppassport");
const socket = require("./socket");
const routes = require("./routes");


/*---------------*/
/*
"body-parser": "^1.20.0",
    "esm": "^3.2.25",
    "express": "^4.15.3",
    "morgan": "^1.10.0",
    "passport": "^0.6.0",
    "socket.io": "^4.4.1",
    "sweetalert2": "^11.4.8",
    "three": "^0.139.2",
    "three-gltf-loader": "^1.111.0",
    "uuid": "^8.3.2"
*/

/*--------------*/

const app = express();
const server = http.createServer(app);

app.use(morgan("short"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", express.static("./public"));
app.use(routes);
//app.use(bodyParser.urlencoded({ extended: true }));   //added
//app.use(bodyParser.json());                           //added


app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: "LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t",
  resave: true,
  saveUninitialized: true
}));


app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


//27017 seems to be the port number used by mongod
mongoose.connect("mongodb://localhost:27017/userdb");

setUpPassport.passportstuf;
const port = 3000;
app.set("port", process.env.PORT || 3000);

socket(server);

server.listen(port);
console.log("Hosted on port " + port);

//don't ever do below code.
//app.use('/', express.static('./'));

//app.use(express.static(path.join(__dirname, "public")));

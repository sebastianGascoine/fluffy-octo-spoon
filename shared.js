const session = require("express-session");
const mongoStore = require('connect-mongo');

module.exports.sessionMiddleware = session({
    name: "chess.session",
    secret: 'LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t',
    resave: true,
    saveUninitialized: true,
    store: mongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/userdb-group4' })
});

const Database = require('./database/database');

module.exports.database = new Database();
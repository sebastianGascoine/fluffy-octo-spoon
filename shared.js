const session = require("express-session");
const mongoStore = require('connect-mongo');

module.exports.sessionMiddleware = session({
    name: "chess.session",
    secret: 'LUp$Dg?,I#i&owP3=9su+OB%`JgL4muLF5YJ~{;t',
    resave: true,
    saveUninitialized: true,
    store: mongoStore.create({ mongoUrl: 'mongodb://localhost:27017/userdb' })
});

const Database = require('./database/database');

module.exports.database = new Database();
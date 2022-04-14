const path = require("path");
const express = require("express");

const router = express.Router();

const myDatabase = require("./myDatabase");
const Game = require('./Game');

router.get("/",function(req, res){
    res.sendFile(path.resolve(__dirname + "/public/views/index.html"));  //changed
});

router.get("/justtotest",function(req, res){
    res.sendFile(path.resolve(__dirname + "/public/views/board.html"));  //changed
});

//////////////////////////////////////////////////////////////
const database = new myDatabase();

router.post('/create', function(req, res){
    let gameID = String(req.body.gameID.trim());
    let name   = String(req.body.name.trim());
    let fen    = String(req.body.fen.trim());

    // Starting FEN String
    if (!fen) fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    console.log(gameID, name, fen);

    const game = new Game(gameID, name, fen);

    const success = database.newGame(game);

    if (!success) {
        res.json({ error: true });
        return;
    }

    res.json({ gameID: gameID });
});

module.exports = router;
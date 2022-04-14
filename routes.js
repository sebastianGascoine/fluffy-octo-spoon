const path = require('path');
const express = require('express');
const shared = require('./shared');

const router = express.Router();

const Game = require('./Game');

router.get('/',function(req, res){
    res.sendFile(path.resolve(__dirname + '/public/views/index.html'));  //changed
});

router.get('/board',function(req, res){
    res.sendFile(path.resolve(__dirname + '/public/views/board.html'));  //changed
});

//////////////////////////////////////////////////////////////

router.post('/create', function(req, res){
    let gameID = String(req.body.gameID).trim();
    let name   = String(req.body.name).trim();
    let fen    = String(req.body.fen).trim();

    // Starting FEN String
    if (!req.body.fen) fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    let game = new Game(gameID, [], fen);

    let success = shared.database.newGame(game);

    if (!success) {
        res.json({ error: true });
        return;
    }

    res.json({ error: false });
});

router.get('/play', function(req, res){
    let gameID = String(req.query.gameID).trim();
    let name   = String(req.query.name).trim();

    console.log(gameID, name);

    let game = shared.database.getGame(gameID);

    if (!game) {
        res.send('Unknown game');
        return;
    }

    console.log(game);

    if (game.players.length == 2) {
        res.send('Game full');
        return;   
    }

    game.players.push(name);

    shared.database.putGame(game);

    console.log(game);

    res.sendFile(path.resolve(__dirname + '/public/views/board.html'));
});

module.exports = router;
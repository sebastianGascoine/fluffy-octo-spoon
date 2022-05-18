const path = require('path');
const express = require('express');
const shared = require('./shared');
const valid  = require('./valid');

const router = express.Router();

const Game = require('./database/Game');
const Player = require('./database/Player');

router.get('/',function(req, res) {
    res.sendFile(path.resolve(__dirname + '/public/views/index.html'));  //changed
});

router.get('/board',function(req, res) {
    res.sendFile(path.resolve(__dirname + '/public/views/board.html'));  //changed
});

router.post('/create', function(req, res) {
    let gameID = String(req.body.gameID).trim();
    let name   = String(req.body.name).trim();
    let fen    = String(req.body.fen).trim();

    if (!gameID) {
        res.json({
            error: true,
            errorCode: 1,
            errorMessage: "Missing a Game ID"
        });
        return;
    }

    if (!name) {
        res.json({
            error: true,
            errorCode: 2,
            errorMessage: "Missing a Player Name"
        });
        return;
    }

    if (!fen) {
        res.json({
            error: true,
            errorCode: 3,
            errorMessage: "Missing a FEN String"
        });
        return;
    }

    // TODO: Need to validate FEN String
    if (valid.ValidateFEN(fen)) {
        res.json({
            error: true,
            errorCode: 4,
            errorMessage: valid.errorcode()
        });
        return;
    }
    let game = new Game(gameID, [], fen);
    let success = shared.database.newGame(game);

    if (!success) {
        res.json({
            error: true,
            errorCode: 4,
            errorMessage: "Duplicate of existing Game ID"
        });
        return;
    }

    res.json({ error: false });
});

router.post('/join', function(req, res) {
    let gameID = String(req.body.gameID).trim();
    let name   = String(req.body.name).trim();

    let game = shared.database.getGame(gameID);

    if (!game) {
        res.json({
            error: true,
            errorCode: 5,
            errorMessage: "Game does not exist"
        });
        return;
    }

    if (game.players.length === 2) {
        res.json({
            error: true,
            errorCode: 6,
            errorMessage: "Game already has two players"
        });
        return;
    }

    let player = new Player(name, game.players.length ? 'b' : 'w');
    game.players.push(player);

    shared.database.putGame(game);

    res.json({ error: false, code: player.uuid });
});

module.exports = router;

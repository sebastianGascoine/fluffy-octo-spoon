const path = require('path');
const express = require('express');

const router = express.Router();

const passport = require('passport');

const valid = require('fen-validator').default;
const database = require('./shared').database;
const Player = require('./database/models/Player');
const Game = require('./database/Game');

router.get('/', function (req, res) {
    if (!req.isAuthenticated()) return res.redirect('/login');

    res.sendFile(path.resolve(__dirname + '/public/views/index.html'));
});

router.get('/board', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/public/views/board.html'));
});

router.get('/login', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/public/views/login.html'));
});

router.get('/signup', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/public/views/signup.html'));
});

router.post('/create', function (req, res) {
    let gameID = String(req.body.gameID).trim();
    let name = req.user.username;
    let fen = req.body.fenString?.trim();

    if (!gameID) {
        res.json({
            error: true,
            errorCode: 1,
            errorMessage: 'Missing a Game ID',
        });
        return;
    }

    if (!name) {
        res.json({
            error: true,
            errorCode: 2,
            errorMessage: 'Missing a Player Name',
        });
        return;
    }

    if (!fen) fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    if (!valid(fen)) {
        res.json({
            error: true,
            errorCode: 4,
            errorMessage: 'Invalid FEN String',
        });
        return;
    }

    console.log(fen);

    let game = new Game(gameID, [], fen);
    let success = database.newGame(game);

    if (!success) {
        res.json({
            error: true,
            errorCode: 4,
            errorMessage: 'Duplicate of existing Game ID',
        });
        return;
    }

    res.json({error: false});
});

router.post('/join', function (req, res) {
    let gameID = String(req.body.gameID).trim();
    let name = req.user.username;

    let game = database.getGame(gameID);

    if (!game) {
        res.json({
            error: true,
            errorCode: 5,
            errorMessage: 'Game does not exist',
        });
        return;
    }

    if (game.players.length === 2) {
        res.json({
            error: true,
            errorCode: 6,
            errorMessage: 'Game already has two players',
        });
        return;
    }

    let player = { name, color: game.players.length ? 'b' : 'w' };
    game.players.push(player);

    database.putGame(game);

    res.json({error: false });
});

router.get('/successsignup', function (req, res) {
    res.json({ redirect: '/' });
});

router.get('/failsignup', function (req, res) { //errcode 8
    console.log('get failsignup');
    res.json({ redirect: '/signup' });
});

router.get('/successlogin', function (req, res) {
    console.log('get successlogin');
    res.json({ redirect: '/' });
});

router.get('/faillogin', function (req, res) {
    console.log('get failsignup');
    res.json({ redirect: '/login' });
});

router.get('/logout', function (req, res) {
    if (req.isAuthenticated()) req.logout(() => {});

    res.json({ redirect: '/' });
});

router.post('/signup', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    Player.findOne({ username }, function (err, player) {
        if (err) return next(err);

        if (player) return res.json({ error: true, errorMessage: 'User already exists' });

        const createdPlayer = new Player({ username, password });
        createdPlayer.save(next);
    });
}, passport.authenticate('login', {
    successRedirect: '/successsignup',
    failureRedirect: '/failsignup',
}));

router.post('/login', passport.authenticate('login', {
        successRedirect: '/successlogin',
        failureRedirect: '/faillogin'
    })
);

module.exports = router;
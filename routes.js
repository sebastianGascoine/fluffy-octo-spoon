const path = require('path');
const express = require('express');
const shared = require('./shared');

const router = express.Router();

const Game = require('./database/Game');
const Player = require('./database/Player');

router.get('/',function(req, res) {
    res.sendFile(path.resolve(__dirname + '/public/views/index.html'));  //changed
});

router.get('/board',function(req, res) {
    res.sendFile(path.resolve(__dirname + '/public/views/board.html'));  //changed
});

router.get('/cool',function(req, res) {
    res.sendFile(path.resolve(__dirname + '/public/views/cool.html'));  //changed
});

router.get('/3d',function(req, res) {
    res.sendFile(path.resolve(__dirname + '/public/views/threejstest.html'));  //changed
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
    fen = ValidateFEN(fen);
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

    if (game.players.length == 2) {
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
/* LIST OF THINGS TO ValidateFENs 🙂
Board:
    There are exactly 8 ranks (rows).
    The sum of the empty squares and pieces add to 8 for each rank (row).
    There are no consecutive numbers for empty squares.
Kings:
    See if there is exactly one w_king and one b_king.
    Make sure kings are separated and are at least 1 square apart.
Checks:
    Non-active color is not in check.
    Active color is checked less than 3 times (triple check is impossible);
    in case of 2 that it is never pawn+(pawn, bishop, knight), bishop+bishop, knight+knight.
Pawns:
    There are no more than 8 pawns from each color.

    There aren't any pawns in first or last rank (row) since they're either in a wrong start position or they should have promoted.

    In the case of en passant square; see if it was legally created
    (e.g it must be on the x3 or x6 rank, there must be a pawn (from the correct color) in front of it,
    and the en passant square and the one behind it are empty).

    Prevent having more promoted pieces than missing pawns (e.g extra_pieces = Math.max(0, num_queens-1)
    + Math.max(0, num_rooks-2) + Math.max(0, num_knights-2) + Math.max(0, num_bishops-2)
    and then extra_pieces <= (8-num_pawns)).

    A bit more processing-intensive is to count the light-squared bishops and dark-squared
    bishops separately, then do Math.max(0, num_lightsquared_bishops-1) and Math.max(0, num_darksquared_bishops-1).

    Another thing worth mentioning is that, whenever the extra_pieces is not 0,
    the other side must have less than 16 pieces because for a pawn to promote it needs to walk past another pawn in front
    and that can only happen if the pawn goes missing (taken or playing with a handicap) or the pawn shifts its file (column),
    in both cases decreasing the total of 16 pieces for the other side.

    The pawn formation is possible to reach (e.g in case of multiple pawns in a single col,
    there must be enough enemy pieces missing to make that formation),

  here are some useful rules:
    it is impossible to have more than 6 pawns in a single file (column) (because pawns can't exist in the first and last ranks).
    the minimum number of enemy missing pieces to reach a multiple pawn in a single col
    B to G 2=1, 3=2, 4=4, 5=6, 6=9 ___ A and H 2=1, 3=3, 4=6, 5=10, 6=15, for example, if you see 5 pawns in A or H,
    the other player must be missing at least 10 pieces from his 15 captureable pieces.

    if there are white pawns in a2 and a3, there can't legally be one in b2, and this idea can be further expanded to cover more possibilities.
Castling:
    If the king or rooks are not in their starting position; the castling ability for that side is lost (in the case of king, both are lost).
Bishops:
    Look for bishops in the first and last ranks (rows) trapped by pawns that haven't moved, for example:
    a bishop (any color) trapped behind 3 pawns.

    a bishop trapped behind 2 non-enemy pawns (not by enemy pawns because we can reach that position by underpromoting pawns,
    however if we check the number of pawns and extra_pieces we could determine if this case is possible or not).
Half/Full move Clocks:

    In case of an en passant square, the half move clock must equal to 0.
    HalfMoves <= ((FullMoves-1)*2)+(if BlackToMove 1 else 0), the +1 or +0 depends on the side to move.

    The HalfMoves must be x >= 0 and the FullMoves x >= 1.
    If the HalfMove clock indicates that some reversible moves were played and you can't find any combination of
    reversible moves that could have produced this amount of Halfmoves (taking castling rights into account, forced moves, etc),
    example: a side with many pawns and a king with castling rights and a rook
    (the HalfMove clock should not have been able to increase for this side).
Other:
    Make sure the FEN contains all the parts that are needed (e.g active color, castling ability, en passant square, etc).
*/
function ValidateFEN(id){
 console.log('validateFEN OCCURING');
 for(let i=0;i<id.length();i++){

 }

}


module.exports = router;

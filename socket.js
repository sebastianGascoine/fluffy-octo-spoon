const io = require("socket.io");

const logic = require("./logic");
const shared = require('./shared');
const database = require('./shared').database;
const passport = require("passport");

const Player = require('./database/models/Player');

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

module.exports.setup = function (httpServer) {
    const server = new io.Server(httpServer);

    gameServer(server);
}

function gameServer(server) {
    const namespace = server.of('/game');

    namespace.use((socket, next) => {
        shared.sessionMiddleware(socket.request, {}, next);
    });

    namespace.use(wrap(passport.initialize()));
    namespace.use(wrap(passport.session()));

    namespace.use((socket, next) => {
        if (socket?.request?.session?.passport?.user) return next();
    });

    namespace.on("connection", function (socket) {
        socket.on("join", function (data) {
            const game = database.getGame(data.game);

            if (!game) return;

            const playerIndex = game.players.findIndex(
                (player) => player.name === socket.request.user.username
            );

            const player = game.players[playerIndex];

            console.log(socket.request.user);
            console.log(game);

            if (playerIndex < 0) return;

            player.socket?.disconnect();
            player.socket = socket;

            game.players[playerIndex] = player;
            database.putGame(game);

            socket.emit("setup", {color: player.color, name: player.name});

            if (game.players.length === 2) {
                game.players[0].socket?.emit("opponent", {
                    name: game.players[1].name,
                });
                game.players[1].socket?.emit("opponent", {
                    name: game.players[0].name,
                });

                const moves = logic.getPossibleMoves(game.fen);

                game.players[0].socket.emit("state", {
                    fen: game.fen,
                    moves: moves,
                    turn: logic.getCurrentTurn(game.fen),
                });
                game.players[1].socket.emit("state", {
                    fen: game.fen,
                    moves: moves,
                    turn: logic.getCurrentTurn(game.fen),
                });
            }
        });

        socket.on("move", function (data) {
            const game = database.getGame(data.game);

            const player = game?.players.find((player) => player.name === socket.request.user.username);

            if (!player) return;

            if (logic.getCurrentTurn(game.fen) !== player.color) return;

            const moves = logic.getPossibleMoves(game.fen);
            const move = moves.find(
                (other) =>
                    other.from.rank == data.move.from.rank &&
                    other.from.file == data.move.from.file &&
                    other.to.rank == data.move.to.rank &&
                    other.to.file == data.move.to.file
            );

            if (!move) return;

            const currTurn = logic.getCurrentTurn(game.fen);
            const nextTurn = logic.getCurrentTurn(game.fen) == "w" ? "b" : "w";

            let nextFen = game.fen;

            if (move.castle == "K") {
                nextFen = logic.setBoard(
                    nextFen,
                    logic.setPiece(nextFen, {rank: 0, file: 5}, "R")
                );
                nextFen = logic.setBoard(
                    nextFen,
                    logic.setPiece(nextFen, {rank: 0, file: 7}, "")
                );
            }
            if (move.castle == "k") {
                nextFen = logic.setBoard(
                    nextFen,
                    logic.setPiece(nextFen, {rank: 7, file: 5}, "r")
                );
                nextFen = logic.setBoard(
                    nextFen,
                    logic.setPiece(nextFen, {rank: 7, file: 7}, "")
                );
            }
            if (move.castle == "Q") {
                nextFen = logic.setBoard(
                    nextFen,
                    logic.setPiece(nextFen, {rank: 0, file: 2}, "R")
                );
                nextFen = logic.setBoard(
                    nextFen,
                    logic.setPiece(nextFen, {rank: 0, file: 0}, "")
                );
            }
            if (move.castle == "q") {
                nextFen = logic.setBoard(
                    nextFen,
                    logic.setPiece(nextFen, {rank: 7, file: 2}, "r")
                );
                nextFen = logic.setBoard(
                    nextFen,
                    logic.setPiece(nextFen, {rank: 7, file: 0}, "")
                );
            }

            // Disabling castling when a piece is moved.
            if (logic.getPiece(game.fen, move.from) == "K")
                nextFen = logic.setCastleOptions(
                    nextFen,
                    logic.getCastleOptions(nextFen).replace("K", "").replace("Q", "")
                );
            if (logic.getPiece(game.fen, move.from) == "k")
                nextFen = logic.setCastleOptions(
                    nextFen,
                    logic.getCastleOptions(nextFen).replace("k", "").replace("q", "")
                );

            if (
                logic.getPiece(game.fen, move.from) == "R" &&
                move.from.rank == 0 &&
                move.from.file == 0
            )
                nextFen = logic.setCastleOptions(
                    nextFen,
                    logic.getCastleOptions(nextFen).replace("Q", "")
                );
            if (
                logic.getPiece(game.fen, move.from) == "R" &&
                move.from.rank == 0 &&
                move.from.file == 7
            )
                nextFen = logic.setCastleOptions(
                    nextFen,
                    logic.getCastleOptions(nextFen).replace("K", "")
                );
            if (
                logic.getPiece(game.fen, move.from) == "r" &&
                move.from.rank == 7 &&
                move.from.file == 0
            )
                nextFen = logic.setCastleOptions(
                    nextFen,
                    logic.getCastleOptions(nextFen).replace("q", "")
                );
            if (
                logic.getPiece(game.fen, move.from) == "r" &&
                move.from.rank == 7 &&
                move.from.file == 7
            )
                nextFen = logic.setCastleOptions(
                    nextFen,
                    logic.getCastleOptions(nextFen).replace("k", "")
                );

            nextFen = logic.setCurrentTurn(nextFen, nextTurn);

            if (logic.getPiece(game.fen, move.from) == "P" && move.to.rank == 7) {
                nextFen = logic.setBoard(
                    nextFen,
                    logic.setPiece(nextFen, move.to, "Q")
                );
                nextFen = logic.setBoard(
                    nextFen,
                    logic.setPiece(nextFen, move.from, "")
                );
            } else if (
                logic.getPiece(game.fen, move.from) == "p" &&
                move.to.rank == 0
            ) {
                nextFen = logic.setBoard(
                    nextFen,
                    logic.setPiece(nextFen, move.to, "q")
                );
                nextFen = logic.setBoard(
                    nextFen,
                    logic.setPiece(nextFen, move.from, "")
                );
            } else {
                nextFen = logic.setBoard(
                    nextFen,
                    logic.setPiece(nextFen, move.to, logic.getPiece(nextFen, move.from))
                );
                nextFen = logic.setBoard(
                    nextFen,
                    logic.setPiece(nextFen, move.from, "")
                );
            }

            if (move.doesEnPassant) {
                const enPassant = logic.cellStringToObject(logic.getEnPassant(nextFen));

                if (player.color === "w")
                    nextFen = logic.setBoard(
                        nextFen,
                        logic.setPiece(
                            nextFen,
                            {rank: enPassant.rank - 1, file: enPassant.file},
                            ""
                        )
                    );
                if (player.color === "b")
                    nextFen = logic.setBoard(
                        nextFen,
                        logic.setPiece(
                            nextFen,
                            {rank: enPassant.rank + 1, file: enPassant.file},
                            ""
                        )
                    );
            }

            if (move.enPassant)
                nextFen = logic.setEnPassant(
                    nextFen,
                    logic.cellObjectToString(move.enPassant)
                );
            else nextFen = logic.setEnPassant(nextFen, "-");

            if (nextTurn == "w")
                nextFen = logic.setFullmoveNumber(
                    nextFen,
                    logic.getFullmoveNumber(nextFen) + 1
                );

            game.fen = nextFen;

            database.putGame(game);

            const nextMoves = logic.getPossibleMoves(nextFen);

            if (nextMoves.length == 0) {
                let alternateNextFen = nextFen;

                alternateNextFen = logic.setCurrentTurn(alternateNextFen, currTurn);

                const alternateNextMoves = logic.getPossibleMoves(alternateNextFen);

                let checkmate = false;

                for (const alternateMove of alternateNextMoves)
                    if (
                        logic.getPiece(alternateNextFen, alternateMove.to) == "K" ||
                        logic.getPiece(alternateNextFen, alternateMove.to) == "k"
                    )
                        checkmate = true;

                if (checkmate) Player.updateOne({username: game.players.find(p => p.color === currTurn).name}, {$inc: {wins: 1}}, {}, (error, player) => {
                });
                console.log('Checkmate', game.players.find(p => p.color === currTurn).name);

                game.players.forEach((player) =>
                    player.socket.emit("gameover", {checkmate, winner: currTurn})
                );

                database.deleteGame(game.id);
            } else game.players.forEach((player) => player.socket.emit("state", {
                fen: game.fen,
                moves: nextMoves,
                turn: nextTurn
            }));
        });

        socket.on("chat", function (data) {
            const text = data.text.trim();
            const game = database.getGame(data.game);

            const player = game?.players.find((player) => player.name === socket.request.user.username);

            if (!player || !text) return;

            const name = player.name;

            game.players.forEach((player) =>
                player.socket?.emit("chat", {name, text})
            );
        });
    });
}
const io = require('socket.io');

const shared = require('./shared');
const logic  = require('./logic/logic');
const fenboard = require('./logic/fenboard');

module.exports = function(httpServer) {
	const server = new io.Server(httpServer);

	server.on('connection', function(socket) {

	    socket.on('join', function(data) {
	    	const code = data.code;
	    	const game = shared.database.getGame(data.game);

	    	if (!game) return;

	    	const playerIndex = game.players.findIndex(player => player.uuid === code);
	    	const player = game.players[playerIndex];

	    	if (playerIndex < 0) return;

			console.log(game);

	    	player.socket?.disconnect();
	    	player.socket = socket;

	    	game.players[playerIndex] = player;
	    	shared.database.putGame(game);

	    	socket.emit('setup', { color: player.color, name: player.name });

	    	if (game.players.length === game.maximum) {
				if (game.computer) {
					if (game.players[0].color !== 'w') {
						const currentFen = fenboard.parse2D(game.board);

						const computerMove = logic.findComputerMove(currentFen);
						currentFen.makeMove(computerMove);

						game.board = currentFen.fen;
						shared.database.putGame(game);
					}

					game.players[0].socket?.emit('opponent', { name: 'Computer' });

					const moves = logic.getPossibleMoves(fenboard.parse2D(game.board));

					game.players[0].socket.emit('state', { fen: game.board, moves, turn: fenboard.parse2D(game.board).turn });
				}
				else {
					game.players[0].socket?.emit('opponent', { name: game.players[1].name });
					game.players[1].socket?.emit('opponent', { name: game.players[0].name });

					const moves = logic.getPossibleMoves(fenboard.parse2D(game.board));

					game.players[0].socket.emit('state', { fen: game.board, moves, turn: fenboard.parse2D(game.board).turn });
					game.players[1].socket.emit('state', { fen: game.board, moves, turn: fenboard.parse2D(game.board).turn });
				}
	    	}
	    });

	    socket.on('move', function (data) {
	    	const code = data.code;
	    	const game = shared.database.getGame(data.game);

	    	const player = game?.players.find(player => player.uuid === code);

	    	if (!player) return;

			const currentFen = fenboard.parse2D(game.board);

	    	if (currentFen.turn !== player.color) return;

	    	const moves = logic.getPossibleMoves(currentFen);
	    	const move  = moves.find(other => 
	    		other.from.rank === data.move.from.rank &&
	    		other.from.file === data.move.from.file &&
	    		other.to.rank === data.move.to.rank &&
	    		other.to.file === data.move.to.file);

	    	if (!move) return;

	    	const currTurn = currentFen.turn;
	        const nextTurn = currentFen.turn === 'w' ? 'b' : 'w';

	        let nextFen = currentFen.clone();
			nextFen.makeMove(move);

	        game.board = nextFen.fen;
	        shared.database.putGame(game);

	        const nextMoves = logic.getPossibleMoves(nextFen);

	        if (nextMoves.length === 0) {
	        	let alternateNextFen = nextFen.clone();

	        	alternateNextFen.turn = currTurn;

	        	const alternateNextMoves = logic.getPossibleMoves(alternateNextFen);

	        	let checkmate = false;

	        	for (const alternateMove of alternateNextMoves)
	        		if (alternateNextFen.getPiece(alternateMove.to) === 'K' || alternateNextFen.getPiece(alternateMove.to) === 'k') checkmate = true;

				game.players.forEach(player => player.socket.emit('gameover', { checkmate, winner: currTurn }));
				return;
	        }

			if (game.computer) {
				const computerMove = logic.findComputerMove(nextFen);
				nextFen.makeMove(computerMove);

				game.board = nextFen.fen;
				shared.database.putGame(game);

				const nextMoves = logic.getPossibleMoves(nextFen);

				if (nextMoves.length === 0) {
					let alternateNextFen = nextFen.clone();

					alternateNextFen.turn = currTurn;

					const alternateNextMoves = logic.getPossibleMoves(alternateNextFen);

					let checkmate = false;

					for (const alternateMove of alternateNextMoves)
						if (alternateNextFen.getPiece(alternateMove.to) === 'K' || alternateNextFen.getPiece(alternateMove.to) === 'k') checkmate = true;

					game.players.forEach(player => player.socket.emit('gameover', { checkmate, winner: nextTurn }));
					return;
				}

				game.players.forEach(player => player.socket.emit('state', { fen: nextFen.fen, moves: nextMoves, turn: nextFen.turn }));
			}
	    	else game.players.forEach(player => player.socket.emit('state', { fen: nextFen.fen, moves: nextMoves, turn: nextFen.turn }));
	    });

		socket.on('chat', function (data) {
	    	const code = data.code;
	    	const text = data.text.trim();
	    	const game = shared.database.getGame(data.game);

	    	const player = game?.players.find(player => player.uuid === code);

	    	if (!player || !text) return;

	    	const name = player.name;

	    	game.players.forEach(player => player.socket?.emit('chat', { name, text }));
	    });
	});
}
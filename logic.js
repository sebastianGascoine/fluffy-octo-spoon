function getPossibleMoves(fen) {
	const moves = [];

	const currentTurn = getCurrentTurn(fen);

	for (let rank = 0; rank < 8; ++rank) {
		for (let file = 0; file < 8; ++file) {

			const cell = { rank: rank, file: file };

			const piece = getPiece(fen, cell);

			if (!piece) continue;

			if (currentTurn === 'w' && piece !== piece.toUpperCase()) continue;
			if (currentTurn === 'b' && piece !== piece.toLowerCase()) continue;

			if (piece.toUpperCase() === 'P') {
				if (currentTurn === 'w') {
					const move1 = { rank: cell.rank + 1, file: cell.file };
			        const move2 = { rank: cell.rank + 2, file: cell.file };

			        if (!getPiece(fen, move1)) {
			            moves.push({ from: cell, to: move1 });

			            if (!getPiece(fen, move2) && rank == 1) moves.push({ from: cell, to: move2 });
			        }

			        const attack1 = { rank: cell.rank + 1, file: cell.file - 1 };
			        const attack2 = { rank: cell.rank + 1, file: cell.file + 1 };

			        const attackPiece1 = getPiece(fen, attack1);
			        const attackPiece2 = getPiece(fen, attack2);

			        if (attackPiece1 && attackPiece1.toUpperCase() === attackPiece1) moves.push({ from: cell, to: attack1 });
			        if (attackPiece2 && attackPiece2.toUpperCase() === attackPiece2) moves.push({ from: cell, to: attack2 });
				}
				if (currentTurn === 'b') {
					const move1 = { rank: cell.rank - 1, file: cell.file };
			        const move2 = { rank: cell.rank - 2, file: cell.file };

			        if (!getPiece(fen, move1)) {
			            moves.push({ from: cell, to: move1 });

			            if (!getPiece(fen, move2) && rank == 1) moves.push({ from: cell, to: move2 });
			        }

			        const attack1 = { rank: cell.rank - 1, file: cell.file - 1 };
			        const attack2 = { rank: cell.rank - 1, file: cell.file + 1 };

			        const attackPiece1 = getPiece(fen, attack1);
			        const attackPiece2 = getPiece(fen, attack2);

			        if (attackPiece1 && attackPiece1.toLowerCase() === attackPiece1) moves.push({ from: cell, to: attack1 });
			        if (attackPiece2 && attackPiece2.toLowerCase() === attackPiece2) moves.push({ from: cell, to: attack2 });
				}
		    }
		}
	}

	return moves;
}

function getPiece(fen, cell) {
	if (cell.rank < 0 || cell.rank >= 8) return null;

	const board = getBoard(fen).split('/');

	const boardRank = board[8 - cell.rank - 1];

	for (let fileNumber = 0, fileIndex = 0; fileNumber < 8; ++fileIndex, ++fileNumber) {
		const number = parseInt(boardRank[fileIndex]);

		if (isNaN(number)) {
			if (fileNumber === cell.file) {
				return boardRank[fileIndex];
			}
			else continue;
		}

		fileNumber += number - 1;
	}

	return null;
}

function getBoard(fen) {
	return fen.split(' ')[0];
}

function getCurrentTurn(fen) {
	return fen.split(' ')[1];
}

function getCastleOptions(fen) {
	return fen.split(' ')[2];
}

function getEnPassant(fen) {
	return fen.split(' ')[3];
}

function getHalfmoveClock(fen) {
	return fen.split(' ')[4];
}

function getFullmoveNumber(fen) {
	return fen.split(' ')[5];
}

function setBoard(fen, data) {
	return [data, ...fen.split(' ').slice(1)].join(' ');
}

function setCurrentTurn(fen, data) {
	return [...fen.split(' ').slice(0, 1), data, ...fen.split(' ').slice(2)].join(' ');
}

function setCastleOptions(fen, data) {
	return [...fen.split(' ').slice(0, 2), data, ...fen.split(' ').slice(3)].join(' ');
}

function setEnPassant(fen, data) {
	return [...fen.split(' ').slice(0, 3), data, ...fen.split(' ').slice(4)].join(' ');
}

function setHalfmoveClock(fen, data) {
	return [...fen.split(' ').slice(0, 4), data, ...fen.split(' ').slice(5)].join(' ');
}

function setFullmoveNumber(fen, data) {
	return [...fen.split(' ').slice(0, 5), data].join(' ');
}

//code snippets typeracer
// at end, for each move, if king can be taken after making that move, that move is invalid
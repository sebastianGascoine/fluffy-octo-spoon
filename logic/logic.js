const fenboard = require('./fenboard');

const white = ['P', 'K', 'N', 'B', 'R', 'Q'];
const black = ['p', 'k', 'n', 'b', 'r', 'q'];

const values = {
	'p': 1,
	'k': 0,
	'n': 3,
	'b': 3,
	'r': 5,
	'q': 9
};

function getPossibleMoves(fen, detectCheck = true) {
	const moves = [];

	const enPassant = fenboard.cellStringToObject(fen.enPassant);

	for (let rank = 0; rank < 8; ++rank) {
		for (let file = 0; file < 8; ++file) {

			const cell = { rank, file };

			const piece = fen.getPiece(cell);

			if (!piece) continue;

			if (fen.turn === 'w' && piece !== piece.toUpperCase()) continue;
			if (fen.turn === 'b' && piece !== piece.toLowerCase()) continue;

			if (piece.toUpperCase() === 'P') {
				if (fen.turn === 'w') {
					const move1 = { rank: cell.rank + 1, file: cell.file };
			        const move2 = { rank: cell.rank + 2, file: cell.file };

			        if (!fen.getPiece(move1)) {
			            moves.push({ from: cell, to: move1 });

			            if (!fen.getPiece(move2) && rank === 1) moves.push({ from: cell, to: move2, enPassant: move1 });
			        }

			        const attack1 = { rank: cell.rank + 1, file: cell.file - 1 };
			        const attack2 = { rank: cell.rank + 1, file: cell.file + 1 };

			        const attackPiece1 = fen.getPiece(attack1);
			        const attackPiece2 = fen.getPiece(attack2);

			        if (attackPiece1 && attackPiece1.toLowerCase() === attackPiece1) moves.push({ from: cell, to: attack1 });
			        else if (enPassant && enPassant.rank === attack1.rank && enPassant.file === attack1.file) moves.push({ from: cell, to: attack1, doesEnPassant: true });

			        if (attackPiece2 && attackPiece2.toLowerCase() === attackPiece2) moves.push({ from: cell, to: attack2 });
			    	else if (enPassant && enPassant.rank === attack2.rank && enPassant.file === attack2.file) moves.push({ from: cell, to: attack2, doesEnPassant: true });
				}
				if (fen.turn === 'b') {
					const move1 = { rank: cell.rank - 1, file: cell.file };
			        const move2 = { rank: cell.rank - 2, file: cell.file };

			        if (!fen.getPiece(move1)) {
			            moves.push({ from: cell, to: move1 });

			            if (!fen.getPiece(move2) && rank === 6) moves.push({ from: cell, to: move2, enPassant: move1 });
			        }

			        const attack1 = { rank: cell.rank - 1, file: cell.file - 1 };
			        const attack2 = { rank: cell.rank - 1, file: cell.file + 1 };

			        const attackPiece1 = fen.getPiece(attack1);
			        const attackPiece2 = fen.getPiece(attack2);

			        if (attackPiece1 && attackPiece1.toUpperCase() === attackPiece1) moves.push({ from: cell, to: attack1 });
			        else if (enPassant && enPassant.rank === attack1.rank && enPassant.file === attack1.file) moves.push({ from: cell, to: attack1, doesEnPassant: true });

			        if (attackPiece2 && attackPiece2.toUpperCase() === attackPiece2) moves.push({ from: cell, to: attack2 });
			        else if (enPassant && enPassant.rank === attack2.rank && enPassant.file === attack2.file) moves.push({ from: cell, to: attack2, doesEnPassant: true });
				}
		    }

		    if (piece.toUpperCase() === 'K') {
		        const nearbyCells = [];

		        nearbyCells.push({ rank: rank, file: file - 1 });
		        nearbyCells.push({ rank: rank, file: file + 1 });
		        nearbyCells.push({ rank: rank + 1, file: file });
		        nearbyCells.push({ rank: rank - 1, file: file });
		        nearbyCells.push({ rank: rank + 1, file: file - 1 });
		        nearbyCells.push({ rank: rank - 1, file: file - 1 });
		        nearbyCells.push({ rank: rank + 1, file: file + 1 });
		        nearbyCells.push({ rank: rank - 1, file: file + 1 });

		        if (fen.castleOptions.includes('K') && fen.turn === 'w') {
		        	if (!fen.getPiece({ rank: 0, file: 5 }) && !fen.getPiece({ rank: 0, file: 6 })) moves.push({ from: cell, to: { rank: 0, file: 6 }, castle: 'K' });
		        }
		        if (fen.castleOptions.includes('k') && fen.turn === 'b') {
		        	if (!fen.getPiece({ rank: 7, file: 5 }) && !fen.getPiece({ rank: 7, file: 6 })) moves.push({ from: cell, to: { rank: 7, file: 6 }, castle: 'k' });
		        }
		        if (fen.castleOptions.includes('Q') && fen.turn === 'w') {
		        	if (!fen.getPiece({ rank: 0, file: 1 }) && !fen.getPiece({ rank: 0, file: 2 }) && !fen.getPiece({ rank: 0, file: 3 })) moves.push({ from: cell, to: { rank: 0, file: 1 }, castle: 'Q' });
		        }
		        if (fen.castleOptions.includes('q') && fen.turn === 'b') {
		        	if (!fen.getPiece({ rank: 7, file: 1 }) && !fen.getPiece({ rank: 7, file: 2 }) && !fen.getPiece({ rank: 7, file: 3 })) moves.push({ from: cell, to: { rank: 7, file: 1 }, castle: 'q' });
		        }

		        for (const nearbyCell of nearbyCells) {
		        	if (nearbyCell.rank < 0 || nearbyCell.rank >= 8 || nearbyCell.file < 0 || nearbyCell.file >= 8) continue;

		        	const nearbyPiece = fen.getPiece(nearbyCell);

		        	if (nearbyPiece && !areEnemies(nearbyPiece, piece)) continue;

		            moves.push({ from: cell, to: nearbyCell });
		        }
		    }

		    if (piece.toUpperCase() === 'N') {
		    	const nearbyCells = [];

		        nearbyCells.push({ rank: rank + 1, file: file - 2 }); // W
		        nearbyCells.push({ rank: rank - 1, file: file - 2 }); // W

		        nearbyCells.push({ rank: rank + 1, file: file + 2 }); // E
		        nearbyCells.push({ rank: rank - 1, file: file + 2 }); // E

		        nearbyCells.push({ rank: rank + 2, file: file + 1 }); // N
		        nearbyCells.push({ rank: rank + 2, file: file - 1 }); // N

		        nearbyCells.push({ rank: rank - 2, file: file + 1 }); // S
		        nearbyCells.push({ rank: rank - 2, file: file - 1 }); // S

		        for (const nearbyCell of nearbyCells) {
		        	if (nearbyCell.rank < 0 || nearbyCell.rank >= 8 || nearbyCell.file < 0 || nearbyCell.file >= 8) continue;

		        	const nearbyPiece = fen.getPiece(nearbyCell);

		        	if (nearbyPiece && !areEnemies(nearbyPiece, piece)) continue;

		            moves.push({ from: cell, to: nearbyCell });
		        }
		    }

		    if (piece.toUpperCase() === 'R') {
		        for (let nextRank = rank - 1; nextRank >= 0; nextRank--) {
		            const blockingPiece = fen.getPiece({ rank: nextRank, file });

		            if (blockingPiece) {
		                if (areEnemies(piece, blockingPiece)) moves.push({ from: cell, to: { rank: nextRank, file } });
		                break;
		            }

		            moves.push({ from: cell, to: { rank: nextRank, file } });
		        }

		        for (let nextFile = file - 1; nextFile >= 0; nextFile--) {
		            const blockingPiece = fen.getPiece({ rank, file: nextFile });

		            if (blockingPiece) {
		                if (areEnemies(piece, blockingPiece)) moves.push({ from: cell, to: { rank, file: nextFile } });
		                break;
		            }

		            moves.push({ from: cell, to: { rank, file: nextFile } });
		        }

		        for (let nextRank = rank + 1; nextRank < 8; nextRank++) {
		            const blockingPiece = fen.getPiece({ rank: nextRank, file });

		            if (blockingPiece) {
		                if (areEnemies(piece, blockingPiece)) moves.push({ from: cell, to: { rank: nextRank, file } });
		                break;
		            }

		            moves.push({ from: cell, to: { rank: nextRank, file } });
		        }

		        for (let nextFile = file + 1; nextFile < 8; nextFile++) {
		            const blockingPiece = fen.getPiece({ rank, file: nextFile });

		            if (blockingPiece) {
		                if (areEnemies(piece, blockingPiece)) moves.push({ from: cell, to: { rank, file: nextFile } });
		                break;
		            }

		            moves.push({ from: cell, to: { rank, file: nextFile } });
		        }
		    }

		    if (piece.toUpperCase() === 'B') {
		        for (let nextRank = rank - 1, nextFile = file - 1; nextRank >= 0 && nextFile >= 0; nextRank--, nextFile--) {
		            const blockingPiece = fen.getPiece({ rank: nextRank, file: nextFile });

		            if (blockingPiece) {
		                if (areEnemies(piece, blockingPiece)) moves.push({ from: cell, to: { rank: nextRank, file: nextFile } });
		                break;
		            }

		            moves.push({ from: cell, to: { rank: nextRank, file: nextFile } });
		        }

		        for (let nextRank = rank + 1, nextFile = file + 1; nextRank < 8 && nextFile < 8; nextRank++, nextFile++) {
		            const blockingPiece = fen.getPiece({ rank: nextRank, file: nextFile });

		            if (blockingPiece) {
		                if (areEnemies(piece, blockingPiece)) moves.push({ from: cell, to: { rank: nextRank, file: nextFile } });
		                break;
		            }

		            moves.push({ from: cell, to: { rank: nextRank, file: nextFile } });
		        }

		        for (let nextRank = rank + 1, nextFile = file - 1; nextRank < 8 && nextFile >= 0; nextRank++, nextFile--) {
		            const blockingPiece = fen.getPiece({ rank: nextRank, file: nextFile });

		            if (blockingPiece) {
		                if (areEnemies(piece, blockingPiece)) moves.push({ from: cell, to: { rank: nextRank, file: nextFile } });
		                break;
		            }

		            moves.push({ from: cell, to: { rank: nextRank, file: nextFile } });
		        }

		        for (let nextRank = rank - 1, nextFile = file + 1; nextRank >= 0 && nextFile < 8; nextRank--, nextFile++) {
		            const blockingPiece = fen.getPiece({ rank: nextRank, file: nextFile });

		            if (blockingPiece) {
		                if (areEnemies(piece, blockingPiece)) moves.push({ from: cell, to: { rank: nextRank, file: nextFile } });
		                break;
		            }

		            moves.push({ from: cell, to: { rank: nextRank, file: nextFile } });
		        }
		    }

		    if (piece.toUpperCase() === 'Q') {
		    	for (let nextRank = rank - 1; nextRank >= 0; nextRank--) {
		            const blockingPiece = fen.getPiece({ rank: nextRank, file });

		            if (blockingPiece) {
		                if (areEnemies(piece, blockingPiece)) moves.push({ from: cell, to: { rank: nextRank, file } });
		                break;
		            }

		            moves.push({ from: cell, to: { rank: nextRank, file } });
		        }

		        for (let nextFile = file - 1; nextFile >= 0; nextFile--) {
		            const blockingPiece = fen.getPiece({ rank, file: nextFile });

		            if (blockingPiece) {
		                if (areEnemies(piece, blockingPiece)) moves.push({ from: cell, to: { rank, file: nextFile } });
		                break;
		            }

		            moves.push({ from: cell, to: { rank, file: nextFile } });
		        }

		        for (let nextRank = rank + 1; nextRank < 8; nextRank++) {
		            const blockingPiece = fen.getPiece({ rank: nextRank, file });

		            if (blockingPiece) {
		                if (areEnemies(piece, blockingPiece)) moves.push({ from: cell, to: { rank: nextRank, file } });
		                break;
		            }

		            moves.push({ from: cell, to: { rank: nextRank, file } });
		        }

		        for (let nextFile = file + 1; nextFile < 8; nextFile++) {
		            const blockingPiece = fen.getPiece({ rank, file: nextFile });

		            if (blockingPiece) {
		                if (areEnemies(piece, blockingPiece)) moves.push({ from: cell, to: { rank, file: nextFile } });
		                break;
		            }

		            moves.push({ from: cell, to: { rank, file: nextFile } });
		        }

		        for (let nextRank = rank - 1, nextFile = file - 1; nextRank >= 0 && nextFile >= 0; nextRank--, nextFile--) {
		            const blockingPiece = fen.getPiece({ rank: nextRank, file: nextFile });

		            if (blockingPiece) {
		                if (areEnemies(piece, blockingPiece)) moves.push({ from: cell, to: { rank: nextRank, file: nextFile } });
		                break;
		            }

		            moves.push({ from: cell, to: { rank: nextRank, file: nextFile } });
		        }

		        for (let nextRank = rank + 1, nextFile = file + 1; nextRank < 8 && nextFile < 8; nextRank++, nextFile++) {
		            const blockingPiece = fen.getPiece({ rank: nextRank, file: nextFile });

		            if (blockingPiece) {
		                if (areEnemies(piece, blockingPiece)) moves.push({ from: cell, to: { rank: nextRank, file: nextFile } });
		                break;
		            }

		            moves.push({ from: cell, to: { rank: nextRank, file: nextFile } });
		        }

		        for (let nextRank = rank + 1, nextFile = file - 1; nextRank < 8 && nextFile >= 0; nextRank++, nextFile--) {
		            const blockingPiece = fen.getPiece({ rank: nextRank, file: nextFile });

		            if (blockingPiece) {
		                if (areEnemies(piece, blockingPiece)) moves.push({ from: cell, to: { rank: nextRank, file: nextFile } });
		                break;
		            }

		            moves.push({ from: cell, to: { rank: nextRank, file: nextFile } });
		        }

		        for (let nextRank = rank - 1, nextFile = file + 1; nextRank >= 0 && nextFile < 8; nextRank--, nextFile++) {
		            const blockingPiece = fen.getPiece({ rank: nextRank, file: nextFile });

		            if (blockingPiece) {
		                if (areEnemies(piece, blockingPiece)) moves.push({ from: cell, to: { rank: nextRank, file: nextFile } });
		                break;
		            }

		            moves.push({ from: cell, to: { rank: nextRank, file: nextFile } });
		        }
		    }
		}
	}

	const finalMoves = [];

	// HANDLING CHECK.
	for (let move of moves) {
		if (!detectCheck) {
			finalMoves.push(move);
			continue;
		}

		let appliedFen = fen.clone();
		appliedFen.makeMove(move);

        let validMove = true;

        const resultingMoves = getPossibleMoves(appliedFen, false);

        for (let resultingMove of resultingMoves) {
        	if (fen.turn === 'w' && appliedFen.getPiece(resultingMove.to) === 'K') validMove = false;
        	if (fen.turn === 'b' && appliedFen.getPiece(resultingMove.to) === 'k') validMove = false;
        }

        if (validMove) finalMoves.push(move);
	}

	return finalMoves;
}

function findComputerMove(fen) {
	return evalNextBestMove(fen, 2);
}

function evalNextBestMove(fen, ply) {
	let moves = getPossibleMoves(fen).map(move => ({ move, value: Math.random() })).sort((a, b) => a.value - b.value).map(o => o.move);

	if (!moves) return;

	if (ply === 0) {
		for (let move of moves) {
			const appliedFen = fen.clone();
			appliedFen.makeMove(move);

			move.score = boardValue(appliedFen);
		}

		if (fen.turn === 'w') moves.sort((b, a) => a.score - b.score);
		if (fen.turn === 'b') moves.sort((a, b) => a.score - b.score);

		return moves[0];
	}

	for (let move of moves) {
		const appliedFen = fen.clone();
		appliedFen.makeMove(move);

		const bestNext = evalNextBestMove(appliedFen, ply - 1);

		if (!bestNext) {
			if (fen.turn === 'w') move.score = -1000000;
			if (fen.turn === 'b') move.score =  1000000;
		}
		move.score = bestNext.score;
	}

	if (fen.turn === 'w') moves.sort((b, a) => a.score - b.score);
	if (fen.turn === 'b') moves.sort((a, b) => a.score - b.score);

	return moves[0];
}

function evalNextBestMove2(node, depth, a, b) {
	const moves = getPossibleMoves(node.fen);

	if (depth === 0 || !moves) return node;

	if (node.fen.turn === 'w') {
		let bestChild = { value: Number.NEGATIVE_INFINITY };

		for (let move of moves) {
			const moveFen = node.fen.clone();
			moveFen.makeMove(move);

			const moveValue = boardValue(moveFen);
			evalNextBestMove2({ fen: node.fen, move, value: moveValue }, )

			if (bestChild.value < moveValue) {
				bestChild = { fen: node.fen, move, value: moveValue };
			}

			if (bestChild.value >= b) break;

			a = Math.max(a, bestChild.value);
		}
		return bestChild;
	}
	else {
		let bestChild = { value: Number.POSITIVE_INFINITY };

		for (let move of moves) {
			const moveFen = node.fen.clone();
			moveFen.makeMove(move);

			const moveValue = boardValue(moveFen)

			if (bestChild.value > moveValue) {
				bestChild = { fen: node.fen, move, value: moveValue };
			}

			if (bestChild.value <= a) break;

			b = Math.min(a, bestChild.value);
		}
		return bestChild;
	}
}

// positive = better for white
function boardValue(fen) {
	let wScore = 0;
	let bScore = 0;

	for (let rank = 0; rank < 8; ++rank) {
		for (let file = 0; file < 8; ++file) {
			const piece = fen.getPiece({ rank, file });

			if (!piece) continue;

			if (piece === piece.toUpperCase()) wScore += values[piece.toLowerCase()];
			if (piece === piece.toLowerCase()) bScore += values[piece.toLowerCase()];
		}
	}

	return wScore - bScore;
}

function areEnemies(piece1, piece2) {
	return (white.includes(piece1) && black.includes(piece2)) || (black.includes(piece1) && white.includes(piece2));
}

module.exports.getPossibleMoves = getPossibleMoves;
module.exports.findComputerMove = findComputerMove;
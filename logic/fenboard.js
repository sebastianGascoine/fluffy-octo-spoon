module.exports.parse2D = function(fen) {
    return new FenBoard2D(fen);
}

const ranks = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const files = ['1', '2', '3', '4', '5', '6', '7', '8'];

module.exports.cellStringToObject = function(cell) {
    if (cell === '-') return null;

    const rankString = cell[0];
    const fileString = cell[1];

    return { rank: ranks.indexOf(rankString), file: files.indexOf(fileString) };
}

module.exports.cellObjectToString = function(cell) {
    if (!cell) return null;

    const rankString = ranks[cell.rank];
    const fileString = files[cell.file];

    return rankString + fileString;
}

class FenBoard2D {

    constructor(fen) {
        this.fen = fen;
    }

    getPiece(cell) {
        if (cell.rank < 0 || cell.rank >= 8) return null;
        //console.log(cell.rank);
        const board = this.board.split('/');

        const boardRank = board[8 - parseInt(cell.rank) - 1];
        //for (var i = 0; i < boardRank.length; i++) { if(!isNaN(boardRank[i])){console.log(boardRank[i]);} }
        //console.log('---------------------');
        /* found issue  cant parseInt a letter */

        for (let fileNumber = 0, fileIndex = 0; fileNumber < 8; ++fileIndex, ++fileNumber) {
            const number = Number(boardRank[fileIndex]);

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

    get board() {
        return this.fen.split(' ')[0];
    }

    get turn() {
        return this.fen.split(' ')[1];
    }

    get castleOptions() {
        return this.fen.split(' ')[2];
    }

    get enPassant() {
        return this.fen.split(' ')[3];
    }

    get halfmoveClock() {
        return parseInt(this.fen.split(' ')[4]);
    }

    get fullmoveNumber() {
        return parseInt(this.fen.split(' ')[5]);
    }

    clone() {
        return new FenBoard2D(this.fen);
    }

    setPiece(cell, piece) {
        if (cell.rank < 0 || cell.rank >= 8) return null;

        let board = [];

        for (let boardLine of this.board.split('/')) {
            const rank = [];

            for (let i = 0; i < boardLine.length; ++i) {
                const number = parseInt(boardLine[i]);

                if (isNaN(number)) rank.push(boardLine[i]);
                else for (let j = 0; j < number; ++j) rank.push(' ');
            }

            board = [rank, ...board];
        }
        /*another issue not sure why*/
        board[cell.rank][cell.file] = piece ? piece : ' ';

        let reconstructBoard = [];

        for (let rank of board) {
            let reconstructRank = rank.join('');

            reconstructRank = reconstructRank
                .replaceAll('        ', '8')
                .replaceAll('       ', '7')
                .replaceAll('      ', '6')
                .replaceAll('     ', '5')
                .replaceAll('    ', '4')
                .replaceAll('   ', '3')
                .replaceAll('  ', '2')
                .replaceAll(' ', '1');

            reconstructBoard = [reconstructRank, ...reconstructBoard];
        }

        this.board = reconstructBoard.join('/');
    }

    set board(board) {
        this.fen = [board, ...this.fen.split(' ').slice(1)].join(' ');
    }

    set turn(currentTurn) {
        this.fen = [...this.fen.split(' ').slice(0, 1), currentTurn, ...this.fen.split(' ').slice(2)].join(' ');
    }

    set castleOptions(castleOptions) {
        this.fen = [...this.fen.split(' ').slice(0, 2), castleOptions, ...this.fen.split(' ').slice(3)].join(' ');
    }

    set enPassant(enPassant) {
        this.fen = [...this.fen.split(' ').slice(0, 3), enPassant, ...this.fen.split(' ').slice(4)].join(' ');
    }

    set halfmoveClock(halfmoveClock) {
        this.fen = [...this.fen.split(' ').slice(0, 4), halfmoveClock, ...this.fen.split(' ').slice(5)].join(' ');
    }

    set fullmoveNumber(fullmoveNumber) {
        this.fen = [...this.fen.split(' ').slice(0, 5), fullmoveNumber].join(' ');
    }

    makeMove(move) {
        let nextFen = this.clone();

        nextFen.turn = this.turn === 'w' ? 'b' : 'w';

        if (move.castle === 'K') {
            nextFen.setPiece({ rank: 0, file: 5 }, 'R');
            nextFen.setPiece({ rank: 0, file: 7 }, '' );
        }
        if (move.castle === 'k') {
            nextFen.setPiece({ rank: 7, file: 5 }, 'r');
            nextFen.setPiece({ rank: 7, file: 7 }, '' );
        }
        if (move.castle === 'Q') {
            nextFen.setPiece({ rank: 0, file: 2 }, 'R');
            nextFen.setPiece({ rank: 0, file: 0 }, '' );
        }
        if (move.castle === 'q') {
            nextFen.setPiece({ rank: 7, file: 2 }, 'r');
            nextFen.setPiece({ rank: 7, file: 0 }, '' );
        }

        // Disabling castling when a piece is moved.
        if (this.getPiece(move.from) === 'K') nextFen.castleOptions = nextFen.castleOptions.replace('K', '').replace('Q', '');
        if (this.getPiece(move.from) === 'k') nextFen.castleOptions = nextFen.castleOptions.replace('k', '').replace('q', '');

        if (this.getPiece(move.from) === 'R' && move.from.rank === 0 && move.from.file === 0) nextFen.castleOptions = nextFen.castleOptions.replace('Q', '');
        if (this.getPiece(move.from) === 'R' && move.from.rank === 0 && move.from.file === 7) nextFen.castleOptions = nextFen.castleOptions.replace('K', '');
        if (this.getPiece(move.from) === 'r' && move.from.rank === 7 && move.from.file === 0) nextFen.castleOptions = nextFen.castleOptions.replace('q', '');
        if (this.getPiece(move.from) === 'r' && move.from.rank === 7 && move.from.file === 7) nextFen.castleOptions = nextFen.castleOptions.replace('k', '');

        if (this.getPiece(move.from) === 'P' && move.to.rank === 7) {
            nextFen.setPiece(move.to, 'Q');
            nextFen.setPiece(move.from, '');
        }
        else if (this.getPiece(move.from) === 'p' && move.to.rank === 0) {
            nextFen.setPiece(move.to, 'q');
            nextFen.setPiece(move.from, '');
        }
        else {
            nextFen.setPiece(move.to, nextFen.getPiece(move.from));
            nextFen.setPiece(move.from, '');
        }

        if (move.doesEnPassant) {
            const enPassant = module.exports.cellStringToObject(nextFen.enPassant);

            if (this.turn === 'w') nextFen.setPiece({ rank: enPassant.rank - 1, file: enPassant.file }, '');
            if (this.turn === 'b') nextFen.setPiece({ rank: enPassant.rank + 1, file: enPassant.file }, '');
        }

        if (move.enPassant) nextFen.enPassant = module.exports.cellObjectToString(move.enPassant);
        else nextFen.enPassant = '-';

        if (nextFen.turn === 'w') nextFen.fullmoveNumber = nextFen.fullmoveNumber + 1;

        this.fen = nextFen.fen;
    }
}


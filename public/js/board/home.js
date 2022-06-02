const ranks = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const files = ['1', '2', '3', '4', '5', '6', '7', '8'];

const params = new URLSearchParams(location.search);
const socket = io('/game');

let better = false;
let color;
let colorFull;
let state;
let names = [];

socket.on('setup', function (data) {
    color = data.color;
    colorFull = color === 'w' ? 'white' : 'black';

    if (color === 'w') {
        for (let rank = ranks.length - 1; rank >= 0; --rank) {
            const row = $('<tr></tr>').appendTo('#board');

            for (let file = 0; file < files.length; ++file)
                createCell(row, rank, file);
        }
    }
    if (color === 'b') {
        for (let rank = 0; rank < ranks.length; ++rank) {
            const row = $('<tr></tr>').appendTo('#board');

            for (let file = files.length - 1; file >= 0; --file)
                createCell(row, rank, file);
        }
    }

    names[0] = data.name;
    $('#player1').text(names[0]);
});

socket.on('opponent', function (data) {
    names[1] = data.name;
    $('#player2').text(names[1]);
});

socket.on('state', function (data) {
    console.log('Received state update');

    state = data;
    fenToBoard(state.fen);

    $('#fen').text(state.fen);

    if (state.turn !== color) {
        $(`.piece[chess-color=${colorFull}]`).draggable('disable');
        $('#player1').text(names[0]);
        $('#player2').text(names[1] + ' (Their Turn)');
    } else {
        $(`.piece[chess-color=${colorFull}]`).draggable('enable');
        $('#player1').text(names[0] + ' (Your Turn)');
        $('#player2').text(names[1]);
    }
});

socket.on('chat', function (data) {
    console.log('Received chat');

    $('#chat_view').append(`<p><b>${data.name}</b>: ${data.text}</p>`);
    $('#chat_view').prop('scrollTop', $('#chat_view').prop('scrollHeight'));
});

$(document).ready(function () {
    $('#export').click(exportgame);

    $('#back').click(() => window.location = '/');

    $('#chat_input').keypress(function (event) {
        if (event.key !== 'Enter') return;

        const text = $('#chat_input').val().trim();

        if (!text) return;

        socket.emit('chat', {
            game: params.get('game'),
            text,
        });

        $('#chat_input').val('');
    });

    socket.emit('join', {game: params.get('game')});
});

function createCell(row, rank, file) {
    const cell = $(`<td class='cell'></td>`).appendTo(row);

    const location = getLocation(rank, file);

    $(cell).prop('id', location);

    $(cell).append('<span class="cell_background"></span>');

    $(cell).droppable({
        tolerance: 'pointer',
        activate: function (event, ui) {
            const pieceLocation = $(ui.draggable).attr('chess-location');

            const pieceRank = ranks.indexOf(pieceLocation[0]);
            const pieceFile = files.indexOf(pieceLocation[1]);

            for (const move of state.moves.filter(
                (move) => move.from.rank == pieceRank && move.from.file == pieceFile
            )) {
                $('#' + getLocation(move.to.rank, move.to.file))
                    .children('.cell_background')
                    .css('background-color', '#00000080');
            }
        },
        deactivate: function (event, ui) {
            $('.cell').children('.cell_background').css('background-color', '');
        },
        drop: function (event, ui) {
            const pieceLocation = $(ui.draggable).attr('chess-location');

            const pieceRank = ranks.indexOf(pieceLocation[0]);
            const pieceFile = files.indexOf(pieceLocation[1]);

            const from = {rank: pieceRank, file: pieceFile};
            const to = {rank: rank, file: file};

            setTimeout(
                () =>
                    socket.emit('move', {
                        game: params.get('game'),
                        move: {from, to},
                    }),
                1
            );

            $(cell).children('.piece').remove();

            $('.cell')
                .children('.cell_background')
                .css('border', '')
                .css('background-color', '');
            $(ui.draggable)
                .attr('chess-location', location)
                .css('left', '')
                .css('top', '')
                .appendTo(cell);
        },
        over: function () {
            $(cell).children('.cell_background').css('border', '4px solid #000000A0');
        },
        out: function () {
            $(cell).children('.cell_background').css('border', '');
        },
        accept: function (element) {
            const pieceLocation = $(element).attr('chess-location');

            const pieceRank = ranks.indexOf(pieceLocation[0]);
            const pieceFile = files.indexOf(pieceLocation[1]);

            return state.moves.find(
                (move) =>
                    move.from.rank == pieceRank &&
                    move.from.file == pieceFile &&
                    move.to.rank == rank &&
                    move.to.file == file
            );
        },
    });
}

function getLocation(rank, file) {
    if (rank < 0 || rank >= ranks.length) return null;
    if (file < 0 || file >= files.length) return null;

    const rankName = ranks[rank];
    const fileName = files[file];

    return rankName + fileName;
}

function fenToBoard(fen, force = false) {
    let board = [];

    for (let boardLine of getBoard(fen).split('/')) {
        const rank = [];

        for (let i = 0; i < boardLine.length; ++i) {
            const number = parseInt(boardLine[i]);

            if (isNaN(number)) rank.push(boardLine[i]);
            else for (let j = 0; j < number; ++j) rank.push(' ');
        }

        board = [rank, ...board];
    }

    for (let rank = 0; rank < ranks.length; ++rank) {
        for (let file = 0; file < files.length; ++file) {
            const piece = board[rank][file];

            if (piece === 'R') {
                //rook
                placePiece('rook', 'white', getLocation(rank, file), force);
            } else if (piece === 'N') {
                //knight
                placePiece('knight', 'white', getLocation(rank, file), force);
            } else if (piece === 'B') {
                //bishop
                placePiece('bishop', 'white', getLocation(rank, file), force);
            } else if (piece === 'Q') {
                //queen
                placePiece('queen', 'white', getLocation(rank, file), force);
            } else if (piece === 'K') {
                //king
                placePiece('king', 'white', getLocation(rank, file), force);
            } else if (piece === 'P') {
                //pawn
                placePiece('pawn', 'white', getLocation(rank, file), force);
            } else if (piece === 'r') {
                //rook
                placePiece('rook', 'black', getLocation(rank, file), force);
            } else if (piece === 'n') {
                //knight
                placePiece('knight', 'black', getLocation(rank, file), force);
            } else if (piece === 'b') {
                //bishop
                placePiece('bishop', 'black', getLocation(rank, file), force);
            } else if (piece === 'q') {
                //queen
                placePiece('queen', 'black', getLocation(rank, file), force);
            } else if (piece === 'k') {
                //king
                placePiece('king', 'black', getLocation(rank, file), force);
            } else if (piece === 'p') {
                //pawn
                placePiece('pawn', 'black', getLocation(rank, file), force);
            } else {
                $('#' + getLocation(rank, file))
                    .find('.piece')
                    .remove();
            }
        }
    }

    console.log(fen);
}

function exportgame() {
    try {
        Swal.fire({
            title: 'Done!',
            text: state.fen,
            icon: 'success',
            confirmButtonText: 'Cool',
            background: '#000',
        });
    } catch (err) {
        console.log(err);
    }
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
    return parseInt(fen.split(' ')[4]);
}

function getFullmoveNumber(fen) {
    return parseInt(fen.split(' ')[5]);
}

function placePiece(name, color, location, force = false) {
    const currentPiece = $('#' + location + ' img');

    if (
        !force &&
        currentPiece.attr('chess-name') == name &&
        currentPiece.attr('chess-color') == color
    )
        return;

    $('#' + location)
        .find('.piece')
        .remove();

    const folder = better ? 'better' : 'default';
    const extension = better ? 'png' : 'svg';

    const piece = $(
        `<img src='../chess_pieces/${folder}/${name}_${color}.${extension}' chess-name='${name}' chess-color='${color}' chess-location='${location}' class='piece' draggable='false'>`
    )
        .mouseenter(function (event) {
            if (color != colorFull) return;
            $(this).css('filter', `drop-shadow(black 0px 0px 3px)`);
        })
        .mouseleave(function (event) {
            if (color != colorFull) return;
            $(this).css('filter', '');
        });

    if (color == colorFull)
        piece.draggable({revert: 'invalid', containment: '#board'});

    piece.appendTo('#' + location);
}

function betterimg() {
    if (!state) return;

    better = !better;
    fenToBoard(state.fen, true);
    console.log('found image changer');
}

socket.on('gameover', function (data) {
    $('#player1').text(names[0]);
    $('#player2').text(names[1]);

    state.moves = [];
    state.turn = color == 'w' ? 'b' : 'w';

    if (data.checkmate) {
        if (color == data.winner) {
            Swal.fire({
                title: 'Done!',
                text: 'You Win!',
                icon: 'success',
                confirmButtonText: 'Okay',
                background: '#000',
            }).then(() => window.location = '/');
        } else {
            Swal.fire({
                title: 'Checkmate!',
                text: 'You Lose!',
                icon: 'error',
                confirmButtonText: 'Okay',
                background: '#000',
            }).then(() => window.location = '/');
        }
    } else {
        Swal.fire({
            title: 'Stalemate!',
            text: 'Stalemate!',
            icon: 'info',
            confirmButtonText: 'Cool',
            background: '#000',
        });
    }
});

// ----------------------------------

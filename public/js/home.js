const rows = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];
const cols = [ '8', '7', '6', '5', '4', '3', '2', '1' ];

$(document).ready(function() {
    let index = 0;

    for (let r = 0; r < 8; ++r) {
        const row = $('<tr></tr>').appendTo('#board');

        for (let r = 0; r < 8; ++r) {
            const cell = $(`<td class="cell"></td>`).appendTo(row);

            const locationRowNumber = Math.floor(index % 8);
            const locationColNumber = Math.floor(index / 8);

            const locationRow = rows[locationRowNumber];
            const locationCol = cols[locationColNumber];

            const location = locationRow + locationCol;

            $(cell).prop("id", location);

            $(cell).append('<span class="cell_number">' + location + '</span>');

            $(cell).droppable({
                tolerance: 'pointer',
                drop: function(event, ui) {
                    $(cell).css('background-color', '');
                    $(ui.draggable).css('left', 0).css('top', 0).appendTo(cell);

                    $("#moves").prepend('<p>' + location + '</p>')
                },
                over: function() {
                    $(cell).css('background-color', 'blue');
                },
                out: function() {
                    $(cell).css('background-color', '');
                },
                accept: function() {
                    return !$(cell).children('.piece').length;
                }
            });

            index++;
        }
    }

  {
    $('<img src="chess_pieces/pawn_white.png" alt="pawn" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#a2');
    $('<img src="chess_pieces/pawn_white.png" alt="pawn" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#b2');
    $('<img src="chess_pieces/pawn_white.png" alt="pawn" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#c2');
    $('<img src="chess_pieces/pawn_white.png" alt="pawn" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#d2');
    $('<img src="chess_pieces/pawn_white.png" alt="pawn" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#e2');
    $('<img src="chess_pieces/pawn_white.png" alt="pawn" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#f2');
    $('<img src="chess_pieces/pawn_white.png" alt="pawn" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#g2');
    $('<img src="chess_pieces/pawn_white.png" alt="pawn" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#h2');

    $('<img src="chess_pieces/rook_white.png"   alt="rook"   class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#a1');
    $('<img src="chess_pieces/knight_white.png" alt="knight" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#b1');
    $('<img src="chess_pieces/bishop_white.png" alt="bishop" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#c1');
    $('<img src="chess_pieces/queen_white.png"  alt="queen"  class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#d1');
    $('<img src="chess_pieces/king_white.png"   alt="king"   class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#e1');
    $('<img src="chess_pieces/bishop_white.png" alt="bishop" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#f1');
    $('<img src="chess_pieces/knight_white.png" alt="knight" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#g1');
    $('<img src="chess_pieces/rook_white.png"   alt="rook"   class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#h1');
  }
  {
    $('<img src="chess_pieces/pawn.png" alt="pawn" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#a7');
    $('<img src="chess_pieces/pawn.png" alt="pawn" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#b7');
    $('<img src="chess_pieces/pawn.png" alt="pawn" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#c7');
    $('<img src="chess_pieces/pawn.png" alt="pawn" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#d7');
    $('<img src="chess_pieces/pawn.png" alt="pawn" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#e7');
    $('<img src="chess_pieces/pawn.png" alt="pawn" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#f7');
    $('<img src="chess_pieces/pawn.png" alt="pawn" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#g7');
    $('<img src="chess_pieces/pawn.png" alt="pawn" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#h7');

    $('<img src="chess_pieces/rook.png"   alt="rook"   class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#a8');
    $('<img src="chess_pieces/knight.png" alt="knight" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#b8');
    $('<img src="chess_pieces/bishop.png" alt="bishop" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#c8');
    $('<img src="chess_pieces/queen.png"  alt="queen"  class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#d8');
    $('<img src="chess_pieces/king.png"   alt="king"   class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#e8');
    $('<img src="chess_pieces/bishop.png" alt="bishop" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#f8');
    $('<img src="chess_pieces/knight.png" alt="knight" class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#g8');
    $('<img src="chess_pieces/rook.png"   alt="rook"   class="piece">').draggable({ revert: 'invalid', containment: '#board' }).appendTo('#h8');
  }
});

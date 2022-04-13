const rows = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];
const cols = [ '8', '7', '6', '5', '4', '3', '2', '1' ];
let ident;

let socket = io();


          socket.on('welcome', function(data) {
              //ADD SOCKET STUFF HERE
          });


          socket.on('update', (data) => {
              //ADD SOCKET STUFF HERE
          });

          function doit() {
                //ADD SOCKET STUFF HERE     s
                return false;
          }


$(document).ready(function() {
    $("#fenbutton").click(handlestuff);
    let index = 0;

    for (let r = 0; r < 8; ++r) {
        const row = $('<tr></tr>').appendTo('#board');

        for (let r = 0; r < 8; ++r) {
            const cell = $(`<td class="cell"></td>`).appendTo(row);

            const locationRowNumber = Math.floor(index % 8);
            const locationColNumber = Math.floor(index / 8);

            const location = getLocation(locationRowNumber, locationColNumber);

            $(cell).prop("id", location);

            $(cell).append('<span class="cell_number">' + location + '</span>');

            $(cell).append('<span class="cell_background"></span>');

            $(cell).droppable({
                tolerance: 'pointer',
                activate: function(event, ui) {
                    //$('#' + $(ui.draggable).attr('chess-location')).children('.cell_background').css('background-color', '#FFFFFF20');
                    const moves = possibleMoves(ui.draggable);

                    for (const move of [...moves.moves, ...moves.specialMoves]) {
                        $('#' + move).children('.cell_background').css('background-color', '#00000060');
                    }
                },
                deactivate: function(event, ui) {
                    $('.cell').children('.cell_background').css('background-color', '');
                },
                drop: function(event, ui) {
                    $(cell).children('.piece').remove();

                    $('.cell').children('.cell_background').css('background-color', '');
                    $(cell).children('.cell_background').css('border', '');
                    $(ui.draggable).css('left', '').css('top', '').appendTo(cell);
                    $("#moves").prepend('<p>' + location + '</p>');
                    $(ui.draggable).attr('chess-location', location);
                    $(ui.draggable).attr('chess-moved', true);

                    if (locationColNumber === 0 && $(ui.draggable).attr('chess-name') === 'pawn' && $(ui.draggable).attr('chess-color') === 'white') {
                        $(ui.draggable).attr('chess-name', 'queen');
                        $(ui.draggable).prop('src', '../chess_pieces/queen_white.png');
                    }

                    if (locationColNumber === 7 && $(ui.draggable).attr('chess-name') === 'pawn' && $(ui.draggable).attr('chess-color') === 'black') {
                        $(ui.draggable).attr('chess-name', 'queen');
                        $(ui.draggable).prop('src', '../chess_pieces/queen_black.png');
                    }
                },
                over: function() {
                    $(cell).children('.cell_background').css('border', '4px solid #00000060');
                },
                out: function() {
                    $(cell).children('.cell_background').css('border', '');
                },
                accept: function(element) {
                    const moves = possibleMoves(element);

                    return [...moves.moves, ...moves.specialMoves].includes(location);
                }
            });

            index++;
        }
    }

    placePiece('pawn', 'white', 'a2');
    placePiece('pawn', 'white', 'b2');
    placePiece('pawn', 'white', 'c2');
    placePiece('pawn', 'white', 'd2');
    placePiece('pawn', 'white', 'e2');
    placePiece('pawn', 'white', 'f2');
    placePiece('pawn', 'white', 'g2');
    placePiece('pawn', 'white', 'h2');

    placePiece('pawn', 'black', 'a7');
    placePiece('pawn', 'black', 'b7');
    placePiece('pawn', 'black', 'c7');
    placePiece('pawn', 'black', 'd7');
    placePiece('pawn', 'black', 'e7');
    placePiece('pawn', 'black', 'f7');
    placePiece('pawn', 'black', 'g7');
    placePiece('pawn', 'black', 'h7');

    placePiece('rook',   'white', 'a1');
    placePiece('knight', 'white', 'b1');
    placePiece('bishop', 'white', 'c1');
    placePiece('queen',  'white', 'd1');
    placePiece('king',   'white', 'e1');
    placePiece('bishop', 'white', 'f1');
    placePiece('knight', 'white', 'g1');
    placePiece('rook',   'white', 'h1');

    placePiece('rook',   'black', 'a8');
    placePiece('knight', 'black', 'b8');
    placePiece('bishop', 'black', 'c8');
    placePiece('queen',  'black', 'd8');
    placePiece('king',   'black', 'e8');
    placePiece('bishop', 'black', 'f8');
    placePiece('knight', 'black', 'g8');
    placePiece('rook',   'black', 'h8');
});

function placePiece(name, color, location) {
    $(`<img src="../chess_pieces/${name}_${color}.png" chess-name="${name}" chess-color="${color}" chess-location="${location}" class="piece">`).draggable({ revert: 'invalid', containment: '#board' }).appendTo('#' + location);
}

function possibleMoves(piece) {
    const location = $(piece).attr('chess-location');

    const locationRow = location[0];
    const locationCol = location[1];

    const locationRowNumber = rows.indexOf(locationRow);
    const locationColNumber = cols.indexOf(locationCol);

    const moves = [];
    const specialMoves = [];

    if ($(piece).attr('chess-name') === 'pawn') {
        const direction = $(piece).attr('chess-color') === 'white' ? -1 : 1;

        const move1 = getLocation(locationRowNumber, locationColNumber + direction);
        const move2 = getLocation(locationRowNumber, locationColNumber + direction * 2);

        if (!hasPiece(move1)) {
            moves.push(move1);

            if (!hasPiece(move2) && !$(piece).attr('chess-moved')) {
                moves.push(move2);
            }
        }

        const attack1 = getLocation(locationRowNumber - 1, locationColNumber + direction);
        const attack2 = getLocation(locationRowNumber + 1, locationColNumber + direction);

        if (hasPiece(attack1) && getPiece(attack1).attr('chess-color') !== $(piece).attr('chess-color')) moves.push(attack1);
        if (hasPiece(attack2) && getPiece(attack2).attr('chess-color') !== $(piece).attr('chess-color')) moves.push(attack2);
    }

    if ($(piece).attr('chess-name') === 'king') {
        const nearbyMoves = [];

        nearbyMoves.push(getLocation(locationRowNumber, locationColNumber - 1)); // N
        nearbyMoves.push(getLocation(locationRowNumber, locationColNumber + 1)); // S
        nearbyMoves.push(getLocation(locationRowNumber + 1, locationColNumber)); // E
        nearbyMoves.push(getLocation(locationRowNumber - 1, locationColNumber)); // W

        nearbyMoves.push(getLocation(locationRowNumber + 1, locationColNumber - 1)); // NE
        nearbyMoves.push(getLocation(locationRowNumber - 1, locationColNumber - 1)); // NW
        nearbyMoves.push(getLocation(locationRowNumber + 1, locationColNumber + 1)); // SE
        nearbyMoves.push(getLocation(locationRowNumber - 1, locationColNumber + 1)); // SW

        for (const nearbyMove of nearbyMoves) {
            if (hasPiece(nearbyMove) && getPiece(nearbyMove).attr('chess-color') === $(piece).attr('chess-color')) continue;
            moves.push(nearbyMove);
        }

        if (!$(piece).attr('chess-moved')) {
            if ($(piece).attr('chess-color') === 'white') {
                if (!hasPiece('f1') && !hasPiece('g1') && hasPiece('h1')) {
                    const possibleRook = getPiece('h1');

                    if (!possibleRook.attr('chess-moved') && possibleRook.attr('chess-name') === 'rook' && possibleRook.attr('chess-color') === 'white') {
                        specialMoves.push('g1');
                    }
                }
                if (!hasPiece('d1') && !hasPiece('c1') && !hasPiece('b1') && hasPiece('a1')) {
                    const possibleRook = getPiece('a1');

                    if (!possibleRook.attr('chess-moved') && possibleRook.attr('chess-name') === 'rook' && possibleRook.attr('chess-color') === 'white') {
                        specialMoves.push('c1');
                    }
                }
            }

            if ($(piece).attr('chess-color') === 'black') {
                if (!hasPiece('f8') && !hasPiece('g8') && hasPiece('h8')) {
                    const possibleRook = getPiece('h8');

                    if (!possibleRook.attr('chess-moved') && possibleRook.attr('chess-name') === 'rook' && possibleRook.attr('chess-color') === 'black') {
                        specialMoves.push('g8');
                    }
                }
                if (!hasPiece('d8') && !hasPiece('c8') && !hasPiece('b8') && hasPiece('a8')) {
                    const possibleRook = getPiece('a8');

                    if (!possibleRook.attr('chess-moved') && possibleRook.attr('chess-name') === 'rook' && possibleRook.attr('chess-color') === 'black') {
                        specialMoves.push('c8');
                    }
                }
            }
        }
    }

    if ($(piece).attr('chess-name') === 'knight') {
        const nearbyMoves = [];

        nearbyMoves.push(getLocation(locationRowNumber + 1, locationColNumber - 2)); // N
        nearbyMoves.push(getLocation(locationRowNumber - 1, locationColNumber - 2)); // N

        nearbyMoves.push(getLocation(locationRowNumber + 1, locationColNumber + 2)); // S
        nearbyMoves.push(getLocation(locationRowNumber - 1, locationColNumber + 2)); // S

        nearbyMoves.push(getLocation(locationRowNumber + 2, locationColNumber + 1)); // E
        nearbyMoves.push(getLocation(locationRowNumber + 2, locationColNumber - 1)); // E

        nearbyMoves.push(getLocation(locationRowNumber - 2, locationColNumber + 1)); // W
        nearbyMoves.push(getLocation(locationRowNumber - 2, locationColNumber - 1)); // W

        for (const nearbyMove of nearbyMoves) {
            if (hasPiece(nearbyMove) && getPiece(nearbyMove).attr('chess-color') === $(piece).attr('chess-color')) continue;
            moves.push(nearbyMove);
        }
    }

    if ($(piece).attr('chess-name') === 'rook') {
        for (let row = locationRowNumber - 1; row >= 0; row--) {
            const blockingPiece = getPiece(getLocation(row, locationColNumber));

            if (blockingPiece.length) {
                if (blockingPiece.attr('chess-color') !== $(piece).attr('chess-color'))
                    moves.push(getLocation(row, locationColNumber));
                break;
            }

            moves.push(getLocation(row, locationColNumber));
        }

        for (let col = locationColNumber - 1; col >= 0; col--) {
            const blockingPiece = getPiece(getLocation(locationRowNumber, col));

            if (blockingPiece.length) {
                if (blockingPiece.attr('chess-color') !== $(piece).attr('chess-color'))
                    moves.push(getLocation(locationRowNumber, col));
                break;
            }

            moves.push(getLocation(locationRowNumber, col));
        }

        for (let row = locationRowNumber + 1; row < rows.length; row++) {
            const blockingPiece = getPiece(getLocation(row, locationColNumber));

            if (blockingPiece.length) {
                if (blockingPiece.attr('chess-color') !== $(piece).attr('chess-color'))
                    moves.push(getLocation(row, locationColNumber));
                break;
            }

            moves.push(getLocation(row, locationColNumber));
        }

        for (let col = locationColNumber + 1; col < cols.length; col++) {
            const blockingPiece = getPiece(getLocation(locationRowNumber, col));

            if (blockingPiece.length) {
                if (blockingPiece.attr('chess-color') !== $(piece).attr('chess-color'))
                    moves.push(getLocation(locationRowNumber, col));
                break;
            }

            moves.push(getLocation(locationRowNumber, col));
        }
    }

    if ($(piece).attr('chess-name') === 'bishop') {
        for (let row = locationRowNumber - 1, col = locationColNumber - 1; row >= 0, col >= 0; row--, col--) {
            const blockingPiece = getPiece(getLocation(row, col));

            if (blockingPiece.length) {
                if (blockingPiece.attr('chess-color') !== $(piece).attr('chess-color'))
                    moves.push(getLocation(row, col));
                break;
            }

            moves.push(getLocation(row, col));
        }

        for (let row = locationRowNumber + 1, col = locationColNumber + 1; row < rows.length, col < cols.length; row++, col++) {
            const blockingPiece = getPiece(getLocation(row, col));

            if (blockingPiece.length) {
                if (blockingPiece.attr('chess-color') !== $(piece).attr('chess-color'))
                    moves.push(getLocation(row, col));
                break;
            }

            moves.push(getLocation(row, col));
        }

        for (let row = locationRowNumber + 1, col = locationColNumber - 1; row < rows.length, col >= 0; row++, col--) {
            const blockingPiece = getPiece(getLocation(row, col));

            if (blockingPiece.length) {
                if (blockingPiece.attr('chess-color') !== $(piece).attr('chess-color'))
                    moves.push(getLocation(row, col));
                break;
            }

            moves.push(getLocation(row, col));
        }

        for (let row = locationRowNumber - 1, col = locationColNumber + 1; row >= 0, col < cols.length; row--, col++) {
            const blockingPiece = getPiece(getLocation(row, col));

            if (blockingPiece.length) {
                if (blockingPiece.attr('chess-color') !== $(piece).attr('chess-color'))
                    moves.push(getLocation(row, col));
                break;
            }

            moves.push(getLocation(row, col));
        }
    }

    if ($(piece).attr('chess-name') === 'queen') {
        for (let row = locationRowNumber - 1, col = locationColNumber - 1; row >= 0, col >= 0; row--, col--) {
            const blockingPiece = getPiece(getLocation(row, col));

            if (blockingPiece.length) {
                if (blockingPiece.attr('chess-color') !== $(piece).attr('chess-color'))
                    moves.push(getLocation(row, col));
                break;
            }

            moves.push(getLocation(row, col));
        }

        for (let row = locationRowNumber + 1, col = locationColNumber + 1; row < rows.length, col < cols.length; row++, col++) {
            const blockingPiece = getPiece(getLocation(row, col));

            if (blockingPiece.length) {
                if (blockingPiece.attr('chess-color') !== $(piece).attr('chess-color'))
                    moves.push(getLocation(row, col));
                break;
            }

            moves.push(getLocation(row, col));
        }

        for (let row = locationRowNumber + 1, col = locationColNumber - 1; row < rows.length, col >= 0; row++, col--) {
            const blockingPiece = getPiece(getLocation(row, col));

            if (blockingPiece.length) {
                if (blockingPiece.attr('chess-color') !== $(piece).attr('chess-color'))
                    moves.push(getLocation(row, col));
                break;
            }

            moves.push(getLocation(row, col));
        }

        for (let row = locationRowNumber - 1, col = locationColNumber + 1; row >= 0, col < cols.length; row--, col++) {
            const blockingPiece = getPiece(getLocation(row, col));

            if (blockingPiece.length) {
                if (blockingPiece.attr('chess-color') !== $(piece).attr('chess-color'))
                    moves.push(getLocation(row, col));
                break;
            }
            
            moves.push(getLocation(row, col));
        }

        for (let row = locationRowNumber - 1; row >= 0; row--) {
            const blockingPiece = getPiece(getLocation(row, locationColNumber));

            if (blockingPiece.length) {
                if (blockingPiece.attr('chess-color') !== $(piece).attr('chess-color'))
                    moves.push(getLocation(row, locationColNumber));
                break;
            }

            moves.push(getLocation(row, locationColNumber));
        }

        for (let col = locationColNumber - 1; col >= 0; col--) {
            const blockingPiece = getPiece(getLocation(locationRowNumber, col));

            if (blockingPiece.length) {
                if (blockingPiece.attr('chess-color') !== $(piece).attr('chess-color'))
                    moves.push(getLocation(locationRowNumber, col));
                break;
            }

            moves.push(getLocation(locationRowNumber, col));
        }

        for (let row = locationRowNumber + 1; row < rows.length; row++) {
            const blockingPiece = getPiece(getLocation(row, locationColNumber));

            if (blockingPiece.length) {
                if (blockingPiece.attr('chess-color') !== $(piece).attr('chess-color'))
                    moves.push(getLocation(row, locationColNumber));
                break;
            }

            moves.push(getLocation(row, locationColNumber));
        }

        for (let col = locationColNumber + 1; col < cols.length; col++) {
            const blockingPiece = getPiece(getLocation(locationRowNumber, col));

            if (blockingPiece.length) {
                if (blockingPiece.attr('chess-color') !== $(piece).attr('chess-color'))
                    moves.push(getLocation(locationRowNumber, col));
                break;
            }

            moves.push(getLocation(locationRowNumber, col));
        }
    }

    return { moves: moves, specialMoves: specialMoves };
}

function getLocation(rowNumber, colNumber) {
    if (rowNumber < 0 || rowNumber >= rows.length) return null;
    if (colNumber < 0 || colNumber >= cols.length) return null;

    const locationRow = rows[rowNumber];
    const locationCol = cols[colNumber];

    return locationRow + locationCol;
}

function chessLogic(element, cell) {
    console.log($(cell).prop('id'));
}

function hasPiece(cellName) {
    return $('#' + cellName).children('.piece').length;
}

function getPiece(cellName) {
    return $('#' + cellName).children('.piece');
}

function isInDanger(cellName) {
    if (!hasPiece(cellName)) return false;

    const piece = getPiece(cellName);

    //TODO
}

function handlestuff(){
  let fen = '';
  let index = 0;
  let fennum = 0;
$("#board tr td").each(function(){

    $(this).each(function(){
      if(index % 8 == 0){
        fen += '/';
      }
      if($(this).find('.piece').attr('chess-color') == undefined){
        fen += '1';
      }
      else if($(this).find('.piece').attr('chess-color') == "black"){
        if($(this).find('.piece').attr('chess-name') == "knight"){
          fen += $(this).find('.piece').attr('chess-name').substr(1,1);
        }else {
          fen += $(this).find('.piece').attr('chess-name').substr(0,1);
        }
      }
      else
      {
        if($(this).find('.piece').attr('chess-name') == "knight"){
          fen += $(this).find('.piece').attr('chess-name').substr(1,1).toUpperCase();
        }
        else {
          fen += $(this).find('.piece').attr('chess-name').substr(0,1).toUpperCase();
        }
      }
      index++;
      fennum++;
      //console.log($(this).attr('chess-name'));
    })
    //console.log(fen + " here");
  });
  fen = fen.replaceAll('11111111', '8');
  fen = fen.replaceAll('1111111', '7');
  fen = fen.replaceAll('111111', '6');
  fen = fen.replaceAll('11111', '5');
  fen = fen.replaceAll('1111', '4');
  fen = fen.replaceAll('111', '3');
  fen = fen.replaceAll('11', '2');
  fen += ' w';  //need to make : turn , numMovesB , numMovesW
/*  if(turn == 1){
    fen = fen.replace(' b',' w';); //
  }
  else {
    fen = fen.replace(' w',' b';); //
  }
    fen += ' - -' + toString(numMovesW) + toSring(numMovesB); */
    fen += ' - -' +' 0 ' + '1';
  console.log(fen);
}

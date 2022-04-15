const rows = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];
const cols = [ '8', '7', '6', '5', '4', '3', '2', '1' ];

const params = new URLSearchParams(location.search);

let socket = io();

socket.on('move', function(data) {
    fentoboard(data.fen);
});

$(document).ready(function() {
  $("#fenbutton").click(boardtofen);
  $("#fenbutton2").click(fentoboard);

    let index = 0;

    for (let r = 0; r < 8; ++r) {
        const row = $('<tr></tr>').appendTo('#board');

        for (let r = 0; r < 8; ++r) {
            const cell = $(`<td class="cell"></td>`).appendTo(row);

            const locationRowNumber = Math.floor(index % 8);
            const locationColNumber = Math.floor(index / 8);

            const location = getLocation(locationRowNumber, locationColNumber);

            $(cell).prop("id", location);

            // $(cell).append('<span class="cell_number">' + location + '</span>');

            $(cell).append('<span class="cell_background"></span>');

            $(cell).droppable({
                tolerance: 'pointer',
                activate: function(event, ui) {
                    //$('#' + $(ui.draggable).attr('chess-location')).children('.cell_background').css('background-color', '#FFFFFF20');
                    const moves = possibleMoves(ui.draggable);

                    for (const move of [...moves.moves, ...moves.specialMoves]) {
                        $('#' + move).children('.cell_background').css('background-color', '#00000080');
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

                    setTimeout(() => socket.emit('move', { fen: boardtofen() }), 1);
                },
                over: function() {
                    $(cell).children('.cell_background').css('border', '4px solid #000000A0');
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

  if()
  {
    fentoboard()
  }
  else {
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
  }
});

function placePiece(name, color, location) {
    const currentPiece = $('#' + location + ' img');

    if (currentPiece.attr('chess-name') == name && currentPiece.attr('chess-color') == color && currentPiece.attr('chess-location') == location) {
      return;
    }
    $('#' + location).remove('img');
    $(`<img src="../chess_pieces/${name}_${color}.png" chess-name="${name}" chess-color="${color}" chess-location="${location}" class="piece">`).draggable({ revert: 'invalid', containment: '#board' }).appendTo('#' + location);
}
function boardtofen(){
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
  return fen;
}

/////////////////fen to board
function fentoboard(fen) {
  {
    fen = fen.replaceAll('8', '11111111');
    fen = fen.replaceAll('7', '1111111');
    fen = fen.replaceAll('6', '111111');
    fen = fen.replaceAll('5', '11111');
    fen = fen.replaceAll('4', '1111');
    fen = fen.replaceAll('3', '111');
    fen = fen.replaceAll('2', '11');
    fen = fen.replaceAll('/', '');
  }
  let index = 0;
  let fennum = 0;
$("#board tr td").each(function(){

    $(this).each(function(){ //clear space and replace with actual one
      let tmp = fen.substr(index,1);

      if(isNaN(tmp) == false){
        $(this).children('.piece').remove();
      }
      else if(tmp.toUpperCase() === tmp){ //white pieces
        if(tmp === 'R'){        //rook
          placePiece('rook',   'white',$(this).attr('id'));

        }
        else if (tmp === 'N') { //knight
          placePiece('knight', 'white', $(this).attr('id'));

        }
        else if (tmp === 'B') { //bishop
          placePiece('bishop', 'white', $(this).attr('id'));

        }
        else if (tmp === 'Q') { //queen
          placePiece('queen',  'white', $(this).attr('id'));

        }
        else if (tmp === 'K') { //king
          placePiece('king',   'white',$(this).attr('id'));

        }
        else {                  //pawn
          placePiece('pawn', 'white',$(this).attr('id'));
        }
      }
      else { //black pieces
        if(tmp === 'r'){        //rook
          placePiece('rook','black',$(this).attr('id'));
        }
        else if (tmp === 'n') { //knight
          placePiece('knight', 'black',$(this).attr('id'));

        }
        else if (tmp === 'b') { //bishop
          placePiece('bishop', 'black', $(this).attr('id'));

        }
        else if (tmp === 'q') { //queen
          placePiece('queen',  'black', $(this).attr('id'));

        }
        else if (tmp === 'k') { //king
          placePiece('king',   'black',$(this).attr('id'));

        }
        else {                  //pawn
          placePiece('pawn', 'black',$(this).attr('id'));
        }
      }
      index++;
    })
  });
  console.log(fen);
}

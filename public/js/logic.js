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
console.log('logic.js')
const white = ["P", "K", "N", "B", "R", "Q"];
const black = ["p", "k", "n", "b", "r", "q"];

function getPossibleMoves(fen, detectCheck = true) {
    const moves = [];

    const currentTurn = getCurrentTurn(fen);

    const enPassant = cellStringToObject(getEnPassant(fen));

    for (let rank = 0; rank < 8; ++rank) {
        for (let file = 0; file < 8; ++file) {
            const cell = {rank: rank, file: file};

            const piece = getPiece(fen, cell);

            if (!piece) continue;

            if (currentTurn === "w" && piece !== piece.toUpperCase()) continue;
            if (currentTurn === "b" && piece !== piece.toLowerCase()) continue;

            if (piece.toUpperCase() === "P") {
                if (currentTurn === "w") {
                    const move1 = {rank: cell.rank + 1, file: cell.file};
                    const move2 = {rank: cell.rank + 2, file: cell.file};

                    if (!getPiece(fen, move1)) {
                        moves.push({from: cell, to: move1});

                        if (!getPiece(fen, move2) && rank == 1)
                            moves.push({from: cell, to: move2, enPassant: move1});
                    }

                    const attack1 = {rank: cell.rank + 1, file: cell.file - 1};
                    const attack2 = {rank: cell.rank + 1, file: cell.file + 1};

                    const attackPiece1 = getPiece(fen, attack1);
                    const attackPiece2 = getPiece(fen, attack2);

                    if (attackPiece1 && attackPiece1.toLowerCase() === attackPiece1)
                        moves.push({from: cell, to: attack1});
                    else if (
                        enPassant &&
                        enPassant.rank == attack1.rank &&
                        enPassant.file == attack1.file
                    )
                        moves.push({from: cell, to: attack1, doesEnPassant: true});

                    if (attackPiece2 && attackPiece2.toLowerCase() === attackPiece2)
                        moves.push({from: cell, to: attack2});
                    else if (
                        enPassant &&
                        enPassant.rank == attack2.rank &&
                        enPassant.file == attack2.file
                    )
                        moves.push({from: cell, to: attack2, doesEnPassant: true});
                }
                if (currentTurn === "b") {
                    const move1 = {rank: cell.rank - 1, file: cell.file};
                    const move2 = {rank: cell.rank - 2, file: cell.file};

                    if (!getPiece(fen, move1)) {
                        moves.push({from: cell, to: move1});

                        if (!getPiece(fen, move2) && rank == 6)
                            moves.push({from: cell, to: move2, enPassant: move1});
                    }

                    const attack1 = {rank: cell.rank - 1, file: cell.file - 1};
                    const attack2 = {rank: cell.rank - 1, file: cell.file + 1};

                    const attackPiece1 = getPiece(fen, attack1);
                    const attackPiece2 = getPiece(fen, attack2);

                    if (attackPiece1 && attackPiece1.toUpperCase() === attackPiece1)
                        moves.push({from: cell, to: attack1});
                    else if (
                        enPassant &&
                        enPassant.rank == attack1.rank &&
                        enPassant.file == attack1.file
                    )
                        moves.push({from: cell, to: attack1, doesEnPassant: true});

                    if (attackPiece2 && attackPiece2.toUpperCase() === attackPiece2)
                        moves.push({from: cell, to: attack2});
                    else if (
                        enPassant &&
                        enPassant.rank == attack2.rank &&
                        enPassant.file == attack2.file
                    )
                        moves.push({from: cell, to: attack2, doesEnPassant: true});
                }
            }

            if (piece.toUpperCase() === "K") {
                const nearbyCells = [];

                nearbyCells.push({rank: rank, file: file - 1});
                nearbyCells.push({rank: rank, file: file + 1});
                nearbyCells.push({rank: rank + 1, file: file});
                nearbyCells.push({rank: rank - 1, file: file});
                nearbyCells.push({rank: rank + 1, file: file - 1});
                nearbyCells.push({rank: rank - 1, file: file - 1});
                nearbyCells.push({rank: rank + 1, file: file + 1});
                nearbyCells.push({rank: rank - 1, file: file + 1});

                if (getCastleOptions(fen).includes("K") && currentTurn == "w") {
                    if (
                        !getPiece(fen, {rank: 0, file: 5}) &&
                        !getPiece(fen, {rank: 0, file: 6})
                    )
                        moves.push({from: cell, to: {rank: 0, file: 6}, castle: "K"});
                }
                if (getCastleOptions(fen).includes("k") && currentTurn == "b") {
                    if (
                        !getPiece(fen, {rank: 7, file: 5}) &&
                        !getPiece(fen, {rank: 7, file: 6})
                    )
                        moves.push({from: cell, to: {rank: 7, file: 6}, castle: "k"});
                }
                if (getCastleOptions(fen).includes("Q") && currentTurn == "w") {
                    if (
                        !getPiece(fen, {rank: 0, file: 1}) &&
                        !getPiece(fen, {rank: 0, file: 2}) &&
                        !getPiece(fen, {rank: 0, file: 3})
                    )
                        moves.push({from: cell, to: {rank: 0, file: 1}, castle: "Q"});
                }
                if (getCastleOptions(fen).includes("q") && currentTurn == "b") {
                    if (
                        !getPiece(fen, {rank: 7, file: 1}) &&
                        !getPiece(fen, {rank: 7, file: 2}) &&
                        !getPiece(fen, {rank: 7, file: 3})
                    )
                        moves.push({from: cell, to: {rank: 7, file: 1}, castle: "q"});
                }

                for (const nearbyCell of nearbyCells) {
                    if (
                        nearbyCell.rank < 0 ||
                        nearbyCell.rank >= 8 ||
                        nearbyCell.file < 0 ||
                        nearbyCell.file >= 8
                    )
                        continue;

                    const nearbyPiece = getPiece(fen, nearbyCell);

                    if (nearbyPiece && !areEnemies(nearbyPiece, piece)) continue;

                    moves.push({from: cell, to: nearbyCell});
                }
            }

            if (piece.toUpperCase() === "N") {
                const nearbyCells = [];

                nearbyCells.push({rank: rank + 1, file: file - 2}); // W
                nearbyCells.push({rank: rank - 1, file: file - 2}); // W

                nearbyCells.push({rank: rank + 1, file: file + 2}); // E
                nearbyCells.push({rank: rank - 1, file: file + 2}); // E

                nearbyCells.push({rank: rank + 2, file: file + 1}); // N
                nearbyCells.push({rank: rank + 2, file: file - 1}); // N

                nearbyCells.push({rank: rank - 2, file: file + 1}); // S
                nearbyCells.push({rank: rank - 2, file: file - 1}); // S

                for (const nearbyCell of nearbyCells) {
                    if (
                        nearbyCell.rank < 0 ||
                        nearbyCell.rank >= 8 ||
                        nearbyCell.file < 0 ||
                        nearbyCell.file >= 8
                    )
                        continue;

                    const nearbyPiece = getPiece(fen, nearbyCell);

                    if (nearbyPiece && !areEnemies(nearbyPiece, piece)) continue;

                    moves.push({from: cell, to: nearbyCell});
                }
            }

            if (piece.toUpperCase() === "R") {
                for (let nextRank = rank - 1; nextRank >= 0; nextRank--) {
                    const blockingPiece = getPiece(fen, {rank: nextRank, file});

                    if (blockingPiece) {
                        if (areEnemies(piece, blockingPiece))
                            moves.push({from: cell, to: {rank: nextRank, file}});
                        break;
                    }

                    moves.push({from: cell, to: {rank: nextRank, file}});
                }

                for (let nextFile = file - 1; nextFile >= 0; nextFile--) {
                    const blockingPiece = getPiece(fen, {rank, file: nextFile});

                    if (blockingPiece) {
                        if (areEnemies(piece, blockingPiece))
                            moves.push({from: cell, to: {rank, file: nextFile}});
                        break;
                    }

                    moves.push({from: cell, to: {rank, file: nextFile}});
                }

                for (let nextRank = rank + 1; nextRank < 8; nextRank++) {
                    const blockingPiece = getPiece(fen, {rank: nextRank, file});

                    if (blockingPiece) {
                        if (areEnemies(piece, blockingPiece))
                            moves.push({from: cell, to: {rank: nextRank, file}});
                        break;
                    }

                    moves.push({from: cell, to: {rank: nextRank, file}});
                }

                for (let nextFile = file + 1; nextFile < 8; nextFile++) {
                    const blockingPiece = getPiece(fen, {rank, file: nextFile});

                    if (blockingPiece) {
                        if (areEnemies(piece, blockingPiece))
                            moves.push({from: cell, to: {rank, file: nextFile}});
                        break;
                    }

                    moves.push({from: cell, to: {rank, file: nextFile}});
                }
            }

            if (piece.toUpperCase() === "B") {
                for (
                    let nextRank = rank - 1, nextFile = file - 1;
                    nextRank >= 0 && nextFile >= 0;
                    nextRank--, nextFile--
                ) {
                    const blockingPiece = getPiece(fen, {
                        rank: nextRank,
                        file: nextFile,
                    });

                    if (blockingPiece) {
                        if (areEnemies(piece, blockingPiece))
                            moves.push({
                                from: cell,
                                to: {rank: nextRank, file: nextFile},
                            });
                        break;
                    }

                    moves.push({from: cell, to: {rank: nextRank, file: nextFile}});
                }

                for (
                    let nextRank = rank + 1, nextFile = file + 1;
                    nextRank < 8 && nextFile < 8;
                    nextRank++, nextFile++
                ) {
                    const blockingPiece = getPiece(fen, {
                        rank: nextRank,
                        file: nextFile,
                    });

                    if (blockingPiece) {
                        if (areEnemies(piece, blockingPiece))
                            moves.push({
                                from: cell,
                                to: {rank: nextRank, file: nextFile},
                            });
                        break;
                    }

                    moves.push({from: cell, to: {rank: nextRank, file: nextFile}});
                }

                for (
                    let nextRank = rank + 1, nextFile = file - 1;
                    nextRank < 8 && nextFile >= 0;
                    nextRank++, nextFile--
                ) {
                    const blockingPiece = getPiece(fen, {
                        rank: nextRank,
                        file: nextFile,
                    });

                    if (blockingPiece) {
                        if (areEnemies(piece, blockingPiece))
                            moves.push({
                                from: cell,
                                to: {rank: nextRank, file: nextFile},
                            });
                        break;
                    }

                    moves.push({from: cell, to: {rank: nextRank, file: nextFile}});
                }

                for (
                    let nextRank = rank - 1, nextFile = file + 1;
                    nextRank >= 0 && nextFile < 8;
                    nextRank--, nextFile++
                ) {
                    const blockingPiece = getPiece(fen, {
                        rank: nextRank,
                        file: nextFile,
                    });

                    if (blockingPiece) {
                        if (areEnemies(piece, blockingPiece))
                            moves.push({
                                from: cell,
                                to: {rank: nextRank, file: nextFile},
                            });
                        break;
                    }

                    moves.push({from: cell, to: {rank: nextRank, file: nextFile}});
                }
            }

            if (piece.toUpperCase() === "Q") {
                for (let nextRank = rank - 1; nextRank >= 0; nextRank--) {
                    const blockingPiece = getPiece(fen, {rank: nextRank, file});

                    if (blockingPiece) {
                        if (areEnemies(piece, blockingPiece))
                            moves.push({from: cell, to: {rank: nextRank, file}});
                        break;
                    }

                    moves.push({from: cell, to: {rank: nextRank, file}});
                }

                for (let nextFile = file - 1; nextFile >= 0; nextFile--) {
                    const blockingPiece = getPiece(fen, {rank, file: nextFile});

                    if (blockingPiece) {
                        if (areEnemies(piece, blockingPiece))
                            moves.push({from: cell, to: {rank, file: nextFile}});
                        break;
                    }

                    moves.push({from: cell, to: {rank, file: nextFile}});
                }

                for (let nextRank = rank + 1; nextRank < 8; nextRank++) {
                    const blockingPiece = getPiece(fen, {rank: nextRank, file});

                    if (blockingPiece) {
                        if (areEnemies(piece, blockingPiece))
                            moves.push({from: cell, to: {rank: nextRank, file}});
                        break;
                    }

                    moves.push({from: cell, to: {rank: nextRank, file}});
                }

                for (let nextFile = file + 1; nextFile < 8; nextFile++) {
                    const blockingPiece = getPiece(fen, {rank, file: nextFile});

                    if (blockingPiece) {
                        if (areEnemies(piece, blockingPiece))
                            moves.push({from: cell, to: {rank, file: nextFile}});
                        break;
                    }

                    moves.push({from: cell, to: {rank, file: nextFile}});
                }

                for (
                    let nextRank = rank - 1, nextFile = file - 1;
                    nextRank >= 0 && nextFile >= 0;
                    nextRank--, nextFile--
                ) {
                    const blockingPiece = getPiece(fen, {
                        rank: nextRank,
                        file: nextFile,
                    });

                    if (blockingPiece) {
                        if (areEnemies(piece, blockingPiece))
                            moves.push({
                                from: cell,
                                to: {rank: nextRank, file: nextFile},
                            });
                        break;
                    }

                    moves.push({from: cell, to: {rank: nextRank, file: nextFile}});
                }

                for (
                    let nextRank = rank + 1, nextFile = file + 1;
                    nextRank < 8 && nextFile < 8;
                    nextRank++, nextFile++
                ) {
                    const blockingPiece = getPiece(fen, {
                        rank: nextRank,
                        file: nextFile,
                    });

                    if (blockingPiece) {
                        if (areEnemies(piece, blockingPiece))
                            moves.push({
                                from: cell,
                                to: {rank: nextRank, file: nextFile},
                            });
                        break;
                    }

                    moves.push({from: cell, to: {rank: nextRank, file: nextFile}});
                }

                for (
                    let nextRank = rank + 1, nextFile = file - 1;
                    nextRank < 8 && nextFile >= 0;
                    nextRank++, nextFile--
                ) {
                    const blockingPiece = getPiece(fen, {
                        rank: nextRank,
                        file: nextFile,
                    });

                    if (blockingPiece) {
                        if (areEnemies(piece, blockingPiece))
                            moves.push({
                                from: cell,
                                to: {rank: nextRank, file: nextFile},
                            });
                        break;
                    }

                    moves.push({from: cell, to: {rank: nextRank, file: nextFile}});
                }

                for (
                    let nextRank = rank - 1, nextFile = file + 1;
                    nextRank >= 0 && nextFile < 8;
                    nextRank--, nextFile++
                ) {
                    const blockingPiece = getPiece(fen, {
                        rank: nextRank,
                        file: nextFile,
                    });

                    if (blockingPiece) {
                        if (areEnemies(piece, blockingPiece))
                            moves.push({
                                from: cell,
                                to: {rank: nextRank, file: nextFile},
                            });
                        break;
                    }

                    moves.push({from: cell, to: {rank: nextRank, file: nextFile}});
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

        let appliedFen = fen;

        const currentTurn = getCurrentTurn(appliedFen);
        const nextTurn = currentTurn == "w" ? "b" : "w";

        if (move.castle == "K") {
            appliedFen = setBoard(
                appliedFen,
                setPiece(appliedFen, {rank: 0, file: 5}, "R")
            );
            appliedFen = setBoard(
                appliedFen,
                setPiece(appliedFen, {rank: 0, file: 7}, "")
            );
        }
        if (move.castle == "k") {
            appliedFen = setBoard(
                appliedFen,
                setPiece(appliedFen, {rank: 7, file: 5}, "r")
            );
            appliedFen = setBoard(
                appliedFen,
                setPiece(appliedFen, {rank: 7, file: 7}, "")
            );
        }
        if (move.castle == "Q") {
            appliedFen = setBoard(
                appliedFen,
                setPiece(appliedFen, {rank: 0, file: 2}, "R")
            );
            appliedFen = setBoard(
                appliedFen,
                setPiece(appliedFen, {rank: 0, file: 0}, "")
            );
        }
        if (move.castle == "q") {
            appliedFen = setBoard(
                appliedFen,
                setPiece(appliedFen, {rank: 7, file: 2}, "r")
            );
            appliedFen = setBoard(
                appliedFen,
                setPiece(appliedFen, {rank: 7, file: 0}, "")
            );
        }

        // Disabling castling when a piece is moved.
        if (getPiece(appliedFen, move.from) == "K")
            appliedFen = setCastleOptions(
                appliedFen,
                getCastleOptions(appliedFen).replace("K", "").replace("Q", "")
            );
        if (getPiece(appliedFen, move.from) == "k")
            appliedFen = setCastleOptions(
                appliedFen,
                getCastleOptions(appliedFen).replace("k", "").replace("q", "")
            );

        if (
            getPiece(appliedFen, move.from) == "R" &&
            move.from.rank == 0 &&
            move.from.file == 0
        )
            appliedFen = setCastleOptions(
                appliedFen,
                getCastleOptions(appliedFen).replace("Q", "")
            );
        if (
            getPiece(appliedFen, move.from) == "R" &&
            move.from.rank == 0 &&
            move.from.file == 7
        )
            appliedFen = setCastleOptions(
                appliedFen,
                getCastleOptions(appliedFen).replace("K", "")
            );
        if (
            getPiece(appliedFen, move.from) == "r" &&
            move.from.rank == 7 &&
            move.from.file == 0
        )
            appliedFen = setCastleOptions(
                appliedFen,
                getCastleOptions(appliedFen).replace("q", "")
            );
        if (
            getPiece(appliedFen, move.from) == "r" &&
            move.from.rank == 7 &&
            move.from.file == 7
        )
            appliedFen = setCastleOptions(
                appliedFen,
                getCastleOptions(appliedFen).replace("k", "")
            );

        appliedFen = setCurrentTurn(appliedFen, nextTurn);

        if (getPiece(appliedFen, move.from) == "P" && move.to.rank == 7) {
            appliedFen = setBoard(appliedFen, setPiece(appliedFen, move.to, "Q"));
            appliedFen = setBoard(appliedFen, setPiece(appliedFen, move.from, ""));
        } else if (getPiece(appliedFen, move.from) == "p" && move.to.rank == 0) {
            appliedFen = setBoard(appliedFen, setPiece(appliedFen, move.to, "q"));
            appliedFen = setBoard(appliedFen, setPiece(appliedFen, move.from, ""));
        } else {
            appliedFen = setBoard(
                appliedFen,
                setPiece(appliedFen, move.to, getPiece(appliedFen, move.from))
            );
            appliedFen = setBoard(appliedFen, setPiece(appliedFen, move.from, ""));
        }

        if (move.doesEnPassant) {
            const enPassant = cellStringToObject(getEnPassant(appliedFen));

            if (currentTurn === "w")
                appliedFen = setBoard(
                    appliedFen,
                    setPiece(
                        appliedFen,
                        {rank: enPassant.rank - 1, file: enPassant.file},
                        ""
                    )
                );
            if (currentTurn === "b")
                appliedFen = setBoard(
                    appliedFen,
                    setPiece(
                        appliedFen,
                        {rank: enPassant.rank + 1, file: enPassant.file},
                        ""
                    )
                );
        }

        if (move.enPassant)
            appliedFen = setEnPassant(appliedFen, cellObjectToString(move.enPassant));
        else appliedFen = setEnPassant(appliedFen, "-");

        let validMove = true;

        const resultingMoves = getPossibleMoves(appliedFen, false);

        for (let resultingMove of resultingMoves) {
            if (currentTurn == "w" && getPiece(appliedFen, resultingMove.to) == "K")
                validMove = false;
            if (currentTurn == "b" && getPiece(appliedFen, resultingMove.to) == "k")
                validMove = false;
        }

        if (validMove) finalMoves.push(move);
    }

    return finalMoves;
}

function areEnemies(piece1, piece2) {
    return (
        (white.includes(piece1) && black.includes(piece2)) ||
        (black.includes(piece1) && white.includes(piece2))
    );
}

function getPiece(fen, cell) {
    if (cell.rank < 0 || cell.rank >= 8) return null;
    //console.log(cell.rank);
    const board = getBoard(fen).split("/");

    const boardRank = board[8 - parseInt(cell.rank) - 1];
    //for (var i = 0; i < boardRank.length; i++) { if(!isNaN(boardRank[i])){console.log(boardRank[i]);} }
    //console.log('---------------------');
    /* found issue  cant parseInt a letter */

    for (
        let fileNumber = 0, fileIndex = 0;
        fileNumber < 8;
        ++fileIndex, ++fileNumber
    ) {
        const number = Number(boardRank[fileIndex]);

        if (isNaN(number)) {
            if (fileNumber === cell.file) {
                return boardRank[fileIndex];
            } else continue;
        }

        fileNumber += number - 1;
    }

    return null;
}

function getBoard(fen) {
    return fen.split(" ")[0];
}

function getCurrentTurn(fen) {
    return fen.split(" ")[1];
}

function getCastleOptions(fen) {
    return fen.split(" ")[2];
}

function getEnPassant(fen) {
    return fen.split(" ")[3];
}

function getHalfmoveClock(fen) {
    return parseInt(fen.split(" ")[4]);
}

function getFullmoveNumber(fen) {
    return parseInt(fen.split(" ")[5]);
}

function setPiece(fen, cell, piece) {
    if (cell.rank < 0 || cell.rank >= 8) return null;

    let board = [];

    for (let boardLine of getBoard(fen).split("/")) {
        const rank = [];

        for (let i = 0; i < boardLine.length; ++i) {
            const number = parseInt(boardLine[i]);

            if (isNaN(number)) rank.push(boardLine[i]);
            else for (let j = 0; j < number; ++j) rank.push(" ");
        }

        board = [rank, ...board];
    }
    /*another issue not sure why*/
    board[cell.rank][cell.file] = piece ? piece : " ";

    let reconstructFen = [];

    for (let rank of board) {
        let reconstructRank = rank.join("");

        reconstructRank = reconstructRank
            .replaceAll("        ", "8")
            .replaceAll("       ", "7")
            .replaceAll("      ", "6")
            .replaceAll("     ", "5")
            .replaceAll("    ", "4")
            .replaceAll("   ", "3")
            .replaceAll("  ", "2")
            .replaceAll(" ", "1");

        reconstructFen = [reconstructRank, ...reconstructFen];
    }

    return reconstructFen.join("/");
}

function setBoard(fen, data) {
    return [data, ...fen.split(" ").slice(1)].join(" ");
}

function setCurrentTurn(fen, data) {
    return [...fen.split(" ").slice(0, 1), data, ...fen.split(" ").slice(2)].join(
        " "
    );
}

function setCastleOptions(fen, data) {
    return [...fen.split(" ").slice(0, 2), data, ...fen.split(" ").slice(3)].join(
        " "
    );
}

function setEnPassant(fen, data) {
    return [...fen.split(" ").slice(0, 3), data, ...fen.split(" ").slice(4)].join(
        " "
    );
}

function setHalfmoveClock(fen, data) {
    return [...fen.split(" ").slice(0, 4), data, ...fen.split(" ").slice(5)].join(
        " "
    );
}

function setFullmoveNumber(fen, data) {
    return [...fen.split(" ").slice(0, 5), data].join(" ");
}

const ranks = ["a", "b", "c", "d", "e", "f", "g", "h"];
const files = ["1", "2", "3", "4", "5", "6", "7", "8"];

function cellStringToObject(cell) {
    if (cell == "-") return null;

    const rankString = cell[0];
    const fileString = cell[1];

    return {rank: ranks.indexOf(rankString), file: files.indexOf(fileString)};
}

function cellObjectToString(cell) {
    if (!cell) return null;

    const rankString = ranks[cell.rank];
    const fileString = files[cell.file];

    return rankString + fileString;
}

module.exports.getPossibleMoves = getPossibleMoves;

module.exports.getPiece = getPiece;
module.exports.setPiece = setPiece;

module.exports.getBoard = getBoard;
module.exports.setBoard = setBoard;

module.exports.getCurrentTurn = getCurrentTurn;
module.exports.setCurrentTurn = setCurrentTurn;

module.exports.getCastleOptions = getCastleOptions;
module.exports.setCastleOptions = setCastleOptions;

module.exports.getEnPassant = getEnPassant;
module.exports.setEnPassant = setEnPassant;

module.exports.getHalfmoveClock = getHalfmoveClock;
module.exports.setHalfmoveClock = setHalfmoveClock;

module.exports.getFullmoveNumber = getFullmoveNumber;
module.exports.setFullmoveNumber = setFullmoveNumber;

module.exports.cellStringToObject = cellStringToObject;
module.exports.cellObjectToString = cellObjectToString;

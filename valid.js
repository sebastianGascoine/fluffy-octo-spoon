/* MADE BY SEBASTIAN GASCOINE */
/* LIST OF THINGS TO ValidateFENs 🙂
Board:
1A   There are exactly 8 ranks (rows).
1B   The sum of the empty squares and pieces add to 8 for each rank (row).
1C   There are no consecutive numbers for empty squares.
Kings:
2A   See if there is exactly one w_king and one b_king.
2B   Make sure kings are separated and are at least 1 square apart.
Pawns:
4A   There are no more than 8 pawns from each color.

4B   There aren't any pawns in first or last rank (row)
     since they're either in a wrong start position or they should have promoted.

4C   Prevent having more promoted pieces than missing pawns (e.g extra_pieces = Math.max(0, num_queens-1)
     + Math.max(0, num_rooks-2) + Math.max(0, num_knights-2) + Math.max(0, num_bishops-2)
     and then extra_pieces <= (8-num_pawns)).
Other:
9A   Make sure the FEN contains all the parts that are needed (e.g active color, castling ability, en passant square, etc).
*/
/*
    true = error
    errCode is what is sent back to the client
*/
let errCode = "";

function ValidateFEN(id) {
    console.log("validateFEN OCCURING");
    /* board check */
    let r = 0; /* 1A DONE*/
    let p = 0; /* 1B DONE*/
    let n = false; /* 1C DONE*/
    /* king  check */
    let kb = 0; /* 2A DONE*/
    let kw = 0; /* 2A DONE*/
    /* check check */

    /* pawns check */ /* 4B DONE*/
    let pb = 0; /* 4A DONE*/
    let pw = 0; /* 4A DONE*/
    let qb = 0; /* 4C DONE*/
    let qw = 0; /* 4C DONE*/
    /* other check */
    let o = false;
    ///////////////////////////////
    if (id.charAt(0) == "/") id = id.substring(1);

    console.log(id);
    for (let i = 0; i < id.length; i++) {
        let temp = id.charAt(i);
        if (temp == " " && r >= 7) {
            //need a better way to check if the end
            o = true;
            p = 0;
            continue;
        }
        if (o) {
            //
            console.log(temp + " " + "other");
            if (temp != "b" || temp != "w") {
                errCode = `${temp} is Not a Color for Chess`;
            }
        } else {
            ///CHECK FOR AMT OF ROWS/////////////////
            if (temp == "/") {
                if (p != 8) {
                    errCode = `Amount of pieces/space in row ${r} Incorrect`;
                    return true;
                }
                p = 0;
                r++;
                n = false;
            }
            ///pieces//////////////
            else if (isNaN(temp)) {
                ////king -->////////////////////////////////
                if (temp.toUpperCase() == "K") {
                    if (temp.toUpperCase() == temp) {
                        if (kw >= 0) kw++;
                    } else if (temp.toUpperCase() != temp) {
                        if (kb >= 0) kb++;
                    }
                }
                /////queen -->//////////////////////////////
                if (temp.toUpperCase() == "Q") {
                    if (temp.toUpperCase() == temp) {
                        if (qw >= 0) qw++;
                    } else if (temp.toUpperCase() != temp) {
                        if (qb >= 0) qb++;
                    }
                }
                ////pawns-->////////////////////////////////
                if (temp.toUpperCase() == "P") {
                    if (r == 0 || r == 7) {
                        errCode = `Pawn at Row ${r} Impossible`;
                        return true;
                    }
                    if (temp.toUpperCase() == temp) pw++;
                    else if (temp.toUpperCase() != temp) pb++;
                }
                ///end of pieces////////////////////
                p++;
                n = false;
            }
            //////spaces////////////////////////////////
            else {
                if (n) {
                    console.log("error number" + n + temp);
                    errCode = `Two Number Spacers Together At Row ${r + 1}`;
                    return true;
                }
                p += Number(temp);
                n = true;
            }
            /////spaces/////////////////////////////////
        }
    }
    ///AFTER LOOP CHECKS/////////////////////////
    if (kb > 1) {
        errCode = `Too many Black King Pieces`;
        return true;
    } //kings
    if (kw > 1) {
        errCode = "Too Many White King Pieces";
        return true;
    }

    if (pb > 8) {
        errCode = `Too many Black Pawn Pieces`;
        return true;
    } //pawns
    if (pw > 8) {
        errCode = "Too Many White Pawn Pieces";
        return true;
    }
    if (qb > 10) {
        errCode = `Too many Black Queen Pieces`;
        return true;
    } //pawns
    if (qw > 10) {
        errCode = "Too Many White Queen Pieces";
        return true;
    }

    if (r != 7) {
        if (r > 7) errCode = `Too Little Rows ${r}`;

        if (r < 7) errCode = `Too Many Rows ${r}`;

        return true;
    } //rows
    ////////////////////////
    return false; //valid fen
}

function errorcode() {
    return errCode;
}

module.exports.ValidateFEN = ValidateFEN;
module.exports.errorcode = errorcode;



function move(e) {
    let boardid = e.composedPath()[e.composedPath().length - 5].id;
    boardid = boardid.charAt(boardid.length - 1);
    let board = window.Boards[boardid];
    let piece
    board.Pieces.forEach(_piece => {
        if (_piece.moving) { piece = _piece }
    });
    let piecehtml = document.getElementById(piece.pos);
    var newX = e.clientX - window.tilesize/2;
    var newY = e.clientY - window.tilesize/2;

    piecehtml.style.left = newX + "px";
    piecehtml.style.top = newY + "px";
}

function PosToInt(loc) {
    let not = "abcdefghijklmnopqrstuvwxyz";
    let x = parseInt(not.indexOf(loc.charAt(0)) + 1);
    let y = parseInt(loc.substr(1));
    return [x, y];
}

function IntToPos(x, y) {
    let not = "abcdefghijklmnopqrstuvwxyz";
    return not.charAt(x - 1) + y;
}

function mousedown(e) {
    let boardid = e.composedPath()[e.composedPath().length - 5].id;
    boardid = boardid.charAt(boardid.length - 1);
    let board = window.Boards[boardid];
    e.preventDefault();
    let piece;
    let tilehtml;
    let tile;
    let piecehtml;
    if (e.button === 2) {

        //rightclick
        //if piece: tile below green / normal
        if (e.composedPath()[0].className === 'tile') {
            tilehtml = e.composedPath()[0];
            let pos = tilehtml.id.split("_").pop()
            for (let i = 0; i < board.Tiles.length; i++) {
                if (board.Tiles[i].pos === pos) { tile = board.Tiles[i]; }
            }

        } else if (e.composedPath()[0].className === 'piece') {
            piecehtml = e.composedPath()[0];
            for (let i = 0; i < board.Tiles.length; i++) {
                if (board.Tiles[i].pos === piecehtml.id) {
                    tile = board.Tiles[i]
                }
            }
            tilehtml = document.getElementById("tile_" + piecehtml.id)
        }
        tile.firstclick = !tile.firstclick

        if (tile.firstclick === true) {
            if (tile.state === 1) { tilehtml.style.backgroundColor = "rgb(67,161,57)"; }
            if (tile.state === 2) { tilehtml.style.backgroundColor = "rgb(56,133,48)"; }
        }
        else { tile.defaultcolor() }

        //draw arrow
    }//------------------------------------------------------------------------------------------------------------------------------------
    if (e.button === 0) {
        //leftclick

        //remove all green
        for (let i = 0; i < board.Tiles.length; i++) {
            board.Tiles[i].defaultcolor();
            board.Tiles[i].firstclick = false;
        }


        //move piece
        if (e.composedPath()[0].className === 'piece') {
            piecehtml = e.composedPath()[0]
            piece = board.Pieces.get(piecehtml.id);
            console.log(piecehtml.id)
            piece.moving = false;
            if (board.white_to_move === piece.name.charAt(0)) {
                //piece.calcmoves();
                piece.moving = true;
                piecehtml.style.zIndex = 3;
                piece.calcmoves();
                piece.showmoves();
                document.addEventListener("mousemove", move);
            }
        }
    }

}

function mouseup(e) {
    let boardid = e.composedPath()[e.composedPath().length - 5].id;
    boardid = boardid.charAt(boardid.length - 1);
    let board = window.Boards[boardid];
    e.preventDefault();

    let piecehtml;
    if (e.button === 0 && e.composedPath()[0].className === 'piece') {
        piecehtml = e.composedPath()[0];
        let piece = board.Pieces.get(piecehtml.id);
        if (piece.moving) {
            board.stopturn(piece, piecehtml);
        }
    }

    for (let i = 0; i < board.Tiles.length; i++) {
        board.Tiles[i].defaultcolor();
    }
}

function generateRandomColor() {
    let maxVal = 0xFFFFFF; // 16777215
    let randomNumber = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);
    return `#${randColor.toUpperCase()}`
}

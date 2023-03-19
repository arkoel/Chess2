
class Card {
    constructor(name, player, board) {
        this.name = name;
        this.player = player; // 'b' or 'w'
        this.board = board;
    }
    play() {

    }
}

class Player {
    constructor(player, board) {
        this.Cards = [];
        this.player = player;
        this.board = board;
        for (let i = 0; i < 3; i++) {
            this.drawcard();
        }
    }
    drawcard() {
        this.Cards[this.Cards.length] = new Card(All_cards[Math.floor(Math.random() * 10), this.player, this.boardid]);
    }

}

class Piece {
    constructor(name, pos, board) {
        this.name = name;
        this.pos = pos;
        this.moving = false;
        this.board = board;
        this.moves = [];

    }


    move() {//Gewoon een functie om htmlpiece te bewegen naar zijn positie
        let attackpiece = null;
        if (arguments.length > 0) {//als pos word meegegeven zal het zijn niewe pos veranderen 
            let pos = arguments[0]
            if (document.getElementById(pos) !== null) {
                //kill thing first
                attackpiece = this.board.Pieces.get(pos);
                
                this.board.Pieces.delete(pos);
                document.getElementById(pos).remove();
                console.log("something went terrably wrong, removing times")
                //--add points--
            }
            document.getElementById(this.pos).id = pos;
            this.pos = pos;
        }
        document.getElementById(this.pos).style.left = document.getElementById("tile_" + this.pos).getBoundingClientRect().left + "px";
        document.getElementById(this.pos).style.top = document.getElementById("tile_" + this.pos).getBoundingClientRect().top + "px";
        return attackpiece;
    }

    getnewpos() { //gets tile connected to the htmlpiece 
        //based on pixelcoörds of html piece
        let piecehtml = document.getElementById(this.pos);
        let Xpiece = piecehtml.style.left;
        let Ypiece = piecehtml.style.top;
        Xpiece = parseInt(Xpiece.substring(0, Xpiece.length - 2));
        Ypiece = parseInt(Ypiece.substring(0, Ypiece.length - 2));

        let alltiles = document.getElementsByClassName("tile");
        let toptile = [999, 0];
        for (let i = 0; i < alltiles.length; i++) {
            let x = alltiles[i].getBoundingClientRect().left

            let y = alltiles[i].getBoundingClientRect().top.toString();
            let distance = Math.sqrt(Math.pow(Xpiece - x, 2) + Math.pow(Ypiece - y, 2));

            if (distance < toptile[0]) { toptile[0] = distance; toptile[1] = alltiles[i] }
        }
        return toptile[1].id.split("_").pop()
    }

    calcmoves() {
        let piecehtml = document.getElementById(this.pos);
        let board = this.board
        let moves = [];
        let hits = [];

        let dir;
        let dx;
        let dy;
        let end = false;
        let m;
        let pos = PosToInt(this.pos);
        switch (this.name.split("_").pop()) {
            case "pawn":
                let front = PosToInt(this.pos)
                let Ystart;

                if (this.name.charAt(0) === 'w') { dir = 1; Ystart = 2 } else { dir = -1; Ystart = board.Yboard - 1 }
                front[1] += dir
                let move = [true, true];
                console.log(board)
                    if (board.Pieces.has(IntToPos(front[0], front[1]))){ move[0] = false; move[1] = false }
                    if (board.Pieces.has(IntToPos(front[0], front[1] + dir))) { move[1] = false; }
                board.Pieces.forEach((targetpiece, targetpos) => {
                    if (targetpos===(IntToPos(front[0] - 1, front[1])) && targetpiece.name.charAt(0) !== this.name.charAt(0)) { hits[hits.length] = IntToPos(front[0] - 1, front[1]); }
                    if (targetpos===(IntToPos(front[0] + 1, front[1])) && targetpiece.name.charAt(0) !== this.name.charAt(0)) { hits[hits.length] = IntToPos(front[0] + 1, front[1]); }
                });
                if (move[0]) {
                    moves[moves.length] = IntToPos(front[0], front[1]);
                    if (move[1] && PosToInt(this.pos)[1] === Ystart) { moves[moves.length] = IntToPos(front[0], front[1] + dir); }
                }
                break;

            case "rook":
                dir = [[0, 1], [1, 0], [0, -1], [-1, 0]];
                m = 1;
                for (let n = 0; n !== 4;) {
                    dx = pos[0] + m * dir[n][0];
                    dy = pos[1] + m * dir[n][1];
                    for (let i = 0; i < board.Pieces.length; i++) {
                        if (board.Pieces.has(IntToPos(dx, dy))) {
                            if (board.Pieces[i].name.charAt(0) !== this.name.charAt(0)) { hits[hits.length] = IntToPos(dx, dy) }
                            end = true;
                        }
                    }

                    if (!(dx >= 1 && dx <= board.Xboard && dy >= 1 && dy <= board.Yboard)) { end = true; }
                    if (!end) {
                        moves[moves.length] = IntToPos(dx, dy);
                        m++;
                    } else { m = 1; n++; end = false; }
                }
                break;

            case "horse":
                let hit = false;
                dir = [[-1, 2], [1, 2], [2, 1], [2, -1], [-1, -2], [1, -2], [-2, 1], [-2, -1]];
                for (let i = 0; i < 8; i++) {
                    dx = pos[0] + dir[i][0];
                    dy = pos[1] + dir[i][1];
                    if (board.Pieces.has(IntToPos(dx, dy))){
                        hit = true;
                        if (board.Pieces[IntToPos(dx,dy)].name.charAt(0) !== this.name.charAt(0)) { hits[hits.length] = IntToPos(dx, dy) }
                    }
                    
                    if (!hit && (dx >= 1 && dx <= board.Xboard && dy >= 1 && dy <= board.Yboard)) { moves[moves.length] = IntToPos(dx, dy) }
                    hit = false;
                }
                break;

            case "bishop":
                dir = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
                m = 1;
                for (let n = 0; n !== 4;) {
                    dx = pos[0] + m * dir[n][0];
                    dy = pos[1] + m * dir[n][1];
                    if (board.Pieces.has(IntToPos(dx, dy))) {
                        if (board.Pieces[IntToPos(dx,dy)].name.charAt(0) !== this.name.charAt(0)) { hits[hits.length] = IntToPos(dx, dy) }
                        end = true;
                    }
                    if (!(dx >= 1 && dx <= board.Xboard && dy >= 1 && dy <= board.Yboard)) { end = true; }
                    if (!end) {
                        moves[moves.length] = IntToPos(dx, dy);
                        m++;
                    } else { m = 1; n++; end = false; }
                }
                break;

                case "queen":
                stop = false;
                dir = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, -1], [-1, 1]];
                m = 1;
                for (let n = 0; n !== 8;) {
                    dx = pos[0] + m * dir[n][0];
                    dy = pos[1] + m * dir[n][1];
                        if (board.Pieces.has(IntToPos(dx, dy))) {
                            if (board.Pieces[IntToPos(dx,dy)].name.charAt(0) !== this.name.charAt(0)) { hits[hits.length] = IntToPos(dx, dy) }
                            end = true;
                        }
                    
                    if (!(dx >= 1 && dx <= board.Xboard && dy >= 1 && dy <= board.Yboard)) { end = true; }
                    if (!end) {
                        moves[moves.length] = IntToPos(dx, dy)
                        m++;
                    } else { m = 1; n++; end = false; }
                }
                break;
            case "king":

                dir = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, -1], [-1, 1]];

                for (let i = 0; i < dir.length; i++) {
                    dx = pos[0] + dir[i][0]
                    dy = pos[1] + dir[i][1]
                    if (dx >= 1 && dx <= board.Xboard && dy >= 1 && dy <= board.Yboard) {
                        let n = IntToPos(dx, dy);
                        stop = 0;

                            if (board.Pieces.has(n)) {
                                if (board.Pieces[j].name.charAt(0) === this.name.charAt(0)) { stop = 1; }
                                else { stop = 2; }
                            }
                        
                        if (stop === 0) {
                            moves[moves.length] = n;
                        }
                        if (stop === 2) {
                            hits[hits.length] = n;
                        }

                    }
                }

                break;
        }

        this.moves = [moves, hits];
        return this.moves;
    }

    showmoves() {
        for (let i = 0; i < this.board.Tiles.length; i++) {
            if (this.moves[0].includes(this.board.Tiles[i].pos) || this.moves[1].includes(this.board.Tiles[i].pos)) {
                let tile = this.board.Tiles[i];
                let tilehtml = document.getElementById('tile_' + tile.pos);
                if (tile.state === 1) { tilehtml.style.backgroundColor = "rgb(67,161,57)"; }
                if (tile.state === 2) { tilehtml.style.backgroundColor = "rgb(56,133,48)"; }
            }
        }
    }

    checkiflegal(new_pos) { //returns true or false
        console.log("name = "+this.name)
        this.calcmoves();
        let old_pos = this.pos;
        if (!(new_pos === old_pos) && (this.moves[0].includes(new_pos) || this.moves[1].includes(new_pos))) {
            //if piece can move to it or attack it

            let attackpiece = this.move(new_pos); //null als geen hit, anders de piece die attacked word
            let checks = this.board.calccheck();
            this.move(old_pos);

            if (checks === -1) {//vijand koning word gecheckt, kan niet bewegen
                if (attackpiece !== null) {
                    console.log(attackpiece);
                    console.log(new_pos)
                    let attack_name = attackpiece.name.charAt(0) + attackpiece.name.charAt(6);
                    let element = document.createElement('img');
                    element.setAttribute('class', 'piece');
                    element.setAttribute('id', attackpiece.pos);
                    element.setAttribute('src', 'tiles/' + this.board.Set + '/' + attack_name + '.svg');
                    element.setAttribute('style', 'height: ' + window.tilesize + 'px; width: '+window.tilesize+'px;')

                    // '<img class="piece" id="' + attackpiece.pos + '" src="tiles/'+board.Set+'/'+attack_name+'.svg" style="height: 60px;">'
                    document.getElementById("board_" + this.board.boardid).appendChild(element);

                    this.board.Pieces[this.board.Pieces.length] = new Piece(attackpiece.name, attackpiece.pos, this.board.boardid)
                    attackpiece.move();
                    let attackhtml = document.getElementById(attackpiece.pos)

                    attackhtml.addEventListener("mousedown", mousedown, false);
                    attackhtml.addEventListener("mouseup", mouseup, false);

                    //take points if given
                }
                console.log(false);
                return false;
            }
            console.log(true);
            return true;
        }
        console.log(false);
        return false;
    }



}

class Tile {

    constructor(state, pos, boardid) {
        this.state = state;
        this.pos = pos;
        this.firstclick = false;
        this.boardid = boardid;
    }


    tilecolor() {
        let board = Boards[this.boardid]
        if (!Board.funkycolor) {
            switch (this.state) {
                case 0:
                    return "#ffffff";
                case 1:
                    return "#dccfbe";
                case 2:
                    return "#a17b65"

            }
        } else {
            switch (this.state) {
                case 0:
                    return "#ffffff";
                case 1:
                    return board.funkycolors[0];
                case 2:
                    return board.funkycolors[1];
            }
        }
    }
    defaultcolor() {
        document.getElementById("tile_" + this.pos).style.backgroundColor = this.tilecolor();
    }

}

class Board {
    constructor() {
        this.boardid = Boards.length;
        this.white_to_move = "w";
        this.pov = "w";
        this.Players = []
        this.Pieces = new Map();
        this.Tiles = [];
        this.Players[0] = new Player('w', this);
        this.Players[1] = new Player('b', this);
        this.funkycolor = false;
        this.funkycolors = [generateRandomColor(), generateRandomColor()]
        this.Xboard = 0;
        this.Yboard = 0;
    }

    switchFunkyColor() {
        this.funkycolor = !this.funkycolor
    }

    changepov() {
        for (let i = 0; i < this.Tiles.length; i++) {
            document.getElementById("tile_" + this.Tiles[i].pos).id += "-";
        }
        for (let i = 0; i < this.Tiles.length; i++) {
            let Int = PosToInt(this.Tiles[i].pos)
            let newpos = IntToPos(this.Xboard + 1 - Int[0], this.Yboard + 1 - Int[1]);
            document.getElementById("tile_" + this.Tiles[i].pos + "-").id = "tile_" + newpos;
            this.Tiles[i].pos = newpos;
        }
        for (let i = 0; i < this.Tiles.length; i++) {
            if (this.Xboard % 2 ^ this.Yboard % 2) {
                this.Tiles[i].state++;
                if (this.Tiles[i].state > 2) {
                    this.Tiles[i].state = 1;
                }
            }
            this.Tiles[i].defaultcolor();
        }

        this.Pieces.forEach(piece => {
            piece.move()
        });

    }
    createboard(X, Y, FEN) {
        this.Xboard = X;
        this.Yboard = Y;
        this.check = [];

        let board = "";
        var state = 2;
        let pos = "a1";
        for (let i = 0; i < this.Xboard; i++) {
            board += "<div class='colum'>";
            if (i % 2) { state = 2; } else { state = 1; }
            //correct when new colum

            for (var j = this.Yboard; j > 0; j--) {
                pos = IntToPos(i + 1, j);

                this.Tiles[this.Tiles.length] = new Tile(state, pos, this.boardid);
                let color = this.Tiles[this.Tiles.length-1].tilecolor();
                board += '<div class="tile" id="tile_' + pos + '" draggable="false" style="background-color: ' + color + '; height: ' + window.tilesize + 'px; width: ' + window.tilesize + 'px;"></div>';
                if (state === 1) {
                    state = 2;
                } else {
                    state = 1;
                }
            }
            board += "</div>";


        }
        //tiles loaded
        //load pieces
        const Notation = {
            "r": { name: 'white_rook' },
            "n": { name: 'white_horse' },
            "b": { name: 'white_bishop' },
            "q": { name: 'white_queen' },
            "k": { name: 'white_king' },
            "p": { name: 'white_pawn' },
            "R": { name: 'black_rook' },
            "N": { name: 'black_horse' },
            "B": { name: 'black_bishop' },
            "Q": { name: 'black_queen' },
            "K": { name: 'black_king' },
            "P": { name: 'black_pawn' }
        }
        let Sets = ["alfonso", "california", "cardinal", "cburnett", "chess7", "chessicons", "chessmonk", "chessnut", "companion", "dubrovny", "freestaunton", "fresca", "gioco", "governor", "horsey", "icpieces", "kilfiger", "kosal", "leipzig", "letter", "libra", "maestro", "makruk", "maya", "merida", "merida_new", "metaltops", "pirat", "pirouetti", "pixel", "regular", "reillycraig", "riohacha", "shapes", "sittuyin", "staunty", "tatiana"]
        this.Set = Sets[Math.floor(Math.random() * Sets.length)]
        this.Set = Sets[13]
        //check of FEN is valid?
        pos = 0;
        var x = 0, y = 0;
        for (let i = 0; i < FEN.length; i++) {
            if (FEN.substr(i, 1) === ' ') {
                pos++;
                i++;
            }
            const numbers = "123456789"
            switch (pos) {
                case 0:
                    if (FEN.charAt(i) === '/') {

                        x = 0;
                        y++;
                    }
                    if (numbers.includes(FEN.charAt(i))) {
                        x += Number(FEN.charAt(i));
                    }
                    if (FEN.charAt(i) in Notation) {
                        var loc = IntToPos(x + 1, y + 1)

                        var name;
                        if (FEN.charAt(i) == FEN.charAt(i).toUpperCase()) { name = 'b' } else { name = 'w' }
                        name += FEN.charAt(i).toLowerCase();
                        board += '<img class="piece" id="' + loc + '" src="tiles/' + this.Set + '/' + name + '.svg" style="height: ' + window.tilesize + 'px;width: ' + window.tilesize + 'px">';

                        this.Pieces.set(loc, new Piece(Notation[FEN.charAt(i)].name, loc, this));
                        x++;
                    }
                    break;

                case 1:
                    if (FEN.charAt(i) === "b" || FEN.charAt(i) === "w") {
                        this.white_to_move = FEN.charAt(i);
                    }
                    break;

                case 2:
                    //who can castle
                    break;

                case 3:
                    //en passant babyyyyyy
                    break;

                case 4:
                    //fity-move rule
                    break;

                case 5:
                    //fullmove number hoeveel volle moves er zijn gemaakt
                    break;

                default:
                    alert('ERROR SOMETHING WENT WRONG');
            }
        }
        console.log(this.Pieces);
        console.log(this.Tiles);
        document.getElementById("board_0").innerHTML = board;
        document.getElementById("board_0").style.width = window.tilesize * this.Xboard + "px"
        document.getElementById("board_0").style.height = window.tilesize * this.Yboard + "px"




        function arrayfunction(piece) {
            piece.move();
        }//move all pieces to correct spot
        this.Pieces.forEach(arrayfunction);


        document.querySelectorAll(".tile").forEach(tilehtml => {
            tilehtml.oncontextmenu = function (e) {
                e.preventDefault();
                //geen raar menu als je rechtsklikt
            }
            tilehtml.addEventListener("mousedown", mousedown, false);
            tilehtml.addEventListener("mouseup", mouseup, false);
        });




        document.querySelectorAll(".piece").forEach(piecehtml => {
            piecehtml.oncontextmenu = function (e) {
                e.preventDefault();
                //geen raar menu als je rechtsklikt
            }
            piecehtml.addEventListener("mousedown", mousedown, false);
            piecehtml.addEventListener("mouseup", mouseup, false);

        });
    }//end of create board

        calccheck() {
        //3 situations:
        // - no check = 0
        // - check opponent = any number of checks
        // - check self = -1

        let check = [];
        this.Pieces.forEach(piece=> {
            piece.calcmoves();
            //check is pos where you check
            this.Pieces.forEach(target=> {
                if (target.name.split("_").pop() === 'king' && target.name.charAt(0) !== piece.name.charAt(0) && piece.moves[1].includes(target.pos)) {
                    check[check.length] = target.pos;
                    if (piece.name.charAt(0) !== this.white_to_move) { return -1; }
                }

            });
        });
        return check.length;
    }

    stopturn(piece, piecehtml) {
        //ends the turn, with the piece just moved
        piecehtml.style.zIndex = 2;
        piece.moving = false;
        document.removeEventListener("mousemove", move);

        //change pos to new pos
        let new_pos = piece.getnewpos();
        let old_pos = piece.pos;
        if (piece.checkiflegal(new_pos, this)) {
            piecehtml.id = new_pos;
            piece.pos = new_pos;
            if (this.white_to_move === "b") {this.white_to_move = "w" } else { this.white_to_move = "b" }
            var audio = new Audio('sounds/piece_capture.mp3');
            audio.play();
            piece.move();
            
            //calc checkmate
            let checkmate = true;
            this.Pieces.forEach(piece => {
                if (piece.name.charAt(0) === this.white_to_move) {
                    piecehtml = document.getElementById(piece.pos);
                    piece.calcmoves();
                    for (let n = 0; n < piece.moves[0].length; n++) {
                        if (piece.checkiflegal(piece.moves[0][n])) {checkmate = false; return; }
                    }
                    for (let m = 0; m < piece.moves[1].length; m++) {
                        if (piece.checkiflegal(piece.moves[1][m])) { checkmate = false; return; }
                    }
                }
            });
            if (checkmate) { alert("CHECKMATE!"); }
        }
        piece.move();
    }


}//end of class board

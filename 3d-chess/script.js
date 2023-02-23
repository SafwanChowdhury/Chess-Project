class game {
    /*----------- Game State Data ----------*/
    board = [
        0, 1, 2, 3, 4, 5, 6, 7,
        8, 9, 10, 11, 12, 13, 14, 15,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        16, 17, 18, 19, 20, 21, 22, 23,
        24, 25, 26, 27, 28, 29, 30, 31
    ]

// parses pieceId's and returns the index of that piece's place on the board
    findPiece = function (pieceId) {
        let parsed = parseInt(pieceId);
        return board.indexOf(parsed);
    };

    /*------- DOM References -------*/
    cells = []
    whitePieces = []
    blackPieces = []
    pieces = []
    oldColor = {}
    highlightedCells = []
    whiteTurntext = document.querySelectorAll(".white-turn-text");
    blackTurntext = document.querySelectorAll(".black-turn-text");
    divider = document.querySelector("#divider");

    /*--- Player Properties ---*/
    turn = true;
    whiteScore = 16;
    blackScore = 16;
    playerPieces;

    /*--- selected piece properties ---*/
    selectedPiece = {
        pieceId: -1,
        indexOfBoardPiece: -1,
        row: 0,
        col: 0,
        moveTwo: false,
        isPawn: false,
        isRook: false,
        isKnight: false,
        isBishop: false,
        isQueen: false,
        isKing: false,
        isLeft: false,
        isRight: false,
        moves: []
    }

    selected = null
    intersectsBoard = null
    /*---------- Event Listeners ----------*/

// initialize event listeners on pieces
    givePiecesEventListeners(intersectsPiece,intersectsBoard) {
        this.intersectsBoard = intersectsBoard
        if (intersectsPiece.length > 0 && (this.turn && intersectsPiece[0].object.parent.userData.pieceId < 16 || !this.turn && intersectsPiece[0].object.parent.userData.pieceId >= 16) ) {
            intersectsPiece[0].object.material.transparent = true;
            if (this.selected) {
                if (intersectsPiece[0] !== this.selected) {
                    this.selected.object.material.opacity = 1
                    this.selected.object.material.color = this.oldColor
                    for (let i = 0; i < this.highlightedCells.length; i++){
                        this.highlightedCells[i].material.opacity = 0
                    }
                } else {
                    this.selected.object.material.opacity = 1
                }
            }
            intersectsPiece[0].object.material.opacity = 0.7;
            this.selected = intersectsPiece[0]
            this.oldColor = this.selected.object.material.color
            this.getPlayerPieces()
        }
        else{
            if (this.selected){
                this.selected.object.material.opacity = 1
                this.selected.object.material.color = this.oldColor
                for (let i = 0; i < this.highlightedCells.length; i++){
                    this.highlightedCells[i].material.opacity = 0
                }
                this.selected = null
                this.resetSelectedPieceProperties();

            }
        }
    }

    /*---------- Logic ----------*/

// holds the length of the players piece count

    getPlayerPieces() {
        if (this.turn) {
            this.playerPieces = this.whitePieces;
        } else {
            this.playerPieces = this.blackPieces;
        }
        this.getSelectedPiece();
    }



// resets selected piece properties
    resetSelectedPieceProperties() {
        this.selectedPiece.pieceId = -1;
        this.selectedPiece.indexOfBoardPiece = -1;
        this.selectedPiece.row = 0;
        this.selectedPiece.col = 0;
        this.selectedPiece.moveTwo = false;
        this.selectedPiece.isPawn = false;
        this.selectedPiece.isRook = false;
        this.selectedPiece.isKnight = false;
        this.selectedPiece.isBishop = false;
        this.selectedPiece.isQueen = false;
        this.selectedPiece.isKing = false;
        this.selectedPiece.isLeft = false;
        this.selectedPiece.isRight = false;
        this.selectedPiece.moves = [];
    }

// gets ID and index of the board cell its on
    getSelectedPiece() {
        console.log(this.selected)
        this.selectedPiece.pieceId = this.selected.object.parent.userData.pieceId;
        this.selectedPiece.indexOfBoardPiece = this.selected.object.parent.userData.indexOfBoardPiece;
        this.selectedPiece.row = Math.floor(this.selectedPiece.indexOfBoardPiece / 8)
        this.selectedPiece.col = Math.floor(this.selectedPiece.indexOfBoardPiece % 8)
        this.selectedPiece.isPawn = this.selected.object.parent.userData.isPawn;
        this.selectedPiece.isRook = this.selected.object.parent.userData.isRook;
        this.selectedPiece.isKnight = this.selected.object.parent.userData.isKnight;
        this.selectedPiece.isBishop = this.selected.object.parent.userData.isBishop;
        this.selectedPiece.isQueen = this.selected.object.parent.userData.isQueen;
        this.selectedPiece.isKing = this.selected.object.parent.userData.isKing;
        this.selectedPiece.moveTwo = this.selected.object.parent.userData.moveTwo;
        if (this.selectedPiece.col === 0) {
            this.selectedPiece.isLeft = true;
        } else if (this.selectedPiece.col === 7) {
            this.selectedPiece.isRight = true;
        }
        console.log(this.selectedPiece)
        if (this.selectedPiece.isRook)
            this.givePieceBorder(this.rook())
        else if (this.selectedPiece.isKnight)
            this.givePieceBorder(this.knight())
        else if (this.selectedPiece.isBishop)
            this.givePieceBorder(this.bishop())
        else if (this.selectedPiece.isQueen)
            this.givePieceBorder(this.queen())
        else if (this.selectedPiece.isKing)
            this.givePieceBorder(this.king())
        else
            this.givePieceBorder(this.pawn())
    }

    pawn() {
        let moves = []
        if (this.selectedPiece.pieceId < 16) { //white
            if (this.board[this.selectedPiece.indexOfBoardPiece + 8] === null) {
                moves.push(8)
            }
            if (this.selectedPiece.moveTwo) {
                if (this.board[this.selectedPiece.indexOfBoardPiece + 16] === null) {
                    moves.push(16)
                }
            }
            if (this.board[this.selectedPiece.indexOfBoardPiece + 7] >= 16 && selectedPiece.isLeft === false) {
                moves.push(7)
            }
            if (this.board[this.selectedPiece.indexOfBoardPiece + 9] >= 16 && selectedPiece.isRight === false) {
                moves.push(9)
            }
        } else { //black
            if (this.board[this.selectedPiece.indexOfBoardPiece - 8] === null) {
                moves.push(-8)
            }
            if (this.selectedPiece.moveTwo) {
                if (this.board[this.selectedPiece.indexOfBoardPiece - 16] === null) {
                    moves.push(-16)
                }
            }
            if (this.board[this.selectedPiece.indexOfBoardPiece - 7] < 16 && this.selectedPiece.isRight === false && this.board[this.selectedPiece.indexOfBoardPiece - 7] !== null) {
                moves.push(-7)
            }
            if (this.board[this.selectedPiece.indexOfBoardPiece - 9] < 16 && this.selectedPiece.isLeft === false && this.board[this.selectedPiece.indexOfBoardPiece - 9] !== null) {
                moves.push(-9)
            }
        }
        return moves
    }

    rook() {
        let moves = []
        let rowMove = this.getMovesInDirection(1, this.turn, this.board, this.selectedPiece).concat(this.getMovesInDirection(-1, this.turn, this.board, this.selectedPiece));
        let colMove = this.getMovesInDirection(8, this.turn, this.board, this.selectedPiece).concat(this.getMovesInDirection(-8, this.turn, this.board, this.selectedPiece));
        moves = rowMove.concat(colMove)
        return moves
    }

    getMovesInDirection(direction, turn, board, selectedPiece) {
        let moves = [];
        let maxOffset = 7 * (turn ? 8 : 1);
        for (let i = 1; i <= maxOffset; i++) {
            let offset = i * direction;
            let newRow = selectedPiece.row + (turn ? offset / 8 : 0);
            let newCol = selectedPiece.col + (turn ? 0 : offset);
            if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) {
            }
            let piece = board[selectedPiece.indexOfBoardPiece + offset];
            if (piece !== null) {
                if (turn && piece >= 16 || !turn && piece < 16) {
                    if (Math.floor((selectedPiece.indexOfBoardPiece + offset) % 8) === selectedPiece.col || Math.floor((selectedPiece.indexOfBoardPiece + offset) / 8) === selectedPiece.row) {
                        moves.push(offset);
                    }
                }
                break; // exit loop if the piece is the player's own piece or an opponent's piece
            } else if (Math.floor((selectedPiece.indexOfBoardPiece + offset) % 8) === selectedPiece.col || Math.floor((selectedPiece.indexOfBoardPiece + offset) / 8) === selectedPiece.row) {
                moves.push(offset);
            }
        }
        return moves;
    }


    knight() {
        let moves = [-17, -15, -10, -6, 6, 10, 15, 17];
        let validMoves = [];

        for (let i = 0; i < moves.length; i++) {
            let destinationIndex = this.selectedPiece.indexOfBoardPiece + moves[i];
            if (destinationIndex < 0 || destinationIndex > 63) {
                continue // skip invalid moves
            }
            let destinationPiece = this.board[destinationIndex];
            if (moves[i] === -1 && Math.floor(destinationIndex % 8) === 7) {
                continue // skip left edge moves
            }
            if (moves[i] === 1 && Math.floor(destinationIndex % 8) === 0) {
                continue // skip right edge moves
            }
            if (Math.floor(destinationIndex % 8) > this.selectedPiece.col + 2 || Math.floor(destinationIndex % 8) < this.selectedPiece.col - 2) {
                continue
            }
            if ((this.turn && destinationPiece < 16 && destinationPiece !== null) || (!this.turn && destinationPiece >= 16)) {
            } else {
                validMoves.push(moves[i]);
            }
        }
        moves = validMoves
        return moves
    }

    bishop() {
        let position = this.selectedPiece.indexOfBoardPiece;
        let possibleMoves = [];
        let moves = []

// compute row and column of bishop
        let row = Math.floor(position / 8);
        let col = position % 8;

// iterate over each diagonal direction
        for (let dx of [-1, 1]) {
            for (let dy of [-1, 1]) {
                // iterate over diagonal steps
                for (let i = 1; i < 8; i++) {
                    // compute row and column of current position
                    let r = row + i * dy;
                    let c = col + i * dx;
                    // check if current position is on board and on diagonal
                    if (r >= 0 && r < 8 && c >= 0 && c < 8 && Math.abs(r - row) === Math.abs(c - col)) {
                        // add diagonal step to possible moves
                        possibleMoves.push(i * (8 * dy + dx));
                        // if there is a piece at current position, stop iterating along this diagonal
                        if (this.board[r * 8 + c] !== null) {
                            if (this.turn && this.board[this.selectedPiece.indexOfBoardPiece + (i * (8 * dy + dx))] < 16 || !turn && this.board[this.selectedPiece.indexOfBoardPiece + (i * (8 * dy + dx))] >= 16) {
                                possibleMoves.pop()
                            }
                            break;
                        }
                    } else {
                        // if current position is not on board or not on diagonal, stop iterating along this diagonal
                        break;
                    }
                }
            }
        }

        for (let i = 0; i < possibleMoves.length; i++) {
            if (possibleMoves[i] > 0 || possibleMoves[i] < 0) {
                moves.push(possibleMoves[i])
            }
        }
        return moves
    }

    queen() {
        let moves1 = this.rook()
        let moves2 = this.bishop()
        let moves = moves1.concat(moves2)
        moves.sort(function (a, b) {
            return a - b
        });
        return moves
    }

    king() {
        let moves = [-9, -8, -7, -1, 1, 7, 8, 9];
        let validMoves = [];

        for (let i = 0; i < moves.length; i++) {
            let destinationIndex = this.selectedPiece.indexOfBoardPiece + moves[i];
            if (destinationIndex < 0 || destinationIndex > 63) {
                continue // skip invalid moves
            }
            let destinationPiece = this.board[destinationIndex];
            if (moves[i] === -1 && Math.floor(destinationIndex % 8) === 7) {
                continue // skip left edge moves
            }
            if (moves[i] === 1 && Math.floor(destinationIndex % 8) === 0) {
                continue // skip right edge moves
            }
            if (Math.floor(destinationIndex % 8) > this.selectedPiece.col + 1 || Math.floor(destinationIndex % 8) < this.selectedPiece.col - 1) {
                continue
            }
            if ((this.turn && destinationPiece < 16 && destinationPiece !== null) || (!this.turn && destinationPiece >= 16)) {
            } else {
                validMoves.push(moves[i]);
            }
        }
        moves = validMoves
        return moves
    }


// gives the piece a green highlight for the user (showing its movable)
    givePieceBorder(moves) {
        this.selectedPiece.moves = moves
        if (this.selectedPiece.moves.length > 0) {
            this.selected.object.material.color = {r: 0, g: 1, b: 0}
            console.log(this.selectedPiece.moves);
            this.giveCellsClick();
        }
    }

// gives the cells on the board a 'click' based on the possible moves
    giveCellsClick() {
        console.log(this.cells)
        for (let i = 0; i < this.selectedPiece.moves.length; i++) {
            //this.cells[this.selectedPiece.indexOfBoardPiece + this.selectedPiece.moves[i]].setAttribute("onclick", ("makeMove(" + selectedPiece.moves[i] + ")"));
            this.cells[this.selectedPiece.indexOfBoardPiece + this.selectedPiece.moves[i]].material.opacity = 0.7;
            this.highlightedCells.push(this.cells[this.selectedPiece.indexOfBoardPiece + this.selectedPiece.moves[i]])
        }
        console.log(this.intersectsBoard[0].object.userData.index)
    }

//make move
    makeMove(number) {
        document.getElementById(selectedPiece.pieceId).remove();
        cells[selectedPiece.indexOfBoardPiece].innerHTML = "";
        if (turn) {
            if (selectedPiece.isQueen) {
                cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<p class="wQueen" id="${selectedPiece.pieceId}"></p>`;
                whitePieces = document.querySelectorAll("p");
            } else {
                cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<p class="${selectedPiece.class}" id="${selectedPiece.pieceId}"></p>`;
                whitePieces = document.querySelectorAll("p");
            }
        } else {
            if (selectedPiece.isQueen) {
                cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<span class="bQueen" id="${selectedPiece.pieceId}"></span>`;
                blackPieces = document.querySelectorAll("span");
            } else {
                cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<span class="${selectedPiece.class}" id="${selectedPiece.pieceId}"></span>`;
                blackPieces = document.querySelectorAll("span");
            }
        }

        let indexOfPiece = selectedPiece.indexOfBoardPiece
        if (number === 7 || number === -7 || number === 9 || number === -9) {
            changeData(indexOfPiece, indexOfPiece + number, indexOfPiece);
        } else {
            changeData(indexOfPiece, indexOfPiece + number);
        }
    }

// Changes the board states data on the back end

    changeData(indexOfBoardPiece, modifiedIndex, removePiece) {
        board[indexOfBoardPiece] = null;
        board[modifiedIndex] = parseInt(selectedPiece.pieceId);
        if (turn && selectedPiece.pieceId < 16 && modifiedIndex >= 57) {
            document.getElementById(selectedPiece.pieceId).classList.replace("wPawn", "wQueen")
        }
        if (turn === false && selectedPiece.pieceId >= 16 && modifiedIndex <= 7) {
            document.getElementById(selectedPiece.pieceId).classList.replace("bPawn", "bQueen")
        }
        if (turn && selectedPiece.pieceId < 16 && modifiedIndex >= 16) {
            document.getElementById(selectedPiece.pieceId).classList.remove("move2");
        }
        if (turn === false && selectedPiece.pieceId >= 16 && modifiedIndex <= 47) {
            document.getElementById(selectedPiece.pieceId).classList.remove("move2");
        }
        if (removePiece) {
            board[removePiece] = null;
            if (turn && selectedPiece.pieceId < 16) {
                cells[removePiece].innerHTML = "";
                blackScore--
            }
            if (turn === false && selectedPiece.pieceId >= 16) {
                cells[removePiece].innerHTML = "";
                whiteScore--
            }
        }
        resetSelectedPieceProperties();
        removeCellonclick();
        removeEventListeners();
    }

// removes the 'onClick' event listeners for pieces
    removeEventListeners() {
        if (turn) {
            for (let i = 0; i < whitePieces.length; i++) {
                whitePieces[i].removeEventListener("click", getPlayerPieces);
            }
        } else {
            for (let i = 0; i < blackPieces.length; i++) {
                blackPieces[i].removeEventListener("click", getPlayerPieces);
            }
        }
        checkForWin();
    }

// Checks for a win
    checkForWin() {
        if (blackScore === 0) {
            divider.style.display = "none";
            for (let i = 0; i < whiteTurntext.length; i++) {
                whiteTurntext[i].style.color = "black";
                blackTurntext[i].style.display = "none";
                whiteTurntext[i].textContent = "WHITE WINS!";
            }
        } else if (whiteScore === 0) {
            divider.style.display = "none";
            for (let i = 0; i < blackTurntext.length; i++) {
                blackTurntext[i].style.color = "black";
                whiteTurntext[i].style.display = "none";
                blackTurntext[i].textContent = "BLACK WINS!";
            }
        }
        changePlayer();
    }

// Switches players turn
    changePlayer() {
        if (turn) {
            turn = false;
            for (let i = 0; i < whiteTurntext.length; i++) {
                whiteTurntext[i].style.color = "lightGrey";
                blackTurntext[i].style.color = "black";
            }
        } else {
            turn = true;
            for (let i = 0; i < blackTurntext.length; i++) {
                blackTurntext[i].style.color = "lightGrey";
                whiteTurntext[i].style.color = "black";
            }
        }
        givePiecesEventListeners();
    }

}

export{
    game
}
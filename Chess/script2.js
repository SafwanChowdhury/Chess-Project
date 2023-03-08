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
    cells = document.querySelectorAll("td"); //boardPieces
    whitePieces = document.querySelectorAll("p"); //whitePieces array of objects / objectId's
    blacksPieces = document.querySelectorAll("span"); //blackPieces array of objects / objectId's
    whiteTurntext = document.querySelectorAll(".white-turn-text");
    blackTurntext = document.querySelectorAll(".black-turn-text");
    divider = document.querySelector("#divider");

    /*--- Player Properties ---*/
    turn = true; //need to export
    whiteScore = 16;
    blackScore = 16;
    playerPieces;

    /*--- selected piece properties ---*/
    selectedPiece = {
        pieceId: -1,
        indexOfBoardPiece: -1,
        row: 0,
        col: 0,
        class: '',
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
    /*---------- Event Listeners ----------*/

// initialize event listeners on pieces
    givePiecesEventListeners() {
        if (turn) {
            for (let i = 0; i < whitePieces.length; i++) {
                whitePieces[i].addEventListener("click", getPlayerPieces);
            }
        } else {
            for (let i = 0; i < blacksPieces.length; i++) {
                blacksPieces[i].addEventListener("click", getPlayerPieces);
            }
        }
    }

    /*---------- Logic ----------*/

// holds the length of the players piece count

    getPlayerPieces() {
        if (turn) {
            playerPieces = whitePieces;
        } else {
            playerPieces = blacksPieces;
        }
        removeCellonclick();
        resetBorders();
    }

// removes possible moves from old selected piece (* this is needed because the user might re-select a piece *)
    removeCellonclick() {
        for (let i = 0; i < cells.length; i++) {
            cells[i].removeAttribute("onclick");
            cells[i].removeAttribute("style");
        }
    }

// resets borders to default
    resetBorders() {
        for (let i = 0; i < playerPieces.length; i++) {
            playerPieces[i].style.border = "1px solid white";
        }
        resetSelectedPieceProperties();
        getSelectedPiece();
    }

// resets selected piece properties
    resetSelectedPieceProperties() {
        selectedPiece.pieceId = -1;
        selectedPiece.indexOfBoardPiece = -1;
        selectedPiece.row = 0;
        selectedPiece.col = 0;
        selectedPiece.class = "";
        selectedPiece.moveTwo = false;
        selectedPiece.isPawn = false;
        selectedPiece.isRook = false;
        selectedPiece.isKnight = false;
        selectedPiece.isBishop = false;
        selectedPiece.isQueen = false;
        selectedPiece.isKing = false;
        selectedPiece.isLeft = false;
        selectedPiece.isRight = false;
        selectedPiece.moves = [];
    }

// gets ID and index of the board cell its on
    getSelectedPiece() {
        selectedPiece.pieceId = parseInt(event.target.id);
        selectedPiece.indexOfBoardPiece = findPiece(selectedPiece.pieceId);
        selectedPiece.row = Math.floor(selectedPiece.indexOfBoardPiece / 8)
        selectedPiece.col = Math.floor(selectedPiece.indexOfBoardPiece % 8)
        selectedPiece.class = document.getElementById(selectedPiece.pieceId).classList.value;
        selectedPiece.isPawn = (document.getElementById(selectedPiece.pieceId).classList.contains("wPawn") || document.getElementById(selectedPiece.pieceId).classList.contains("bPawn"));
        selectedPiece.isRook = (document.getElementById(selectedPiece.pieceId).classList.contains("wRook") || document.getElementById(selectedPiece.pieceId).classList.contains("bRook"));
        selectedPiece.isKnight = (document.getElementById(selectedPiece.pieceId).classList.contains("wKnight") || document.getElementById(selectedPiece.pieceId).classList.contains("bKnight"));
        selectedPiece.isBishop = (document.getElementById(selectedPiece.pieceId).classList.contains("wBishop") || document.getElementById(selectedPiece.pieceId).classList.contains("bBishop"));
        selectedPiece.isQueen = (document.getElementById(selectedPiece.pieceId).classList.contains("wQueen") || document.getElementById(selectedPiece.pieceId).classList.contains("bQueen"));
        selectedPiece.isKing = (document.getElementById(selectedPiece.pieceId).classList.contains("wKing") || document.getElementById(selectedPiece.pieceId).classList.contains("bKing"));
        selectedPiece.moveTwo = document.getElementById(selectedPiece.pieceId).classList.contains("move2");
        if (selectedPiece.col === 0) {
            selectedPiece.isLeft = true;
        } else if (selectedPiece.col === 7) {
            selectedPiece.isRight = true;
        }
        if (selectedPiece.isRook)
            givePieceBorder(rook())
        else if (selectedPiece.isKnight)
            givePieceBorder(knight())
        else if (selectedPiece.isBishop)
            givePieceBorder(bishop())
        else if (selectedPiece.isQueen)
            givePieceBorder(queen())
        else if (selectedPiece.isKing)
            givePieceBorder(king())
        else
            givePieceBorder(pawn())
    }

    pawn() {
        let moves = []
        if (selectedPiece.pieceId < 16) { //white
            if (board[selectedPiece.indexOfBoardPiece + 8] === null) {
                moves.push(8)
            }
            if (selectedPiece.moveTwo) {
                if (board[selectedPiece.indexOfBoardPiece + 16] === null) {
                    moves.push(16)
                }
            }
            if (board[selectedPiece.indexOfBoardPiece + 7] >= 16 && selectedPiece.isLeft === false) {
                moves.push(7)
            }
            if (board[selectedPiece.indexOfBoardPiece + 9] >= 16 && selectedPiece.isRight === false) {
                moves.push(9)
            }
        } else { //black
            if (board[selectedPiece.indexOfBoardPiece - 8] === null) {
                moves.push(-8)
            }
            if (selectedPiece.moveTwo) {
                if (board[selectedPiece.indexOfBoardPiece - 16] === null) {
                    moves.push(-16)
                }
            }
            if (board[selectedPiece.indexOfBoardPiece - 7] < 16 && selectedPiece.isRight === false && board[selectedPiece.indexOfBoardPiece - 7] !== null) {
                moves.push(-7)
            }
            if (board[selectedPiece.indexOfBoardPiece - 9] < 16 && selectedPiece.isLeft === false && board[selectedPiece.indexOfBoardPiece - 9] !== null) {
                moves.push(-9)
            }
        }
        return moves
    }

    rook() {
        let moves = []
        let rowMove = getMovesInDirection(1, turn, board, selectedPiece).concat(getMovesInDirection(-1, turn, board, selectedPiece));
        let colMove = getMovesInDirection(8, turn, board, selectedPiece).concat(getMovesInDirection(-8, turn, board, selectedPiece));
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
                console.log("break1 " + newRow + " " + newCol)
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
            let destinationIndex = selectedPiece.indexOfBoardPiece + moves[i];
            if (destinationIndex < 0 || destinationIndex > 63) {
                continue // skip invalid moves
            }
            let destinationPiece = board[destinationIndex];
            if (moves[i] === -1 && Math.floor(destinationIndex % 8) === 7) {
                continue // skip left edge moves
            }
            if (moves[i] === 1 && Math.floor(destinationIndex % 8) === 0) {
                continue // skip right edge moves
            }
            if (Math.floor(destinationIndex % 8) > selectedPiece.col + 2 || Math.floor(destinationIndex % 8) < selectedPiece.col - 2) {
                continue
            }
            if ((turn && destinationPiece < 16 && destinationPiece !== null) || (!turn && destinationPiece >= 16)) {
            } else {
                validMoves.push(moves[i]);
            }
        }
        moves = validMoves
        return moves
    }

    bishop() {
        let position = selectedPiece.indexOfBoardPiece;
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
                        if (board[r * 8 + c] !== null) {
                            if (turn && board[selectedPiece.indexOfBoardPiece + (i * (8 * dy + dx))] < 16 || !turn && board[selectedPiece.indexOfBoardPiece + (i * (8 * dy + dx))] >= 16) {
                                possibleMoves.pop()
                                console.log("pop")
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
        let moves1 = rook()
        let moves2 = bishop()
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
            let destinationIndex = selectedPiece.indexOfBoardPiece + moves[i];
            if (destinationIndex < 0 || destinationIndex > 63) {
                continue // skip invalid moves
            }
            let destinationPiece = board[destinationIndex];
            if (moves[i] === -1 && Math.floor(destinationIndex % 8) === 7) {
                continue // skip left edge moves
            }
            if (moves[i] === 1 && Math.floor(destinationIndex % 8) === 0) {
                continue // skip right edge moves
            }
            if (Math.floor(destinationIndex % 8) > selectedPiece.col + 1 || Math.floor(destinationIndex % 8) < selectedPiece.col - 1) {
                continue
            }
            if ((turn && destinationPiece < 16 && destinationPiece !== null) || (!turn && destinationPiece >= 16)) {
            } else {
                validMoves.push(moves[i]);
            }
        }
        moves = validMoves
        return moves
    }


// gives the piece a green highlight for the user (showing its movable)
    givePieceBorder(moves) {
        selectedPiece.moves = moves
        if (selectedPiece.moves) {
            document.getElementById(selectedPiece.pieceId).style.border = "3px solid green";
            console.log(selectedPiece);
            giveCellsClick();
        }
    }

// gives the cells on the board a 'click' based on the possible moves
    giveCellsClick() {
        for (let i = 0; i < selectedPiece.moves.length; i++) {
            cells[selectedPiece.indexOfBoardPiece + selectedPiece.moves[i]].setAttribute("onclick", ("makeMove(" + selectedPiece.moves[i] + ")"));
            cells[selectedPiece.indexOfBoardPiece + selectedPiece.moves[i]].setAttribute("style", ("background-color: #2be34d"))
        }
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
                blacksPieces = document.querySelectorAll("span");
            } else {
                cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<span class="${selectedPiece.class}" id="${selectedPiece.pieceId}"></span>`;
                blacksPieces = document.querySelectorAll("span");
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
            for (let i = 0; i < blacksPieces.length; i++) {
                blacksPieces[i].removeEventListener("click", getPlayerPieces);
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
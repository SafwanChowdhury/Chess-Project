/*----------- Game State Data ----------*/

const board = [
    0, 1, 2, 3, 4, null, 6, 7,
    8, 9, 10, 11, 12, 13, 14, 15,
    null, null, null, null, null, null, null, null,
    null, null, 5, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    16, 17, 18, 19, 20, 21, 22, 23,
    24, 25, 26, 27, 28, 29, 30, 31
]

// parses pieceId's and returns the index of that piece's place on the board
let findPiece = function (pieceId) {
    let parsed = parseInt(pieceId);
    return board.indexOf(parsed);
};

/*------- DOM References -------*/
const cells = document.querySelectorAll("td");
let whitePieces = document.querySelectorAll("p");
let blacksPieces = document.querySelectorAll("span");
const whiteTurntext = document.querySelectorAll(".white-turn-text");
const blackTurntext = document.querySelectorAll(".black-turn-text");
const divider = document.querySelector("#divider");

/*--- Player Properties ---*/
let turn = true;
let whiteScore = 16;
let blackScore = 16;
let playerPieces;

/*--- selected piece properties ---*/
let selectedPiece = {
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

/*---------- Event Listeners ----------*/

// initialize event listeners on pieces
function givePiecesEventListeners() {
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
function getPlayerPieces() {
    if (turn) {
        playerPieces = whitePieces;
    } else {
        playerPieces = blacksPieces;
    }
    removeCellonclick();
    resetBorders();
}

// removes possible moves from old selected piece (* this is needed because the user might re-select a piece *)
function removeCellonclick() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeAttribute("onclick");
        cells[i].removeAttribute("style");
    }
}

// resets borders to default
function resetBorders() {
    for (let i = 0; i < playerPieces.length; i++) {
        playerPieces[i].style.border = "1px solid white";
    }
    resetSelectedPieceProperties();
    getSelectedPiece();
}

// resets selected piece properties
function resetSelectedPieceProperties() {
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
function getSelectedPiece() {
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
    if (selectedPiece.col === 0){
        selectedPiece.isLeft = true;
    }
    else if (selectedPiece.col === 7){
        selectedPiece.isRight = true;
    }
    if (selectedPiece.isRook)
        rook();
    else if (selectedPiece.isKnight)
        knight();
    else if (selectedPiece.isBishop)
        bishop();
    else if (selectedPiece.isQueen)
        queen();
    else if (selectedPiece.isKing)
        king();
    else
        pawn()
}

function pawn(){
    if (selectedPiece.pieceId < 16){ //white
        if (board[selectedPiece.indexOfBoardPiece + 8] === null){
            selectedPiece.moves.push(8)
        }
        if (selectedPiece.moveTwo){
            if (board[selectedPiece.indexOfBoardPiece + 16] === null) {
                selectedPiece.moves.push(16)
            }
        }
        if (board[selectedPiece.indexOfBoardPiece + 7] >= 16 && selectedPiece.isLeft === false) {
            selectedPiece.moves.push(7)
        }
        if (board[selectedPiece.indexOfBoardPiece + 9] >= 16 && selectedPiece.isRight === false) {
            selectedPiece.moves.push(9)
        }
    }
    else{ //black
        if (board[selectedPiece.indexOfBoardPiece - 8] === null){
            selectedPiece.moves.push(-8)
        }
        if (selectedPiece.moveTwo){
            if (board[selectedPiece.indexOfBoardPiece - 16] === null) {
                selectedPiece.moves.push(-16)
            }
        }
        if (board[selectedPiece.indexOfBoardPiece - 7] < 16 && selectedPiece.isRight === false && board[selectedPiece.indexOfBoardPiece - 7] !== null) {
            selectedPiece.moves.push(-7)
        }
        if (board[selectedPiece.indexOfBoardPiece - 9] < 16 && selectedPiece.isLeft === false && board[selectedPiece.indexOfBoardPiece - 9] !== null) {
            selectedPiece.moves.push(-9)
        }
    }
    givePieceBorder();
}

function rook(){
    let rowMove = getMovesInDirection(1, turn, board, selectedPiece).concat(getMovesInDirection(-1, turn, board, selectedPiece));
    let colMove = getMovesInDirection(8, turn, board, selectedPiece).concat(getMovesInDirection(-8, turn, board, selectedPiece));
    selectedPiece.moves = rowMove.concat(colMove)
    givePieceBorder();
}

function getMovesInDirection(direction, turn, board, selectedPiece) {
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



function knight(){
    givePieceBorder();
}

function bishop(){
    let position = selectedPiece.indexOfBoardPiece;
    let possibleMoves = [];

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
                        break;
                    }
                }
                else {
                    // if current position is not on board or not on diagonal, stop iterating along this diagonal
                    break;
                }
            }
        }
    }

    console.log(possibleMoves)
    for (let i = 0; i < possibleMoves.length; i++){
        if (possibleMoves[i] > 0 || possibleMoves[i] < 0){
            selectedPiece.moves.push(possibleMoves[i])
        }
    }
    console.log(selectedPiece.moves)
    givePieceBorder();
}

function queen(){
    givePieceBorder();
}

function king(){
    givePieceBorder();
}

// restricts movement if the piece is a Queen

// gives the piece a green highlight for the user (showing its movable)
function givePieceBorder() {
    if (selectedPiece.moves){
        document.getElementById(selectedPiece.pieceId).style.border = "3px solid green";
        console.log(selectedPiece);
        giveCellsClick();
    }
    else {
    }
}

// gives the cells on the board a 'click' based on the possible moves
function giveCellsClick() {
    for (let i = 0; i < selectedPiece.moves.length; i++){
        cells[selectedPiece.indexOfBoardPiece + selectedPiece.moves[i]].setAttribute("onclick", ("makeMove(" + selectedPiece.moves[i] + ")"));
        cells[selectedPiece.indexOfBoardPiece + selectedPiece.moves[i]].setAttribute("style", ("background-color: #2be34d"))
    }
}

//make move
function makeMove(number){
    document.getElementById(selectedPiece.pieceId).remove();
    cells[selectedPiece.indexOfBoardPiece].innerHTML = "";
    if (turn) {
        if (selectedPiece.isQueen){
            cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<p class="wQueen" id="${selectedPiece.pieceId}"></p>`;
            whitePieces = document.querySelectorAll("p");
        } else{
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
function changeData(indexOfBoardPiece, modifiedIndex, removePiece){
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
function removeEventListeners() {
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
function checkForWin() {
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
function changePlayer() {
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


givePiecesEventListeners();

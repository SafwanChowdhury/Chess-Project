/*----------- Game State Data ----------*/

const board = [
    0, 1, 2, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13, 14, 15,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    16, 17, 18, 19, 20, 21, 22, 23,
    24, 25, 26, 27, 28, 29, 30, 31
]

const left = [0,8,16,24,32,40,48,56]
const right = [7,15,23,31,39,47,55,63]

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
    class: '',
    moveTwo: false,
    isQueen: false,
    seventhSpace: false,
    eighthSpace: false,
    ninthSpace: false,
    fourteenthSpace: false,
    sixteenthSpace: false,
    eighteenthSpace: false,
    minusSeventhSpace: false,
    minusEighthSpace: false,
    minusNinthSpace: false,
    minusFourteenthSpace: false,
    minusSixteenthSpace: false,
    minusEighteenthSpace: false,
    isLeft: false,
    isRight: false
}

/*---------- Event Listeners ----------*/

// initialize event listeners on pieces
function givePiecesEventListeners() {
    if (turn) {
        for (let i = 0; i < whitePieces.length; i++) {
            whitePieces[i].addEventListener("click", getPlayerPieces);
        }
        console.log(whitePieces.length)
    } else {
        for (let i = 0; i < blacksPieces.length; i++) {
            blacksPieces[i].addEventListener("click", getPlayerPieces);
        }
        console.log(blacksPieces.length)
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
    selectedPiece.class = "";
    selectedPiece.moveTwo= false;
    selectedPiece.isQueen = false;
    selectedPiece.seventhSpace = false;
    selectedPiece.eighthSpace = false;
    selectedPiece.ninthSpace = false;
    selectedPiece.fourteenthSpace = false;
    selectedPiece.sixteenthSpace = false;
    selectedPiece.eighteenthSpace = false;
    selectedPiece.minusSeventhSpace = false;
    selectedPiece.minusEighthSpace = false;
    selectedPiece.minusNinthSpace = false;
    selectedPiece.minusFourteenthSpace = false;
    selectedPiece.minusSixteenthSpace = false;
    selectedPiece.minusEighteenthSpace = false;
    selectedPiece.isLeft = false;
    selectedPiece.isRight = false;
}

// gets ID and index of the board cell its on
function getSelectedPiece() {
    selectedPiece.pieceId = parseInt(event.target.id);
    selectedPiece.indexOfBoardPiece = findPiece(selectedPiece.pieceId);
    selectedPiece.class = document.getElementById(selectedPiece.pieceId).classList.value;
    isPieceQueen();
}

// checks if selected piece is a Queen
function isPieceQueen() {
    selectedPiece.isQueen = (document.getElementById(selectedPiece.pieceId).classList.contains("wQueen") || document.getElementById(selectedPiece.pieceId).classList.contains("bQueen"));
    isMove2();
}

function isMove2() {
    selectedPiece.moveTwo = document.getElementById(selectedPiece.pieceId).classList.contains("move2");
    isLeftOrRight();
}

function isLeftOrRight(){
    if (left.includes(selectedPiece.indexOfBoardPiece)){
        selectedPiece.isLeft = true;
    }
    else if (right.includes(selectedPiece.indexOfBoardPiece)){
        selectedPiece.isRight = true;
    }
    getAvailableSpaces();
}


// gets the moves that the selected piece can make
function getAvailableSpaces() {
    if (board[selectedPiece.indexOfBoardPiece + 8] === null){
        selectedPiece.eighthSpace = true;
    }
    if (board[selectedPiece.indexOfBoardPiece - 8] === null){
        selectedPiece.minusEighthSpace = true;
    }
    if (selectedPiece.moveTwo){
        if (board[selectedPiece.indexOfBoardPiece + 16] === null) {
            selectedPiece.sixteenthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 16] === null) {
            selectedPiece.minusSixteenthSpace = true;
        }
    }
    checkAvailableJumpSpaces();
}

// gets the moves that the selected piece can jump
function checkAvailableJumpSpaces() {
    if (turn) {
        if (board[selectedPiece.indexOfBoardPiece + 7] >= 16 && selectedPiece.isLeft === false) {
            selectedPiece.seventhSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece + 9] >= 16 && selectedPiece.isRight === false) {
            selectedPiece.ninthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 7] >= 16 && selectedPiece.isRight === false) {
            selectedPiece.minusSeventhSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 9] >= 16 && selectedPiece.isLeft === false) {
            selectedPiece.minusNinthSpace = true;
        }
    } else {
        if (board[selectedPiece.indexOfBoardPiece + 7] < 16 && selectedPiece.isLeft === false && board[selectedPiece.indexOfBoardPiece + 7] !== null) {
            selectedPiece.seventhSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece + 9] < 16 && selectedPiece.isRight === false && board[selectedPiece.indexOfBoardPiece + 9] !== null) {
            selectedPiece.ninthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 7] < 16 && selectedPiece.isRight === false && board[selectedPiece.indexOfBoardPiece - 7] !== null) {
            selectedPiece.minusSeventhSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 9] < 16 && selectedPiece.isLeft === false && board[selectedPiece.indexOfBoardPiece - 9] !== null) {
            selectedPiece.minusNinthSpace = true;
        }
    }
    checkPieceConditions();
}

// restricts movement if the piece is a Queen
function checkPieceConditions() {
    if (selectedPiece.isQueen) {
        givePieceBorder();
    }
    else {
        if (turn) {
            selectedPiece.minusSeventhSpace = false;
            selectedPiece.minusEighthSpace = false;
            selectedPiece.minusNinthSpace = false;
            selectedPiece.minusFourteenthSpace = false;
            selectedPiece.minusSixteenthSpace = false;
            selectedPiece.minusEighteenthSpace = false;
        }
        else {
            selectedPiece.seventhSpace = false;
            selectedPiece.eighthSpace = false;
            selectedPiece.ninthSpace = false;
            selectedPiece.fourteenthSpace = false;
            selectedPiece.sixteenthSpace = false;
            selectedPiece.eighteenthSpace = false;
        }
        givePieceBorder();
    }
}

// gives the piece a green highlight for the user (showing its movable)
function givePieceBorder() {
    if (selectedPiece.seventhSpace || selectedPiece.ninthSpace || selectedPiece.eighthSpace || selectedPiece.sixteenthSpace
        || selectedPiece.minusSeventhSpace || selectedPiece.minusEighthSpace || selectedPiece.minusNinthSpace || selectedPiece.minusSixteenthSpace) {
        document.getElementById(selectedPiece.pieceId).style.border = "3px solid green";
        console.log(selectedPiece);
        giveCellsClick();
    } else {
    }
}

// gives the cells on the board a 'click' bassed on the possible moves
function giveCellsClick() {
    if (selectedPiece.seventhSpace) {
        cells[selectedPiece.indexOfBoardPiece + 7].setAttribute("onclick", "makeMove(7)");
    }
    if (selectedPiece.eighthSpace) {
        cells[selectedPiece.indexOfBoardPiece + 8].setAttribute("onclick", "makeMove(8)");
    }
    if (selectedPiece.ninthSpace) {
        cells[selectedPiece.indexOfBoardPiece + 9].setAttribute("onclick", "makeMove(9)");
    }
    if (selectedPiece.sixteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece + 16].setAttribute("onclick", "makeMove(16)");
    }
    if (selectedPiece.minusSeventhSpace) {
        cells[selectedPiece.indexOfBoardPiece - 7].setAttribute("onclick", "makeMove(-7)");
    }
    if (selectedPiece.minusEighthSpace) {
        cells[selectedPiece.indexOfBoardPiece - 8].setAttribute("onclick", "makeMove(-8)");
    }
    if (selectedPiece.minusNinthSpace) {
        cells[selectedPiece.indexOfBoardPiece - 9].setAttribute("onclick", "makeMove(-9)");
    }
    if (selectedPiece.minusSixteenthSpace) {
        cells[selectedPiece.indexOfBoardPiece - 16].setAttribute("onclick", "makeMove(-16)");
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

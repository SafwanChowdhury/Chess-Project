/*----------- Game State Data ----------*/

const board = [
    null, null, null, null, null, null, null, null,
    0, 1, 2, 3, 4, 5, 6, 7,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    16, 17, 18, 19, 20, 21, 22, 23,
    null, null, null, null, null, null, null, null
]

// parses pieceId's and returns the index of that piece's place on the board
let findPiece = function (pieceId) {
    let parsed = parseInt(pieceId);
    return board.indexOf(parsed);
};

/*------- DOM References -------*/
const cells = document.querySelectorAll("td");
let redsPieces = document.querySelectorAll("p");
let blacksPieces = document.querySelectorAll("span");
const redTurntext = document.querySelectorAll(".red-turn-text");
const blackTurntext = document.querySelectorAll(".black-turn-text");
const divider = document.querySelector("#divider");

/*--- Player Properties ---*/
let turn = true;
let redScore = 12;
let blackScore = 12;
let playerPieces;

/*--- selected piece properties ---*/
let selectedPiece = {
    pieceId: -1,
    indexOfBoardPiece: -1,
    moveTwo: false,
    isKing: false,
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
    minusEighteenthSpace: false
}

/*---------- Event Listeners ----------*/

// initialize event listeners on pieces
function givePiecesEventListeners() {
    if (turn) {
        for (let i = 0; i < redsPieces.length; i++) {
            redsPieces[i].addEventListener("click", getPlayerPieces);
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
        playerPieces = redsPieces;
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
    selectedPiece.moveTwo= false;
    selectedPiece.isKing = false;
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
}

// gets ID and index of the board cell its on
function getSelectedPiece() {
    selectedPiece.pieceId = parseInt(event.target.id);
    selectedPiece.indexOfBoardPiece = findPiece(selectedPiece.pieceId);
    console.log(findPiece(selectedPiece.pieceId));
    isPieceKing();
}

// checks if selected piece is a king
function isPieceKing() {
    selectedPiece.isKing = document.getElementById(selectedPiece.pieceId).classList.contains("king");
    isMove2();
}

function isMove2() {
    selectedPiece.moveTwo = document.getElementById(selectedPiece.pieceId).classList.contains("move2");
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
        if (board[selectedPiece.indexOfBoardPiece + 7] >= 12) {
            selectedPiece.seventhSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece + 9] >= 12) {
            selectedPiece.ninthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 7] >= 12) {
            selectedPiece.minusSeventhSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 9] >= 12) {
            selectedPiece.minusNinthSpace = true;
        }
    } else {
        if (board[selectedPiece.indexOfBoardPiece + 7] < 12) {
            selectedPiece.seventhSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece + 9] < 12) {
            selectedPiece.ninthSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 7] < 12) {
            selectedPiece.minusSeventhSpace = true;
        }
        if (board[selectedPiece.indexOfBoardPiece - 9] < 12) {
            selectedPiece.minusNinthSpace = true;
        }
    }
    checkPieceConditions();
}

// restricts movement if the piece is a king
function checkPieceConditions() {
    if (selectedPiece.isKing) {
        givePieceBorder();
    } else {
        if (turn) {
            selectedPiece.minusSeventhSpace = false;
            selectedPiece.minusEighthSpace = false;
            selectedPiece.minusNinthSpace = false;
            selectedPiece.minusFourteenthSpace = false;
            selectedPiece.minusSixteenthSpace = false;
            selectedPiece.minusEighteenthSpace = false;
        } else {
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
        if (selectedPiece.isKing){
            cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<p class="red-piece king" id="${selectedPiece.pieceId}"></p>`;
            redsPieces = document.querySelectorAll("p");
        } else{
            cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<p class="red-piece" id="${selectedPiece.pieceId}"></p>`;
            redsPieces = document.querySelectorAll("p");
        }
    } else {
        if (selectedPiece.isKing) {
            cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<span class="black-piece king" id="${selectedPiece.pieceId}"></span>`;
            blacksPieces = document.querySelectorAll("span");
        } else {
            cells[selectedPiece.indexOfBoardPiece + number].innerHTML = `<span class="black-piece" id="${selectedPiece.pieceId}"></span>`;
            blacksPieces = document.querySelectorAll("span");
        }
    }

    let indexOfPiece = selectedPiece.indexOfBoardPiece
    if (number === 7 || number === -7 || number === 9 || number === -9) {
        changeData(indexOfPiece, indexOfPiece + number, indexOfPiece);
    } else {
        changeData(indexOfPiece, indexOfPiece);
    }
}

// Changes the board states data on the back end
function changeData(indexOfBoardPiece, modifiedIndex, removePiece){
    board[indexOfBoardPiece] = null;
    board[modifiedIndex] = parseInt(selectedPiece.pieceId);
    if (turn && selectedPiece.pieceId < 12 && modifiedIndex >= 57) {
        document.getElementById(selectedPiece.pieceId).classList.add("king")
    }
    if (turn === false && selectedPiece.pieceId >= 12 && modifiedIndex <= 7) {
        document.getElementById(selectedPiece.pieceId).classList.add("king");
    }
    if (turn && selectedPiece.pieceId < 12 && modifiedIndex >= 16) {
        document.getElementById(selectedPiece.pieceId).classList.remove("move2");
    }
    if (turn === false && selectedPiece.pieceId >= 12 && modifiedIndex <= 47) {
        document.getElementById(selectedPiece.pieceId).classList.remove("move2");
    }
    if (removePiece) {
        board[removePiece] = null;
        if (turn && selectedPiece.pieceId < 12) {
            cells[removePiece].innerHTML = "";
            blackScore--
        }
        if (turn === false && selectedPiece.pieceId >= 12) {
            cells[removePiece].innerHTML = "";
            redScore--
        }
    }
    resetSelectedPieceProperties();
    removeCellonclick();
    removeEventListeners();
}

// removes the 'onClick' event listeners for pieces
function removeEventListeners() {
    if (turn) {
        for (let i = 0; i < redsPieces.length; i++) {
            redsPieces[i].removeEventListener("click", getPlayerPieces);
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
        for (let i = 0; i < redTurntext.length; i++) {
            redTurntext[i].style.color = "black";
            blackTurntext[i].style.display = "none";
            redTurntext[i].textContent = "RED WINS!";
        }
    } else if (redScore === 0) {
        divider.style.display = "none";
        for (let i = 0; i < blackTurntext.length; i++) {
            blackTurntext[i].style.color = "black";
            redTurntext[i].style.display = "none";
            blackTurntext[i].textContent = "BLACK WINS!";
        }
    }
    changePlayer();
}

// Switches players turn
function changePlayer() {
    if (turn) {
        turn = false;
        for (let i = 0; i < redTurntext.length; i++) {
            redTurntext[i].style.color = "lightGrey";
            blackTurntext[i].style.color = "black";
        }
    } else {
        turn = true;
        for (let i = 0; i < blackTurntext.length; i++) {
            blackTurntext[i].style.color = "lightGrey";
            redTurntext[i].style.color = "black";
        }
    }
    givePiecesEventListeners();
}


givePiecesEventListeners();

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

    /*------- DOM References -------*/
    cells = []
    whitePieces = []
    blackPieces = []
    saviourPieces = [[],[]]
    pieces = []
    modified = []
    oldColor = {}
    oldPiece = null
    highlightedCells = []
    threatCells = []
    whiteTurntext = document.querySelectorAll(".white-turn-text");
    blackTurntext = document.querySelectorAll(".black-turn-text");
    divider = document.querySelector("#divider");
    checkPositionsPawn = [[],[]]
    checkPositionsRook = [[],[]]
    checkPositionsBishop = [[],[]]
    checkPositionsQueen = [[],[]]
    checkPositionsKnight = [[],[]]
    currentCheckPositions = [[],[]]
    check = []

    /*--- Player Properties ---*/
    turn = true; //1 == white, 0 == black
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
        let turn = this.turn ? 1 : 0
        if (this.check) {
            this.hypotheticalGame()
            console.log(this.saviourPieces[turn])
        }
        this.oldPiece = null
        this.intersectsBoard = intersectsBoard
        if ( intersectsPiece.length > 0 && intersectsPiece[0].object.parent.userData.taken !== true && (this.turn && intersectsPiece[0].object.parent.userData.pieceId < 16 || !this.turn && intersectsPiece[0].object.parent.userData.pieceId >= 16) ) {
            intersectsPiece[0].object.material.transparent = true;
            if (this.selected) {
                if (intersectsPiece[0] !== this.selected) {
                    this.selected.object.material.opacity = 1
                    this.selected.object.material.color = this.oldColor
                    for (let i = 0; i < this.highlightedCells.length; i++){
                        this.highlightedCells[i].material.opacity = 0
                        this.highlightedCells[i].material.color = {r: 0, g: 1, b: 0}
                    }
                }
            }
            intersectsPiece[0].object.material.opacity = 0.7;
            this.selected = intersectsPiece[0]
            this.oldColor = this.selected.object.material.color
            this.getPlayerPieces()
        }
        else{
            if (this.selected && intersectsBoard > 0 && this.highlightedCells.includes(intersectsBoard[0].object) !== true){
                this.resetSelectedPieceProperties();
            }
            else if (this.selected && intersectsBoard < 1){
                this.resetSelectedPieceProperties();
            }
            else{
                if(intersectsBoard[0] && this.selected && this.highlightedCells.includes(intersectsBoard[0].object)) {
                    this.makeMove(this.intersectsBoard[0].object.userData.index - this.selectedPiece.indexOfBoardPiece)
                }
            }
        }
    }

    /*---------- Logic ----------*/

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
        this.selected.object.material.opacity = 1
        this.selected.object.material.color = this.oldColor
        for (let i = 0; i < this.highlightedCells.length; i++){
            this.highlightedCells[i].material.opacity = 0
            this.highlightedCells[i].material.color = {r: 0, g: 1, b: 0}
        }
        let turn = 0
        if (this.turn)
            turn = 1
        for (let i = 0; i < this.currentCheckPositions[turn].length; i++) {
            this.cells[this.currentCheckPositions[turn][i]].material.opacity = 0;
            this.cells[this.currentCheckPositions[turn][i]].material.color = {r: 0, g: 1, b: 0}
        }
        this.selected = null
        this.highlightedCells = []
        this.selectedPiece.pieceId = -1;
        this.selectedPiece.indexOfBoardPiece = -1;
        this.selectedPiece.row = 0;
        this.selectedPiece.col = 0;
        this.selectedPiece.moveTwo = false;
        this.selectedPiece.type = ''
        this.selectedPiece.moves = [];
    }

// gets ID and index of the board cell its on
    getSelectedPiece() {
        let turn = 0
        if (this.turn)
            turn = 1

        this.selectedPiece.pieceId = this.selected.object.parent.userData.pieceId;
        this.selectedPiece.indexOfBoardPiece = this.selected.object.parent.userData.indexOfBoardPiece;
        this.selectedPiece.row = Math.floor(this.selectedPiece.indexOfBoardPiece / 8)
        this.selectedPiece.col = Math.floor(this.selectedPiece.indexOfBoardPiece % 8)
        this.selectedPiece.type = this.selected.object.name
        this.selectedPiece.moveTwo = this.selected.object.parent.userData.moveTwo;
        switch (this.selectedPiece.type) {
            case 'Rook':
                this.givePieceBorder(this.rook(this.turn, this.selectedPiece.indexOfBoardPiece));
                break;
            case 'Knight':
                this.givePieceBorder(this.knight(this.turn, this.selectedPiece.indexOfBoardPiece));
                break;
            case 'Bishop':
                this.givePieceBorder(this.bishop(this.turn, this.selectedPiece.indexOfBoardPiece));
                break;
            case 'Queen':
                this.givePieceBorder(this.queen(this.turn, this.selectedPiece.indexOfBoardPiece));
                break;
            case 'King':
                this.givePieceBorder(this.king(this.turn, this.selectedPiece.indexOfBoardPiece));
                break;
            default:
                this.givePieceBorder(this.pawn(this.turn, this.selectedPiece.indexOfBoardPiece, this.selectedPiece.moveTwo));
        }
    }

    pawn(turn, index, moveTwo) {
        let row = Math.floor(index / 8)
        let col = Math.floor(index % 8)
        let moves = []
        if (turn) { //white
            if (this.board[index + 8] === null) {
                moves.push(8)
            }
            if (moveTwo && this.board[index + 8] === null) {
                if (this.board[index + 16] === null) {
                    moves.push(16)
                }
            }
            if (this.board[index + 7] >= 16 && col !== 0) {
                moves.push(7)
            }
            if (this.board[index + 9] >= 16 && col !== 7) {
                moves.push(9)
            }
        } else { //black
            if (this.board[index - 8] === null) {
                moves.push(-8)
            }
            if (moveTwo && this.board[index - 8] === null) {
                if (this.board[index - 16] === null) {
                    moves.push(-16)
                }
            }
            if (this.board[index - 7] < 16 && col !== 7 && this.board[index - 7] !== null) {
                moves.push(-7)
            }
            if (this.board[index - 9] < 16 && col !== 0 && this.board[index - 9] !== null) {
                moves.push(-9)
            }
        }
        return moves
    }

    rook(turn, index) {
        let moves = []
        let rowMove = this.getMovesInDirection(1, turn, this.board, index).concat(this.getMovesInDirection(-1, turn, this.board, index));
        let colMove = this.getMovesInDirection(8, turn, this.board, index).concat(this.getMovesInDirection(-8, turn, this.board, index));
        moves = rowMove.concat(colMove)
        return moves
    }

    getMovesInDirection(direction, turn, board, index) {
        let row = Math.floor(index / 8)
        let col = Math.floor(index % 8)
        let moves = [];
        let maxOffset = 7 * (turn ? 8 : 1);
        for (let i = 1; i <= maxOffset; i++) {
            let offset = i * direction;
            let newRow = row + (turn ? offset / 8 : 0);
            let newCol = col + (turn ? 0 : offset);
            if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) {
            }
            let piece = board[index + offset];
            if (piece !== null) {
                if (turn && piece >= 16 || !turn && piece < 16) {
                    if (Math.floor((index + offset) % 8) === col || Math.floor((index + offset) / 8) === row) {
                        moves.push(offset);
                    }
                }
                break; // exit loop if the piece is the player's own piece or an opponent's piece
            } else if (Math.floor((index + offset) % 8) === col || Math.floor((index + offset) / 8) === row) {
                moves.push(offset);
            }
        }
        return moves;
    }


    knight(turn, index) {
        let row = Math.floor(index / 8)
        let col = Math.floor(index % 8)
        let moves = [-17, -15, -10, -6, 6, 10, 15, 17];
        let validMoves = [];

        for (let i = 0; i < moves.length; i++) {
            let destinationIndex = index + moves[i];
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
            if (Math.floor(destinationIndex % 8) > col + 2 || Math.floor(destinationIndex % 8) < col - 2) {
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

    bishop(turn, index) {
        let possibleMoves = [];
        let moves = []

// compute row and column of bishop
        let row = Math.floor(index / 8);
        let col = index % 8;

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
                            if (turn && this.board[index + (i * (8 * dy + dx))] < 16 || !turn && this.board[index + (i * (8 * dy + dx))] >= 16) {
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

    queen(turn, index) {
        let moves1 = this.rook(turn, index)
        let moves2 = this.bishop(turn, index)
        let moves = moves1.concat(moves2)
        moves.sort(function (a, b) {
            return a - b
        });
        return moves
    }

    king(turn, index) {
        for (let i = 0; i < this.threatCells.length; i++){
            this.threatCells[i].material.opacity = 0
            this.threatCells[i].material.color = {r: 0, g: 1, b: 0}
        }
        let row = Math.floor(index / 8)
        let col = Math.floor(index % 8)
        let moves = [-9, -8, -7, -1, 1, 7, 8, 9];
        let validMoves = [];
        for (let i = 0; i < moves.length; i++) {
            let destinationIndex = index + moves[i];
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
            if (Math.floor(destinationIndex % 8) > col + 1 || Math.floor(destinationIndex % 8) < col - 1) {
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
        this.selectedPiece.moves = moves
        if (this.selectedPiece.moves.length > 0) {
            this.selected.object.material.color = {r: 0, g: 1, b: 0}
            this.giveCellsClick();
        }
    }

    // gives the cells on the board a 'click' based on the possible moves
    giveCellsClick() {
        for (let i = 0; i < this.selectedPiece.moves.length; i++) {
            //this.cells[this.selectedPiece.indexOfBoardPiece + this.selectedPiece.moves[i]].setAttribute("onclick", ("makeMove(" + selectedPiece.moves[i] + ")"));
            this.cells[this.selectedPiece.indexOfBoardPiece + this.selectedPiece.moves[i]].material.opacity = 0.7;
            this.highlightedCells.push(this.cells[this.selectedPiece.indexOfBoardPiece + this.selectedPiece.moves[i]])
        }
    }

    //make move
    makeMove(number) {
        let previousIndex = this.selectedPiece.indexOfBoardPiece
        this.selectedPiece.indexOfBoardPiece += number
        this.selectedPiece.row = Math.floor(this.selectedPiece.indexOfBoardPiece / 8)
        this.selectedPiece.col = Math.floor(this.selectedPiece.indexOfBoardPiece % 8)
        if (this.board[this.selectedPiece.indexOfBoardPiece] !== null)
            this.changeData(previousIndex, this.selectedPiece.indexOfBoardPiece, true)
        else
            this.changeData(previousIndex, this.selectedPiece.indexOfBoardPiece, false)
    }

    // Changes the board states data on the back end

    changeData(previousIndex, modifiedIndex, removePiece) {
        if (removePiece) {
            this.oldPiece = this.board[modifiedIndex]
            if (this.turn && this.selectedPiece.pieceId < 16) {
                this.blackScore--
            }
            if (this.turn === false && this.selectedPiece.pieceId >= 16) {
                this.whiteScore--
            }
        }
        this.board[previousIndex] = null;
        this.board[modifiedIndex] = this.selectedPiece.pieceId;
        if (this.turn && this.selectedPiece.pieceId < 16 && modifiedIndex >= 57 && this.selectedPiece.type === 'Pawn') {
            this.selectedPiece.type = 'Queen'
            this.updatePiece();
            this.modified = [this.selectedPiece.pieceId, this.selectedPiece.row, this.selectedPiece.col, this.oldPiece, "models/wQueen.glb"]
            this.resetSelectedPieceProperties();
            this.checkForWin()
        }
        else if (!this.turn && this.selectedPiece.pieceId >= 16 && modifiedIndex <= 7 && this.selectedPiece.type === 'Pawn') {
            this.selectedPiece.type = 'Queen'
            this.updatePiece();
            this.modified = [this.selectedPiece.pieceId, this.selectedPiece.row, this.selectedPiece.col, this.oldPiece, "models/bQueen.glb"]
            this.resetSelectedPieceProperties();
            this.checkForWin()
        }
        else {
            if (this.turn && this.selectedPiece.pieceId < 16 && modifiedIndex >= 16) {
                this.selectedPiece.moveTwo = false
            }
            if (this.turn === false && this.selectedPiece.pieceId >= 16 && modifiedIndex <= 47) {
                this.selectedPiece.moveTwo = false
            }
            this.updatePiece();
            this.currentCheckPositions[this.turn ? 1 : 0] = this.checkablePositions(this.getKingIndex(), this.turn, 1)
            this.checkCheck()
            this.modified = [this.selectedPiece.pieceId, this.selectedPiece.row, this.selectedPiece.col, this.oldPiece]
            this.resetSelectedPieceProperties();
            this.checkForWin()
        }
    }

    updatePiece(){
        this.selected.object.parent.userData.pieceId = this.selectedPiece.pieceId;
        this.selected.object.parent.userData.indexOfBoardPiece = this.selectedPiece.indexOfBoardPiece;
        this.selected.object.parent.userData.row = this.selectedPiece.row;
        this.selected.object.parent.userData.col = this.selectedPiece.col;
        this.selected.object.parent.userData.type = this.selectedPiece.type;
        this.selected.object.parent.userData.moveTwo = this.selectedPiece.moveTwo;
    }

    // Checks for a win
    checkForWin() {
        if (this.blackScore === 0) {
            this.divider.style.display = "none";
            for (let i = 0; i < whiteTurntext.length; i++) {
                this.whiteTurntext[i].style.color = "black";
                this.blackTurntext[i].style.display = "none";
                this.whiteTurntext[i].textContent = "WHITE WINS!";
            }
        } else if (this.whiteScore === 0) {
            this.divider.style.display = "none";
            for (let i = 0; i < this.blackTurntext.length; i++) {
                this.blackTurntext[i].style.color = "black";
                this.whiteTurntext[i].style.display = "none";
                this.blackTurntext[i].textContent = "BLACK WINS!";
            }
        }
        this.changePlayer();
    }

    // Switches players turn
    changePlayer() {
        //this.displayGrid()
        if (this.turn) {
            this.turn = false;
            this.currentCheckPositions[this.turn ? 1 : 0] = this.checkablePositions(this.getKingIndex(), this.turn, 1)
            //highlight checkable positions
            for (let i = 0; i < this.currentCheckPositions[this.turn ? 1 : 0].length; i++) {
                this.cells[this.currentCheckPositions[this.turn ? 1 : 0][i]].material.opacity = 0.7;
                this.cells[this.currentCheckPositions[this.turn ? 1 : 0][i]].material.color = {r: 1, g: 0, b: 0}
            }
            for (let i = 0; i < this.whiteTurntext.length; i++) {
                this.whiteTurntext[i].style.color = "lightGrey";
                this.blackTurntext[i].style.color = "black";
            }
        } else {
            this.turn = true;
            this.currentCheckPositions[this.turn ? 1 : 0] = this.checkablePositions(this.getKingIndex(), this.turn, 1)
            //highlight checkable positions
            for (let i = 0; i < this.currentCheckPositions[this.turn ? 1 : 0].length; i++) {
                this.cells[this.currentCheckPositions[this.turn ? 1 : 0][i]].material.opacity = 0.7;
                this.cells[this.currentCheckPositions[this.turn ? 1 : 0][i]].material.color = {r: 1, g: 0, b: 0}
            }
            for (let i = 0; i < this.blackTurntext.length; i++) {
                this.blackTurntext[i].style.color = "lightGrey";
                this.whiteTurntext[i].style.color = "black";
            }
        }
    }

    displayGrid(){
        console.log(this.selectedPiece.indexOfBoardPiece)
        console.log("Check Positions: " , this.currentCheckPositions)
        console.log("Pawn Check Positions: " , this.checkPositionsPawn)
        console.log("Rook Check Positions: " , this.checkPositionsRook)
        console.log("Knight Check Positions: " , this.checkPositionsKnight)
        console.log("Bishop Check Positions: " , this.checkPositionsBishop)
        console.log("Queen Check Positions: " , this.checkPositionsQueen)
        for (let i = 0; i < 8; i++){
            console.log(this.board[(0 + (i * 8))], this.board[(1 + (i * 8))], this.board[(2 + (i * 8))], this.board[(3 + (i * 8))], this.board[(4 + (i * 8))], this.board[(5 + (i * 8))], this.board[(6 + (i * 8))], this.board[(7 + (i * 8))])
        }
    }

    checkablePositions(index, turn, modifier){
        let localBishop = []
        let localRook = []
        let localPawn = []
        let localKnight = []
        let localQueen = []
        let turnI = this.turn ? 1 : 0

        localPawn = this.checkPawn(turn, index)
        localBishop = this.bishop(turn, index)
        localRook = this.rook(turn, index)
        localKnight = this.knight(turn, index)
        localQueen = this.queen(turn,index)

        let checkPositions = localQueen.concat(localKnight.concat(localPawn))

        //cleanup checkable positions array
        for(let i=0; i < checkPositions.length; ++i) {
            for(let j=i+1; j < checkPositions.length; ++j) {
                if(checkPositions[i] === checkPositions[j])
                    checkPositions.splice(j--, 1);
            }
        }

        //highlight checkable positions
        for (let i = 0; i < checkPositions.length; i++) {
            this.threatCells.push(this.cells[index + checkPositions[i]])
        }

        if (modifier) {
            this.checkPositionsPawn[turnI] = localPawn.map(v=> v+index)
            this.checkPositionsBishop[turnI] = localBishop.map(v=> v+index)
            this.checkPositionsKnight[turnI] = localKnight.map(v=> v+index)
            this.checkPositionsRook[turnI] = localRook.map(v=> v+index)
            this.checkPositionsQueen[turnI] = localQueen.map(v=> v+index)
        }

        checkPositions = checkPositions.map(v=> v+index)
        return checkPositions
    }

    checkPawn(turn, index) {
        let moves = []
        let row = Math.floor(index / 8);
        let col = index % 8;
        if (turn) { //white
            if (this.board[index + 7] === null && col !== 0) {
                moves.push(7)
            }
            if (this.board[index + 9] === null && col !== 7) {
                moves.push(9)
            }
        } else { //black
            if (col !== 7 && this.board[index - 7] === null) {
                moves.push(-7)
            }
            if (col !== 0 && this.board[index - 9] === null) {
                moves.push(-9)
            }
        }
        return moves
    }

    checkCheck(){
        let turn = this.turn ? 1 : 0
        this.check[turn] = false
        let newMoves = []
        switch (this.selectedPiece.type) {
            case 'Rook':
                newMoves = this.rook(this.turn, this.selectedPiece.indexOfBoardPiece).map(v => v+this.selectedPiece.indexOfBoardPiece)
                if (newMoves.includes(this.board.indexOf(this.turn ? 27 : 3))){
                    console.log("check")
                    this.check[turn] = true
                }
                else if (this.checkPositionsRook[turn].includes(this.selectedPiece.indexOfBoardPiece)) {
                    console.log("check")
                    this.check[turn] = true
                }
                break;
            case 'Knight':
                newMoves = this.knight(this.turn, this.selectedPiece.indexOfBoardPiece).map(v => v+this.selectedPiece.indexOfBoardPiece)
                if (newMoves.includes(this.board.indexOf(this.turn ? 27 : 3))){
                    console.log("check")
                    this.check[turn] = true
                }
                else if (this.checkPositionsKnight[turn].includes(this.selectedPiece.indexOfBoardPiece)) {
                    console.log("check")
                    this.check[turn] = true
                }
                break;
            case 'Bishop':
                newMoves = this.bishop(this.turn, this.selectedPiece.indexOfBoardPiece).map(v => v+this.selectedPiece.indexOfBoardPiece)
                if (newMoves.includes(this.board.indexOf(this.turn ? 27 : 3))){
                    console.log("check")
                    this.check[turn] = true
                }
                else if (this.checkPositionsBishop[turn].includes(this.selectedPiece.indexOfBoardPiece)) {
                    console.log("check")
                    this.check[turn] = true
                }
                break;
            case 'Queen':
                newMoves = this.queen(this.turn, this.selectedPiece.indexOfBoardPiece).map(v => v+this.selectedPiece.indexOfBoardPiece)
                if (newMoves.includes(this.board.indexOf(this.turn ? 27 : 3))){
                    console.log("check")
                    this.check[turn] = true
                }
                else if (this.checkPositionsQueen[turn].includes(this.selectedPiece.indexOfBoardPiece)) {
                    console.log("check")
                    this.check[turn] = true
                }
                break;
            default:
                newMoves = this.checkPawn(this.turn, this.selectedPiece.indexOfBoardPiece).map(v => v+this.selectedPiece.indexOfBoardPiece)
                if (newMoves.includes(this.board.indexOf(this.turn ? 27 : 3))){
                    console.log("check")
                    this.check[turn] = true
                }
                else if (this.checkPositionsPawn[turn].includes(this.selectedPiece.indexOfBoardPiece)) {
                    console.log("check")
                    this.check[turn] = true
                }
        }
    }
    initKing(){
        this.currentCheckPositions[1] = this.checkablePositions(3, true, 1)
        this.currentCheckPositions[0] = this.checkablePositions(59, false, 1)
        this.hypotheticalGame()
    }

    getKingIndex(){
        let index = this.turn ? this.board.indexOf(3) : this.board.indexOf(27)
        return index
    }

    //calculates a hypothetical game where it can analyse the possible future moves of all pieces
    //used to find which piece can stop a king being in check
    hypotheticalGame() {
        let turn = this.turn ? 1 : 0
        let pieces = this.turn ? this.whitePieces : this.blackPieces
        let newRook = []
        let newKnight = []
        let newBishop = []
        let newQueen = []
        let newPawn = []
        let pieceSet = []
        for (let i = 0; i < pieces.length; i++) {
            switch (pieces[i].userData.name) {
                case 'Rook':
                    newRook = this.rook(this.turn, pieces[i].userData.indexOfBoardPiece).map(v => v + pieces[i].userData.indexOfBoardPiece)
                    if (this.currentCheckPositions[turn].some(element => newRook.includes(element))){
                        pieceSet.push(pieces[i])
                    }
                    break;
                case 'Knight':
                    newKnight = this.knight(this.turn, pieces[i].userData.indexOfBoardPiece).map(v => v + pieces[i].userData.indexOfBoardPiece)
                    if (this.currentCheckPositions[turn].some(element => newKnight.includes(element))){
                        pieceSet.push(pieces[i])
                    }
                    break;
                case 'Bishop':
                    newBishop = this.bishop(this.turn, pieces[i].userData.indexOfBoardPiece).map(v => v + pieces[i].userData.indexOfBoardPiece)
                    if (this.currentCheckPositions[turn].some(element => newBishop.includes(element))){
                        pieceSet.push(pieces[i])
                    }
                    break;
                case 'Queen':
                    newQueen = this.queen(this.turn, pieces[i].userData.indexOfBoardPiece).map(v => v + pieces[i].userData.indexOfBoardPiece)
                    if (this.currentCheckPositions[turn].some(element => newQueen.includes(element))){
                        pieceSet.push(pieces[i])
                    }
                    break;
                default:
                    newPawn = this.pawn(this.turn, pieces[i].userData.indexOfBoardPiece, pieces[i].moveTwo).map(v => v + pieces[i].userData.indexOfBoardPiece)
                    if (this.currentCheckPositions[turn].some(element => newPawn.includes(element))){
                        pieceSet.push(pieces[i])
                    }
            }
        }
        this.saviourPieces[turn] = pieceSet
    }


}

export{
    game
}
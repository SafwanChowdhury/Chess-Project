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
    pieces = []
    modified = []
    oldColor = {}
    oldPiece = null
    highlightedCells = []
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
        this.selected = null
        this.highlightedCells = []
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
        let turn = 0
        if (this.turn)
            turn = 1
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
            if (this.selectedPiece.moveTwo && this.board[this.selectedPiece.indexOfBoardPiece + 8] === null) {
                if (this.board[this.selectedPiece.indexOfBoardPiece + 16] === null) {
                    moves.push(16)
                }
            }
            if (this.board[this.selectedPiece.indexOfBoardPiece + 7] >= 16 && this.selectedPiece.isLeft === false) {
                moves.push(7)
            }
            if (this.board[this.selectedPiece.indexOfBoardPiece + 9] >= 16 && this.selectedPiece.isRight === false) {
                moves.push(9)
            }
        } else { //black
            if (this.board[this.selectedPiece.indexOfBoardPiece - 8] === null) {
                moves.push(-8)
            }
            if (this.selectedPiece.moveTwo && this.board[this.selectedPiece.indexOfBoardPiece - 8] === null) {
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
                            if (this.turn && this.board[this.selectedPiece.indexOfBoardPiece + (i * (8 * dy + dx))] < 16 || !this.turn && this.board[this.selectedPiece.indexOfBoardPiece + (i * (8 * dy + dx))] >= 16) {
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
        let turn = 0
        if (this.turn)
            turn = 0
        else
            turn = 1
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
        if (this.turn && this.selectedPiece.pieceId < 16 && modifiedIndex >= 57 && this.selectedPiece.isPawn) {
            this.selectedPiece.isQueen = true
            this.selectedPiece.isPawn = false
            this.updatePiece();
            this.modified = [this.selectedPiece.pieceId, this.selectedPiece.row, this.selectedPiece.col, "models/wQueen.glb", "white"]
            this.resetSelectedPieceProperties();
            this.checkForWin()
        }
        else if (!this.turn && this.selectedPiece.pieceId >= 16 && modifiedIndex <= 7 && this.selectedPiece.isPawn) {
            this.selectedPiece.isQueen = true
            this.selectedPiece.isPawn = false
            this.updatePiece();
            this.modified = [this.selectedPiece.pieceId, this.selectedPiece.row, this.selectedPiece.col, "models/bQueen.glb", "black"]
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
        this.selected.object.parent.userData.isPawn = this.selectedPiece.isPawn;
        this.selected.object.parent.userData.isRook = this.selectedPiece.isRook;
        this.selected.object.parent.userData.isKnight = this.selectedPiece.isKnight;
        this.selected.object.parent.userData.isBishop = this.selectedPiece.isBishop;
        this.selected.object.parent.userData.isQueen = this.selectedPiece.isQueen;
        this.selected.object.parent.userData.isKing = this.selectedPiece.isKing;
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
            for (let i = 0; i < this.whiteTurntext.length; i++) {
                this.whiteTurntext[i].style.color = "lightGrey";
                this.blackTurntext[i].style.color = "black";
            }
        } else {
            this.turn = true;
            for (let i = 0; i < this.blackTurntext.length; i++) {
                this.blackTurntext[i].style.color = "lightGrey";
                this.whiteTurntext[i].style.color = "black";
            }
        }
    }

    displayGrid(){
        for (let i = 0; i < 8; i++){
            console.log(this.board[(0 + (i * 8))], this.board[(1 + (i * 8))], this.board[(2 + (i * 8))], this.board[(3 + (i * 8))], this.board[(4 + (i * 8))], this.board[(5 + (i * 8))], this.board[(6 + (i * 8))], this.board[(7 + (i * 8))])
        }
    }

    checkablePositions(index, turn, modifier){
        let movesSetP = [9, 7, -7, -9]
        let movesSetK = [-17, -15, -10, -6, 6, 10, 15, 17]
        let localBishop = []
        let localRook = []
        let localPawn = []
        let localKnight = []
        let localQueen = []
        let row = Math.floor(index / 8);
        let col = index % 8;
        let turnI = 0
        if (turn)
            turnI = 1

        //diagonals
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
                        localBishop.push(i * (8 * dy + dx));
                    } else {
                        // if current position is not on board or not on diagonal, stop iterating along this diagonal
                        break;
                    }
                }
            }
        }

        //rook
        let rowMove = this.getMovesInDirectionNONSTOP(1, turn, this.board, index, row, col).concat(this.getMovesInDirectionNONSTOP(-1, turn, this.board, index, row, col));
        let colMove = this.getMovesInDirectionNONSTOP(8, turn, this.board, index, row, col).concat(this.getMovesInDirectionNONSTOP(-8, turn, this.board, index, row, col));

        localRook = rowMove.concat(colMove)

        for (let i = 0; i <= localRook.length; i++){
            if((index + localRook[i]) < 0 || (index + localRook[i]) > 63){
                localRook.splice(i, 1);
                i--
            }
        }

        for (let i = 0; i <= movesSetK.length; i++){
            if((index + movesSetK[i]) >= 0 && (index + movesSetK[i]) <= 63){
                localKnight.push(movesSetK[i])
            }
        }


        for (let i = 0; i <= movesSetP.length; i++){
            if((index + movesSetP[i]) >= 0 && (index + movesSetP[i]) <= 63){
                localPawn.push(movesSetP[i])
            }
        }

        localQueen = localRook.concat(localBishop)
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
            this.cells[index + checkPositions[i]].material.opacity = 0.7;
            this.cells[index + checkPositions[i]].material.color = {r: 1, g: 0, b: 0}
            this.highlightedCells.push(this.cells[index + checkPositions[i]])
        }

        if (modifier) {
            this.checkPositionsPawn[turnI] = localPawn
            this.checkPositionsBishop[turnI] = localBishop
            this.checkPositionsKnight[turnI] = localKnight
            this.checkPositionsRook[turnI] = localRook
            this.checkPositionsQueen[turnI] = localQueen
        }
        return checkPositions
    }


    getMovesInDirectionNONSTOP(direction, turn, board, index, row, col) {
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
                if (true) {
                    if (Math.floor((index + offset) % 8) === col || Math.floor((index + offset) / 8) === row) {
                        moves.push(offset);
                    }
                    if ((index + offset) < 0 || (index + offset) > 63){
                        break
                    }
                }
            } else if (Math.floor((index + offset) % 8) === col || Math.floor((index + offset) / 8) === row) {
                moves.push(offset);
            }
        }
        return moves;
    }


    checkCheck(){
        let turn = 1
        if (this.turn)
            turn = 0
        this.selectedPiece.moves.forEach(element => { if (this.currentCheckPositions[turn].includes(element)) {
            this.check[turn] = true
            console.log("check")
        } });
        this.check[turn] = false
    }

    initKing(){
        this.currentCheckPositions[1] = this.checkablePositions(3, true, 1)
        this.currentCheckPositions[0] = this.checkablePositions(59, false, 1)
        console.log(this.currentCheckPositions)
    }

}

export{
    game
}
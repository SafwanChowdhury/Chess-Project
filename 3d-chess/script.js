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
	];

	/*------- Global Variables -------*/
	cells = [];
	whitePieces = [];
	blackPieces = [];
	piecesIndex = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]];
	saviourPieces = [[], []];
	pieces = [];
	modified = [];
	castle = [];
	oldColor = {};
	oldPiece = null;
	highlightedCells = [];
	checkText = document.getElementById("check-text");
	checkContainer = document.getElementById("end-screen");
	checkPopup = document.getElementById("success-box");
	popupPawn = document.getElementById("pawn");
	checkPositionsPawn = [[], []];
	checkPositionsRook = [[], []];
	checkPositionsBishop = [[], []];
	checkPositionsQueen = [[], []];
	checkPositionsKnight = [[], []];
	currentCheckPositions = [[], []];
	threatPositions = [];
	threatIndex = [-1, -1]; //0 is the piece that is threatening the black king therefore white piece
	check = [];
	incr = 0;
	movesLog = [];
	moveSend = [];
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
		moves: [],
		hasMoved: false
	};
	selected = null;
	intersectsBoard = null;
	/*---------- Event Listeners ----------*/

	// initialize event listeners on pieces
	// This function handles the interactions with pieces and the board.
	givePiecesEventListeners(intersectsPiece, intersectsBoard) {
		// Determine which player's turn it is.
		let turnW = this.turn ? 1 : 0;
		this.oldPiece = null;
		this.intersectsBoard = intersectsBoard;

		// Check if the piece can be selected.
		const isValidPiece = intersectsPiece.length > 0 && intersectsPiece[0].object.parent.userData.taken !== true && (this.turn ? intersectsPiece[0].object.parent.userData.pieceId < 16 : intersectsPiece[0].object.parent.userData.pieceId >= 16);
		console.log(this.intersectsBoard);
		// If the piece is valid, update the appearance of the selected and previously selected pieces.
		if (isValidPiece) {
			if (this.selected && intersectsPiece[0] !== this.selected) {
				resetSelectedAppearance(this.selected, this.highlightedCells, this.oldColor);
			}

			// Determine if the current piece can be selected based on the game state. player not in check
			const canSelectPiece = !this.check[turnW] || this.saviourPieces[turnW].includes(intersectsPiece[0].object.parent) || intersectsPiece[0].object.userData.name === "King";

			// If the piece can be selected, update its appearance and retrieve the current player's pieces.
			if (canSelectPiece) {
				setSelectedAppearance(intersectsPiece[0], this);
				this.getPlayerPieces();
			}
		} else if (this.selected && (intersectsBoard < 1 || !this.highlightedCells.includes(intersectsBoard[0].object))) {
			// Reset the appearance of the selected piece and the highlighted cells.
			this.resetSelectedPieceProperties(this.selected, this.highlightedCells, this.oldColor);
		} else if (intersectsBoard[0] && this.selected && this.highlightedCells.includes(intersectsBoard[0].object)) {
			// Make a move to the selected board cell.
			this.makeMove(this.intersectsBoard[0].object.userData.index - this.selectedPiece.indexOfBoardPiece);
		}

		// Reset the appearance of the selected piece and the highlighted cells.
		function resetSelectedAppearance(selected, highlightedCells, oldColor) {
			selected.object.material.opacity = 1;
			selected.object.material.color = oldColor;
			for (let i = 0; i < highlightedCells.length; i++) {
				highlightedCells[i].material.opacity = 0;
				highlightedCells[i].material.color = {r: 0, g: 1, b: 0};
			}
		}

		// Set the appearance of the selected piece.
		function setSelectedAppearance(piece, context) {
			context.selected = piece;
			context.oldColor = context.selected.object.material.color;
			piece.object.material.transparent = true;
			piece.object.material.opacity = 0.7;
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
		if (this.selectedPiece.pieceId >= 0) {
			this.pieces[this.selectedPiece.pieceId].children[0].material.opacity = 1;
			this.pieces[this.selectedPiece.pieceId].children[0].material.color = this.oldColor;
		}
		for (let i = 0; i < this.highlightedCells.length; i++) {
			this.highlightedCells[i].material.opacity = 0;
			this.highlightedCells[i].material.color = {r: 0, g: 1, b: 0};
		}
		this.selected = null;
		this.highlightedCells = [];
		this.selectedPiece.pieceId = -1;
		this.selectedPiece.indexOfBoardPiece = -1;
		this.selectedPiece.row = 0;
		this.selectedPiece.col = 0;
		this.selectedPiece.moveTwo = false;
		this.selectedPiece.type = "";
		this.selectedPiece.moves = [];
		this.selectedPiece.hasMoved = false;
	}

	// gets ID and index of the board cell its on
	getSelectedPiece() {
		this.selectedPiece.pieceId = this.selected.object.parent.userData.pieceId;
		this.selectedPiece.indexOfBoardPiece = this.selected.object.parent.userData.indexOfBoardPiece;
		this.selectedPiece.row = Math.floor(this.selectedPiece.indexOfBoardPiece / 8);
		this.selectedPiece.col = Math.floor(this.selectedPiece.indexOfBoardPiece % 8);
		this.selectedPiece.type = this.selected.object.name;
		this.selectedPiece.moveTwo = this.selected.object.parent.userData.moveTwo;
		this.selectedPiece.hasMoved = this.selected.object.parent.userData.hasMoved;
		this.calculateMoves();
	}

	calculateMoves() {
		switch (this.selectedPiece.type) {
		case "Rook":
			this.givePieceBorder(this.rook(this.turn, this.selectedPiece.indexOfBoardPiece, this.board));
			break;
		case "Knight":
			this.givePieceBorder(this.knight(this.turn, this.selectedPiece.indexOfBoardPiece, this.board));
			break;
		case "Bishop":
			this.givePieceBorder(this.bishop(this.turn, this.selectedPiece.indexOfBoardPiece, this.board));
			break;
		case "Queen":
			this.givePieceBorder(this.queen(this.turn, this.selectedPiece.indexOfBoardPiece, this.board));
			break;
		case "King":
			this.givePieceBorder(this.king(this.turn, this.selectedPiece.indexOfBoardPiece, this.board, true));
			break;
		default:
			this.givePieceBorder(this.pawn(this.turn, this.selectedPiece.indexOfBoardPiece, this.selectedPiece.moveTwo, this.board));
		}
	}

	pawn(turn, index, moveTwo, board) {
		let col = Math.floor(index % 8);
		let moves = [];
		if (turn) { //white
			if (board[index + 8] === null) {
				moves.push(8);
			}
			if (moveTwo && board[index + 8] === null) {
				if (board[index + 16] === null) {
					moves.push(16);
				}
			}
			if (board[index + 7] >= 16 && col !== 0) {
				moves.push(7);
			}
			if (board[index + 9] >= 16 && col !== 7) {
				moves.push(9);
			}
		} else { //black
			if (board[index - 8] === null) {
				moves.push(-8);
			}
			if (moveTwo && board[index - 8] === null) {
				if (board[index - 16] === null) {
					moves.push(-16);
				}
			}
			if (board[index - 7] < 16 && col !== 7 && board[index - 7] !== null) {
				moves.push(-7);
			}
			if (board[index - 9] < 16 && col !== 0 && board[index - 9] !== null) {
				moves.push(-9);
			}
		}
		return moves;
	}

	rook(turn, index, board) {
		let rowMove = this.getMovesInDirection(1, turn, board, index).concat(this.getMovesInDirection(-1, turn, board, index));
		let colMove = this.getMovesInDirection(8, turn, board, index).concat(this.getMovesInDirection(-8, turn, board, index));
		return rowMove.concat(colMove);
	}

	getMovesInDirection(direction, turn, board, index) {
		let row = Math.floor(index / 8);
		let col = Math.floor(index % 8);
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


	knight(turn, index, board) {
		let col = Math.floor(index % 8);
		let moves = [-17, -15, -10, -6, 6, 10, 15, 17];
		let validMoves = [];

		for (let i = 0; i < moves.length; i++) {
			let destinationIndex = index + moves[i];
			if (destinationIndex < 0 || destinationIndex > 63) {
				continue; // skip invalid moves
			}
			let destinationPiece = board[destinationIndex];
			if (moves[i] === -1 && Math.floor(destinationIndex % 8) === 7) {
				continue; // skip left edge moves
			}
			if (moves[i] === 1 && Math.floor(destinationIndex % 8) === 0) {
				continue; // skip right edge moves
			}
			if (Math.floor(destinationIndex % 8) > col + 2 || Math.floor(destinationIndex % 8) < col - 2) {
				continue;
			}
			if ((turn && destinationPiece < 16 && destinationPiece !== null) || (!turn && destinationPiece >= 16)) {
			} else {
				validMoves.push(moves[i]);
			}
		}
		moves = validMoves;
		return moves;
	}

	bishop(turn, index, board) {
		let possibleMoves = [];
		let moves = [];

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
						if (board[r * 8 + c] !== null) {
							const isWhite = board[index + (i * (8 * dy + dx))] < 16;
							if ((turn && isWhite) || (!turn && !isWhite)) {
								possibleMoves.pop();
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
				moves.push(possibleMoves[i]);
			}
		}
		return moves;
	}

	queen(turn, index, board) {
		let moves1 = this.rook(turn, index, board);
		let moves2 = this.bishop(turn, index, board);
		let moves = moves1.concat(moves2);
		moves.sort(function (a, b) {
			return a - b;
		});
		return moves;
	}

	king(turn, index, board, modifier) {
		let col = Math.floor(index % 8);
		let moves = [-9, -8, -7, -1, 1, 7, 8, 9];
		let validMoves = [];
		for (let i = 0; i < moves.length; i++) {
			let destinationIndex = index + moves[i];
			if (destinationIndex < 0 || destinationIndex > 63) {
				continue; // skip invalid moves
			}
			let destinationPiece = board[destinationIndex];
			if (moves[i] === -1 && Math.floor(destinationIndex % 8) === 7) {
				continue; // skip left edge moves
			}
			if (moves[i] === 1 && Math.floor(destinationIndex % 8) === 0) {
				continue; // skip right edge moves
			}
			if (Math.floor(destinationIndex % 8) > col + 1 || Math.floor(destinationIndex % 8) < col - 1) {
				continue;
			}
			if ((turn && destinationPiece < 16 && destinationPiece !== null) || (!turn && destinationPiece >= 16)) {
			}
			else {
				validMoves.push(moves[i]);
			}
		}
		if (modifier) {
			return this.pinningCheck(validMoves, index, turn, board, true);
		}
		return validMoves;
	}

	pinningCheck(validMoves, index, turn, board, isKingMove) {
		let turnW = turn ? 1 : 0;
		let kingIndex = turn ? 3 : 27;
		let localBishop = [];
		let localRook = [];
		let localPawn = [];
		let localKnight = [];
		let localQueen = [];
		let possibleMoves;
		let invalidMoves = [];
		let kingPos = isKingMove ? index : board.indexOf(kingIndex);

		for (let i = 0; i < validMoves.length; i++) {
			let newBoard = board.slice();
			newBoard[index] = null;
			newBoard[index + validMoves[i]] = isKingMove ? kingIndex : this.selectedPiece.pieceId;

			if (isKingMove) {
				kingPos = index + validMoves[i];
			}

			localPawn = this.checkPawn(turn, kingPos, newBoard).map(v => v + kingPos);
			localBishop = this.bishop(turn, kingPos, newBoard).map(v => v + kingPos);
			localRook = this.rook(turn, kingPos, newBoard).map(v => v + kingPos);
			localKnight = this.knight(turn, kingPos, newBoard).map(v => v + kingPos);
			localQueen = this.queen(turn, kingPos, newBoard).map(v => v + kingPos);

			// Check for threats on the king
			[localPawn, localBishop, localRook, localKnight, localQueen].forEach(localMoves => {
				localMoves.forEach(moveIndex => {
					if (newBoard[moveIndex] && this.piecesIndex[turnW].includes(newBoard[moveIndex])) {
						let pieceName = this.pieces[newBoard[moveIndex]].userData.name;
						if ((isKingMove && pieceName !== "King") || (!isKingMove && pieceName !== this.selectedPiece.pieceName)) {
							invalidMoves.push(validMoves[i]);
						}
					}
				});
			});
		}

		possibleMoves = validMoves.filter(function (value) {
			return !invalidMoves.includes(value);
		});
		return possibleMoves;
	}

	// gives the piece a green highlight for the user (showing its movable)
	givePieceBorder(moves) {
		let turnW = this.turn ? 1 : 0;
		let threatMoves = [];
		if (this.selectedPiece.type === "King" && this.selectedPiece.hasMoved === false && !this.check[turnW]){ //player not in check
			moves = moves.concat(this.castling());
		}
		for (let i = 0; i < this.threatPositions.length; i++) {
			threatMoves.push(this.threatPositions[i] - this.selectedPiece.indexOfBoardPiece);
		}
		if (this.check[turnW] && this.selectedPiece.type !== "King") { //player in check
			this.selectedPiece.moves = moves.filter(x => threatMoves.includes(x) || this.board[x + this.selectedPiece.indexOfBoardPiece] == this.threatIndex[turnW]); //index of opponent piece threatening king
		} else if (this.selectedPiece.type !== "King") {
			this.selectedPiece.moves = this.pinningCheck(moves, this.selectedPiece.indexOfBoardPiece, this.turn, this.board, false);
		} else
			this.selectedPiece.moves = moves;
		if (this.selectedPiece.moves.length > 0) {
			this.pieces[this.selectedPiece.pieceId].children[0].material.color = {r: 0, g: 1, b: 0};
			this.giveCellsClick();
		}
	}

	// gives the cells on the board a 'click' based on the possible moves
	giveCellsClick() {
		for (let i = 0; i < this.selectedPiece.moves.length; i++) {
			this.cells[this.selectedPiece.indexOfBoardPiece + this.selectedPiece.moves[i]].material.opacity = 0.7;
			this.highlightedCells.push(this.cells[this.selectedPiece.indexOfBoardPiece + this.selectedPiece.moves[i]]);
		}
	}

	//make move
	makeMove(number) {
		this.movesLog.push([this.selectedPiece.pieceId, number]);
		console.log(this.movesLog);
		this.moveSend = [this.selectedPiece.pieceId, number];
		let castling = null;//false - kingside, true - queenside
		if (this.selectedPiece.type === "King" && number === -2){
			castling = false;
		}
		else if (this.selectedPiece.type === "King" && number === 2){
			castling = true;
		}
		let previousIndex = this.selectedPiece.indexOfBoardPiece;
		this.selectedPiece.indexOfBoardPiece += number;
		this.selectedPiece.row = Math.floor(this.selectedPiece.indexOfBoardPiece / 8);
		this.selectedPiece.col = Math.floor(this.selectedPiece.indexOfBoardPiece % 8);
		if (this.board[this.selectedPiece.indexOfBoardPiece] !== null)
			this.changeData(previousIndex, this.selectedPiece.indexOfBoardPiece, true, castling);
		else
			this.changeData(previousIndex, this.selectedPiece.indexOfBoardPiece, false, castling);
	}

	// Changes the board states data on the back end

	changeData(previousIndex, modifiedIndex, removePiece, castling) {
		if (removePiece) {
			this.oldPiece = this.board[modifiedIndex];
			this.piecesIndex[this.turn ? 1 : 0].splice(this.piecesIndex[this.turn ? 1 : 0].indexOf(this.oldPiece), 1);
			if (this.turn && this.selectedPiece.pieceId < 16) {
				this.blackScore--;
			}
			if (this.turn === false && this.selectedPiece.pieceId >= 16) {
				this.whiteScore--;
			}
		}
		this.board[previousIndex] = null;
		this.board[modifiedIndex] = this.selectedPiece.pieceId;
		if (this.turn && this.selectedPiece.pieceId < 16 && modifiedIndex >= 56 && this.selectedPiece.type === "Pawn") {
			this.selectedPiece.type = "Queen";
			this.updatePiece();
			this.modified = [this.selectedPiece.pieceId, this.selectedPiece.row, this.selectedPiece.col, this.oldPiece, "models/wQueen.glb", this.turn, null];
		}
		else if (!this.turn && this.selectedPiece.pieceId >= 16 && modifiedIndex <= 7 && this.selectedPiece.type === "Pawn") {
			this.selectedPiece.type = "Queen";
			this.updatePiece();
			this.modified = [this.selectedPiece.pieceId, this.selectedPiece.row, this.selectedPiece.col, this.oldPiece, "models/bQueen.glb", this.turn, null];
		}
		else {
			if (this.turn && this.selectedPiece.pieceId < 16 && modifiedIndex >= 16) {
				this.selectedPiece.moveTwo = false;
			}
			if (this.turn === false && this.selectedPiece.pieceId >= 16 && modifiedIndex <= 47) {
				this.selectedPiece.moveTwo = false;
			}
			this.updatePiece();
			this.modified = [this.selectedPiece.pieceId, this.selectedPiece.row, this.selectedPiece.col, this.oldPiece, null , this.turn, castling];
		}
		if (castling === false){
			this.castle = [this.turn ? 0 : 24, this.turn ? 0 : 7,  2];
			this.board[this.turn ? 0 : 56] = null;
			this.board[this.turn ? 2 : 58] = this.turn ? 0 : 24;
			this.pieces[this.turn ? 0 : 24].userData.indexOfBoardPiece = this.turn ? 2 : 58;
			this.pieces[this.turn ? 0 : 24].userData.hasMoved = true;
		}
		else if (castling === true){
			this.castle = [this.turn ? 7 : 31, this.turn ? 0 : 7, 4];
			this.board[this.turn ? 7 : 63] = null;
			this.board[this.turn ? 4 : 60] = this.turn ? 7 : 31;
			this.pieces[this.turn ? 7 : 31].userData.indexOfBoardPiece = this.turn ? 4 : 60;
			this.pieces[this.turn ? 7 : 31].userData.hasMoved = true;

		}
		//console.log("PieceId" , this.selectedPiece.pieceId, " Move: " , (this.selectedPiece.indexOfBoardPiece - previousIndex))
		this.currentCheckPositions[this.turn ? 1 : 0] = this.checkablePositions(this.getKingIndex(this.turn), this.turn, 1, this.board);
		this.checkForWin();
	}

	updatePiece() {
		this.pieces[this.selectedPiece.pieceId].userData.pieceId = this.selectedPiece.pieceId;
		this.pieces[this.selectedPiece.pieceId].userData.indexOfBoardPiece = this.selectedPiece.indexOfBoardPiece;
		this.pieces[this.selectedPiece.pieceId].userData.row = this.selectedPiece.row;
		this.pieces[this.selectedPiece.pieceId].userData.col = this.selectedPiece.col;
		this.pieces[this.selectedPiece.pieceId].userData.type = this.selectedPiece.type;
		this.pieces[this.selectedPiece.pieceId].userData.moveTwo = this.selectedPiece.moveTwo;
		this.pieces[this.selectedPiece.pieceId].userData.moves = this.selectedPiece.moves;
		if (this.pieces[this.selectedPiece.pieceId].userData.hasMoved === false){
			this.pieces[this.selectedPiece.pieceId].userData.hasMoved = true;
		}
	}

	// Checks for a win
	checkForWin() {
		let turnW = this.turn ? 1 : 0;
		if (this.checkCheck(this.turn)) {
			if (this.turn) {
				console.log("white win");
				this.checkText.textContent = "White Win!!!";
				this.checkPopup.hidden = false;
				this.checkContainer.style.pointerEvents = "auto";
			} else if (!this.turn) {
				console.log("black win");
				this.checkText.textContent = "Black Win!!!";
				this.checkText.style.color = "Black";
				this.checkText.style.opacity = "1";
				this.popupPawn.style.filter = "invert(10%)";
				this.checkPopup.hidden = false;
				this.checkContainer.style.pointerEvents = "auto";
			}
		}
		if (this.check[turnW] === true) {
			this.cells[this.board.indexOf(this.turn ? 27 : 3)].material.opacity = 0;
			this.cells[this.board.indexOf(this.turn ? 27 : 3)].material.color = {r: 0, g: 1, b: 0};
		}
		this.incr++;
		this.resetSelectedPieceProperties();
		this.changePlayer();
	}

	// Switches players turn
	changePlayer() {
		this.incr++;
		if (this.turn) {
			this.turn = false;
			this.currentCheckPositions[this.turn ? 1 : 0] = this.checkablePositions(this.getKingIndex(this.turn), this.turn, 1, this.board);
		} else {
			this.turn = true;
			this.currentCheckPositions[this.turn ? 1 : 0] = this.checkablePositions(this.getKingIndex(this.turn), this.turn, 1, this.board);
		}
	}


	castling(){
		let moves = [];
		let path = [];
		let index = this.turn ? 3 : 27;
		let kingSideRook = this.turn ? 0 : 24;
		let queenSideRook = this.turn ? 7 : 31;
		let kingMoves = this.king(this.turn, index,this.board, true).map(v => v + index);
		let rookMovesKing = this.rook(this.turn, kingSideRook,this.board).map(v => v + kingSideRook);
		let rookMovesQueen = this.rook(this.turn,queenSideRook, this.board).map(v => v + queenSideRook);
		let intersectionKing = rookMovesKing.filter(element => kingMoves.includes(element));
		let intersectionQueen = rookMovesQueen.filter(element => kingMoves.includes(element));
		if (this.pieces[kingSideRook].userData.hasMoved === false && intersectionKing.length > 0) {
			path.push(-1);
		}
		if (this.pieces[queenSideRook].userData.hasMoved === false && intersectionQueen.length > 0) {
			path.push(1);
		}
		path = this.pinningCheck(path,index,this.turn,this.board, true);
		if (path.includes(1)){
			moves.push(2);
		}
		if (path.includes(-1)){
			moves.push(-2);
		}
		moves = this.pinningCheck(moves,index,this.turn,this.board,true);

		return moves;
	}

	// Calculates the positions that the piece on the given index can move to
	// and returns them as an array.
	// `turn` indicates whether it is white's turn or black's turn.
	// `modifier` indicates whether the checkable positions should be modified.
	checkablePositions(index, turn, modifier, board) {
		// `turnW` is a boolean that indicates whether it is white's turn or not.
		// It is used to index into various arrays.
		const turnW = turn ? 1 : 0;
		// Initialize local variables to store the possible moves for each piece.
		let localPawn;
		let localKnight;
		let localBishop;
		let localRook;
		let localQueen;
		// Calculate the possible moves for the piece on the given index.
		localPawn = this.checkPawn(turn, index, board);
		localKnight = this.knight(turn, index, board);
		localBishop = this.bishop(turn, index, board);
		localRook = this.rook(turn, index, board);
		localQueen = this.queen(turn, index, board);
		// Combine the possible moves for all pieces into one array.
		let checkPositions = localQueen.concat(localKnight.concat(localPawn));
		// Remove duplicate moves.
		for (let i = 0; i < checkPositions.length; ++i) {
			for (let j = i + 1; j < checkPositions.length; ++j) {
				if (checkPositions[i] === checkPositions[j])
					checkPositions.splice(j--, 1);
			}
		}
		// If `modifier` is true, update the check positions for each type of piece.
		if (modifier) {
			this.checkPositionsPawn[turnW] = localPawn.map(v => v + index);
			this.checkPositionsBishop[turnW] = localBishop.map(v => v + index);
			this.checkPositionsKnight[turnW] = localKnight.map(v => v + index);
			this.checkPositionsRook[turnW] = localRook.map(v => v + index);
			this.checkPositionsQueen[turnW] = localQueen.map(v => v + index);
		}
		// Add the index to each move and return the resulting array.
		checkPositions = checkPositions.map(v => v + index);
		return checkPositions;
	}

	// Calculates the possible moves for a pawn and returns them as an array.
	checkPawn(turn, index, board) {
		let moves = [];

		// Calculate the column of the pawn.
		let col = index % 8;

		if (turn) { //white
			if (board[index + 7] === null && col !== 0) {
				moves.push(7);
			}
			if (board[index + 9] === null && col !== 7) {
				moves.push(9);
			}
		} else { //black
			if (col !== 7 && board[index - 7] === null) {
				moves.push(-7);
			}
			if (col !== 0 && board[index - 9] === null) {
				moves.push(-9);
			}
		}

		return moves;
	}

	// Checks whether the current player is in check.
	checkCheck(turn) {
		//turnW is a boolean that indicates whether it is white's turn or not.
		//It is used to index into various arrays.
		//turnB is a boolean that indicates whether it is black's turn or not.
		//1 = white, 0 = black
		const turnW = turn ? 1 : 0; //-player
		const turnB = !turn ? 1 : 0;//-opponent

		// Set the opposing player's check status to false.
		this.check[turnB] = false;

		let newMoves = [];

		// Determine the type and index of the selected piece.
		const pieceType = this.selectedPiece.type;
		const pieceIndex = this.selectedPiece.indexOfBoardPiece;
		// Calculate the possible future moves for the selected piece.
		switch (pieceType) {
		case "Rook":
			newMoves = this.rook(turn, pieceIndex, this.board).map(v => v + pieceIndex);
			break;
		case "Knight":
			newMoves = this.knight(turn, pieceIndex, this.board).map(v => v + pieceIndex);
			break;
		case "Bishop":
			newMoves = this.bishop(turn, pieceIndex, this.board).map(v => v + pieceIndex);
			break;
		case "Queen":
			newMoves = this.queen(turn, pieceIndex, this.board).map(v => v + pieceIndex);
			break;
		default:
			//bug identified in moveTwo, some cases moveTwo needs to be 1 where a piece can move two and put king in check
			// a temporary fix is to set moveTwo to 0
			//this however still does not correctly pin the king
			newMoves = this.pawn(this.turn, pieceIndex,0, this.board).map(v => v + pieceIndex);
			break;
		}

		// If the current player's piece is attacking the opposing player's king or
		// the opposing player's king is in any of the possible moves, set the opposing
		// player's check status to true.
		if (this[`checkPositions${pieceType}`] !== undefined) {
			if (newMoves.includes(this.board.indexOf(this.turn ? 27 : 3)) ||
                this[`checkPositions${pieceType}`][turnB].includes(pieceIndex)) {
				// Store the threatening positions in `threatPositions`.
				this.threatPositions = this.currentCheckPositions[turnB].filter(x => newMoves.includes(x));
				// If the opposing player is in checkmate, return 1. Otherwise, set the
				// opposing player's check status to true, identify the threatening piece,
				// and return 0.
				this.check[turnB] = true;
				this.threatIndex[turnB] = this.selectedPiece.pieceId; //set opponents threatening piece index
				let checkmate = this.checkmate(turn);
				if (checkmate) {
					return 1;
				} else {
					console.log("check");
					this.cells[this.board.indexOf(turn ? 27 : 3)].material.opacity = 1;
					this.cells[this.board.indexOf(turn ? 27 : 3)].material.color = {r: 1, g: 0, b: 0};
					return (checkmate ? 1 : 0);
				}
			}
		}
	}

	checkmate(turn) {
		let oppTurn = !turn; //opposingPlayer
		let turnB = this.turn ? 0 : 1;
		this.findSaviour(oppTurn);
		let moves = this.king(oppTurn, this.getKingIndex(oppTurn), this.board, true);
		console.log("moves", moves, this.saviourPieces[turnB], this.threatIndex[turnB]);
		if (moves.length === 0 && this.saviourPieces[turnB].length === 0 && this.threatIndex[turnB] > -1) {
			console.log("checkmate");
			return true;
		}
		return false;
	}

	initKing() {
		this.currentCheckPositions[1] = this.checkablePositions(3, true, 1, this.board);
		this.currentCheckPositions[0] = this.checkablePositions(59, false, 1, this.board);
	}

	getKingIndex(turn) {
		return (turn ? this.board.indexOf(3) : this.board.indexOf(27));
	}

	//calculates a hypothetical game where it can analyse the possible future moves of all pieces
	//used to find which piece can stop a king being in check
	findSaviour(turn) {
		let turnW = turn ? 1 : 0;
		const pieces = turn ? this.whitePieces : this.blackPieces;
		const pieceSet = [];
		let threatPath = [];
		let path = [];
		let threatPiece = this.pieces[this.threatIndex[turnW]];
		switch (threatPiece.userData.name) {
		case "Rook":
			path = this.rook(turn, threatPiece.userData.indexOfBoardPiece, this.board).map(v => v + threatPiece.userData.indexOfBoardPiece);
			threatPath = path.filter(value => this.checkPositionsRook[turnW].includes(value));
			break;
		case "Knight":
			path = this.knight(turn, threatPiece.userData.indexOfBoardPiece, this.board).map(v => v + threatPiece.userData.indexOfBoardPiece);
			threatPath = path.filter(value => this.checkPositionsKnight[turnW].includes(value));
			break;
		case "Bishop":
			path = this.bishop(turn, threatPiece.userData.indexOfBoardPiece, this.board).map(v => v + threatPiece.userData.indexOfBoardPiece);
			threatPath = path.filter(value => this.checkPositionsBishop[turnW].includes(value));
			break;
		case "Queen":
			path = this.queen(turn, threatPiece.userData.indexOfBoardPiece, this.board).map(v => v + threatPiece.userData.indexOfBoardPiece);
			threatPath = path.filter(value => this.checkPositionsQueen[turnW].includes(value));
			break;
		default:
			path = this.pawn(turn, threatPiece.userData.indexOfBoardPiece, threatPiece.userData.moveTwo, this.board).map(v => v + threatPiece.userData.indexOfBoardPiece);
			threatPath = path.filter(value => this.checkPositionsPawn[turnW].includes(value));
		}
		pieces.forEach((piece) => {
			let newPositions;
			switch (piece.userData.name) {
			case "Rook":
				newPositions = this.rook(turn, piece.userData.indexOfBoardPiece, this.board).map(v => v + piece.userData.indexOfBoardPiece);
				break;
			case "Knight":
				newPositions = this.knight(turn, piece.userData.indexOfBoardPiece, this.board).map(v => v + piece.userData.indexOfBoardPiece);
				break;
			case "Bishop":
				newPositions = this.bishop(turn, piece.userData.indexOfBoardPiece, this.board).map(v => v + piece.userData.indexOfBoardPiece);
				break;
			case "Queen":
				newPositions = this.queen(turn, piece.userData.indexOfBoardPiece, this.board).map(v => v + piece.userData.indexOfBoardPiece);
				break;
			default:
				newPositions = this.pawn(turn, piece.userData.indexOfBoardPiece, piece.userData.moveTwo, this.board).map(v => v + piece.userData.indexOfBoardPiece);
			}
			if (newPositions.some(element => threatPath.includes(element))) {
				pieceSet.push(piece);
			}
		});
		this.saviourPieces[turnW] = pieceSet;
	}


	unitTest(id, move) {
		this.testPieceData(id);
		this.makeMove(move);
	}

	testPieceData(index) {
		let turnW = this.turn ? 1 : 0;
		if (this.turn) {
			this.playerPieces = this.whitePieces;
		} else {
			this.playerPieces = this.blackPieces;
		}
		this.oldColor = this.pieces[index].children[0].material.color;
		this.selectedPiece.pieceId = this.pieces[index].userData.pieceId;
		this.selectedPiece.indexOfBoardPiece = this.pieces[index].userData.indexOfBoardPiece;
		this.selectedPiece.row = Math.floor(this.selectedPiece.indexOfBoardPiece / 8);
		this.selectedPiece.col = Math.floor(this.selectedPiece.indexOfBoardPiece % 8);
		this.selectedPiece.type = this.pieces[index].children[0].name;
		this.selectedPiece.moveTwo = this.pieces[index].userData.moveTwo;
		this.calculateMoves();
	}

}

export {
	game
};
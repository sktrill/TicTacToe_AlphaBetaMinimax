var kBoardWidth = 3;
var kBoardHeight= 3;
var kPieceWidth = 180;
var kPieceHeight= 180;
var kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
var kPixelHeight= 1 + (kBoardHeight * kPieceHeight);

var gCanvasElement;
var gDrawingContext;

var gPieces;
var gNumPieces;
var gGameSummary; 
var gGameInProgress;
var gTurn;
var gPCWins; // to track if PC (perfect player) wins

// object for each cell on the board
function Cell(row, column, value, win) {
    this.row = row;
    this.column = column;
	this.value = value; // 0 - empty, 1 - x, 2 - 0 (zero)
	this.win = win;
}

// checks if game has ended and accordingly draws winning pattern (in red) and displays message
function endGame() {
    gGameInProgress = false;
	setWinner();
	for (var i = 0; i < 9; i++) {
		if(gPieces[i].win == true) {
			drawPiece(gPieces[i], true);
			gPCWins = true;
		}
	}
	if (gPCWins) {
		gGameSummary.innerHTML = "PC Wins. Who starts?";
	}
	else {
		gGameSummary.innerHTML = "Draw. Who starts?";
	}
}

// returns Cell with .row and .column properties
function getCursorPosition(e) {
    
    var x;
    var y;
	
	// gets coordinates relative to canvas
    if(e.offsetX) {
        x = e.offsetX;
        y = e.offsetY;
    }
    else if(e.layerX) {
        x = e.layerX;
        y = e.layerY;
    }
	/* for canvas position relative to page
    if (e.pageX != undefined && e.pageY != undefined) {
	x = e.pageX;
	y = e.pageY;
    }
    else {
	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;
    */
	
	x = Math.min(x, kBoardWidth * kPieceWidth);
    y = Math.min(y, kBoardHeight * kPieceHeight);
	
    var cell = new Cell(Math.floor(y/kPieceHeight), Math.floor(x/kPieceWidth), 0,false);
    return cell;
}

// checks all 8 possible win patterns (3 horizontal lines + 3 vertical lines + 2 diagonal lines)
function isTheGameOver() {
	if (((gPieces[0].value * gPieces[1].value * gPieces[2].value) == 1) || ((gPieces[0].value * gPieces[1].value * gPieces[2].value) == 8)) {
		return true;
	}
	else if (((gPieces[3].value * gPieces[4].value * gPieces[5].value) == 1) || ((gPieces[3].value * gPieces[4].value * gPieces[5].value) == 8)) {
		return true;
	}
	else if (((gPieces[6].value * gPieces[7].value * gPieces[8].value) == 1) || ((gPieces[6].value * gPieces[7].value * gPieces[8].value) == 8)) {
		return true;
	}
	else if (((gPieces[2].value * gPieces[5].value * gPieces[8].value) == 1) || ((gPieces[2].value * gPieces[5].value * gPieces[8].value) == 8)) {
		return true;
	}
	else if (((gPieces[1].value * gPieces[4].value * gPieces[7].value) == 1) || ((gPieces[1].value * gPieces[4].value * gPieces[7].value) == 8)) {
	return true;
	}
	else if (((gPieces[0].value * gPieces[3].value * gPieces[6].value) == 1) || ((gPieces[0].value * gPieces[3].value * gPieces[6].value) == 8)) {
		return true;
	}
	else if (((gPieces[2].value * gPieces[4].value * gPieces[6].value) == 1) || ((gPieces[2].value * gPieces[4].value * gPieces[6].value) == 8)) {
		return true;
	}
	else if (((gPieces[0].value * gPieces[4].value * gPieces[8].value) == 1) || ((gPieces[0].value * gPieces[4].value * gPieces[8].value) == 8)) {
		return true;
	}
	else if ((gPieces[0].value * gPieces[1].value * gPieces[2].value * gPieces[3].value * gPieces[4].value * gPieces[5].value * gPieces[6].value * gPieces[7].value * gPieces[8].value) != 0) {
		return true;
	}
	else {
		return false;
	}
}

// returns all possible moves on the board
function possibleMoves () {
	var nextMoves = [];
	var j = 0;
	
	if (isTheGameOver()) {
		nextMoves[j] = -999; // returns dummy value if game is over, i.e. no next moves possible
		return nextMoves;
	}
	for (var i = 0; i < 9; i++) {
		if (gPieces[i].value == 0) {
			nextMoves[j] = gPieces[i].row;
			nextMoves[j+1] = gPieces[i].column;	
			j+=2;
		}
	}
	return nextMoves;
}

// finds and sets final winning pattern
function setWinner () {
	findWinPattern (0,1,2);
	findWinPattern (0,1,2);
	findWinPattern (3,4,5);
	findWinPattern (6,7,8);
	findWinPattern (2,5,8);
	findWinPattern (1,4,7);
	findWinPattern (0,3,6);
	findWinPattern (2,4,6);
	findWinPattern (0,4,8);
}

function findWinPattern (cell1, cell2, cell3) {
	if ((gPieces[cell1].value * gPieces[cell2].value * gPieces[cell3].value == 1)||(gPieces[cell1].value * gPieces[cell2].value * gPieces[cell3].value == 8)) {
		gPieces[cell1].win = true;
		gPieces[cell2].win = true;
		gPieces[cell3].win = true;
	}
}

// calculates heuristic evaluation score for each possible winning pattern
function scoreCalc (turnsNeeded) {
	var bestScore = 0;
	
	bestScore += scoreCalcByWinPattern (0,1,2,turnsNeeded);
	bestScore += scoreCalcByWinPattern (3,4,5,turnsNeeded);
	bestScore += scoreCalcByWinPattern (6,7,8,turnsNeeded);
	bestScore += scoreCalcByWinPattern (2,5,8,turnsNeeded);
	bestScore += scoreCalcByWinPattern (1,4,7,turnsNeeded);
	bestScore += scoreCalcByWinPattern (0,3,6,turnsNeeded);
	bestScore += scoreCalcByWinPattern (2,4,6,turnsNeeded);
	bestScore += scoreCalcByWinPattern (0,4,8,turnsNeeded);

	return bestScore;
}

/* heuristic evaluation is based on:
- if a 3 cell winning pattern is found add 100 to score, increase score for fewer turns needed
- if a 2 cell winning pattern is found add 10 to the score, increase score for fewer turns needed
- else score is zero
positive is for maximizingPlayer, which is always the PC
*/
function scoreCalcByWinPattern (cell1, cell2, cell3,turnsNeeded) {
	if (gPieces[cell1].value * gPieces[cell2].value * gPieces[cell3].value == 1) {
		return gTurn ? (-100 - turnsNeeded * 10) : (100 - turnsNeeded * 10);
	}
	else if (gPieces[cell1].value * gPieces[cell2].value * gPieces[cell3].value == 8) {
		return gTurn ? (100 - turnsNeeded * 10) : (-100 - turnsNeeded * 10);
	}
	else if ((gPieces[cell1].value * gPieces[cell2].value == 1) || (gPieces[cell2].value * gPieces[cell3].value == 1) || (gPieces[cell1].value * gPieces[cell3].value == 1) ){
		return gTurn ? (-10 - turnsNeeded) : (10 - turnsNeeded);
	}
	else if ((gPieces[cell1].value * gPieces[cell2].value == 4) || (gPieces[cell2].value * gPieces[cell3].value == 4) || (gPieces[cell1].value * gPieces[cell3].value == 4) ){
		return gTurn ? (10 - turnsNeeded) : (-10 - turnsNeeded);
	}
	else {
		return 0;
	}
}

// alphabeta minimax recursive function to optimize decisions for the PC - see description of pseudocode
function alphaBetaMM (depth, alpha, beta, maximizingPlayer, turnsNeeded) {
	var nextMoves = possibleMoves();
	var bestScore;
	var bestRow = -1;
	var bestCol = -1;
	var bestMove;
	var value;
	turnsNeeded += 1;
	
	if (nextMoves[0] == -999 || depth == 0) {
		bestScore = scoreCalc(turnsNeeded);
		bestMove = new Cell (bestRow,bestCol,bestScore,false);
	}
	else {
		for (var i = 0; i < nextMoves.length; i+=2) {
			var j = nextMoves[i] + nextMoves[i+1] * 3;
			if (maximizingPlayer) {
				if (gTurn){
					gPieces[j].value = 2;
				}
				else {
					gPieces[j].value = 1;
				}
				value = alphaBetaMM(depth - 1, alpha,beta,false,turnsNeeded);
				bestScore = value.value;
				if (bestScore > alpha) {
					alpha = bestScore;
					bestRow = nextMoves[i];
					bestCol = nextMoves[i+1];
				}
			}
			else {
				if (gTurn){
					gPieces[j].value = 1;
				}
				else {
					gPieces[j].value = 2;
				}
				value = alphaBetaMM(depth - 1, alpha,beta,true,turnsNeeded);
				bestScore = value.value;
				if (bestScore < beta) {
					beta = bestScore;
					bestRow = nextMoves[i];
					bestCol = nextMoves[i+1];
				}
			}

			gPieces[j].value = 0;
			if (alpha >= beta) {
				break;
			}
		}
		
		if (maximizingPlayer) {
			bestMove = new Cell (bestRow,bestCol,alpha,false);
		}
		else {
			bestMove = new Cell (bestRow,bestCol,beta,false);
		}
	}
	return bestMove;
}

// calling function for the PC's next move
function getMove() {
	var bestMove = alphaBetaMM(4,-99999,99999,true,0);
	var cell = new Cell(bestMove.row,bestMove.column,0,false);
	return cell;
}

// game board interaction
function playOnClick(e) {
    var cell = getCursorPosition(e);
	var i = cell.row + cell.column * 3; //index for gPieces
	if (gGameInProgress){
		if (gPieces[i].value == 0) {
			if (gTurn) {
				gPieces[i].value = 1;
			}
			else {
				gPieces[i].value = 2;
			}
			if (!isTheGameOver()) {
				var cellPlayer2 = new Cell(0,0,0,false);
				cellPlayer2 = getMove();
				i = cellPlayer2.row + cellPlayer2.column * 3;
				if (gPieces[i].value == 0) {
					if (gTurn) {
						gPieces[i].value = 2;
					}
					else {
						gPieces[i].value = 1;
					}
				}
			}
			drawBoard_ttt();
		}
	}
}

// draws Xs and Os
function drawPiece(p, selected) { 
	var i = p.row + p.column * 3; //index for gPieces
	gDrawingContext.lineWidth = 10;
    if (gPieces[i].value == 1) { // true = 'x'
		var column = p.column;
		var row = p.row;
		var x = (column * kPieceWidth);
		var y = (row * kPieceHeight);
		gDrawingContext.beginPath();
		gDrawingContext.moveTo(x + 30, y + 30);
		gDrawingContext.lineTo(x + kPieceWidth - 30, y + kPieceHeight - 30);
		gDrawingContext.moveTo(x + kPieceWidth - 30, y + 30);
		gDrawingContext.lineTo(x + 30, y + kPieceHeight - 30);
		gDrawingContext.closePath();
		if (selected) { // 'selected' changes colour for pieces in winning pattern
			gDrawingContext.strokeStyle = "#fd482f";
		}
		else {
			gDrawingContext.strokeStyle = "#00ced1";
		}
		gDrawingContext.stroke();
		}
	else if (gPieces[i].value == 2) { // true = 'O'
		var column = p.column;
		var row = p.row;
		var x = (column * kPieceWidth) + (kPieceWidth/2);
		var y = (row * kPieceHeight) + (kPieceHeight/2);
		var radius = (kPieceWidth/2) - (kPieceWidth/6);
		gDrawingContext.beginPath();
		gDrawingContext.arc(x, y, radius, 0, Math.PI*2, false);
		gDrawingContext.closePath();
		if (selected) { // 'selected' changes colour for pieces in winning pattern
			gDrawingContext.strokeStyle = "#fd482f";
		}
		else {
			gDrawingContext.strokeStyle = "#ffd700";
		}
		gDrawingContext.stroke();
	}
	else {
		return;
	}
}

// draws Tic Tac Toe board
function drawBoard_ttt() {
		gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);
		gDrawingContext.beginPath();
		
		/* vertical lines */
		for (var x = kPieceWidth; x <= kPixelWidth - kPieceWidth; x += kPieceWidth) {
		gDrawingContext.moveTo(0.5 + x, 0);
		gDrawingContext.lineTo(0.5 + x, kPixelHeight);
		}
		
		/* horizontal lines */
		for (var y = kPieceHeight; y <= kPixelHeight - kPieceHeight; y += kPieceHeight) {
		gDrawingContext.moveTo(0, 0.5 + y);
		gDrawingContext.lineTo(kPixelWidth, 0.5 +  y);
		}
		
		/* draw it! */
		gDrawingContext.lineWidth = 3;
		gDrawingContext.strokeStyle = "#ccc";
		gDrawingContext.stroke();
		
	if (gGameInProgress) {
		for (var i = 0; i < 9; i++) {
			drawPiece(gPieces[i], false);
		}
	}
	if (gGameInProgress && isTheGameOver()) {
		endGame();
    }

    saveGameState();
}

// initializing new game
function newGame_ttt() {
    gPieces = [new Cell(kBoardHeight - 3, 0, 0,false),
	       new Cell(kBoardHeight - 2, 0, 0,false),
	       new Cell(kBoardHeight - 1, 0, 0,false),
	       new Cell(kBoardHeight - 3, 1, 0,false),
	       new Cell(kBoardHeight - 2, 1, 0,false),
	       new Cell(kBoardHeight - 1, 1, 0,false),
	       new Cell(kBoardHeight - 3, 2, 0,false),
	       new Cell(kBoardHeight - 2, 2, 0,false),
	       new Cell(kBoardHeight - 1, 2, 0,false)];
	var startPos = Math.floor((Math.random() * 4) + 1);
	
	// set one of the corner pieces as a first move if PC starts as 'X'
	if (!gTurn) {
		if (startPos == 1) {
			gPieces[0].value = 1;
		}
		else if (startPos == 2) {
			gPieces[2].value = 1;
		}
		else if (startPos == 3) {
			gPieces[6].value = 1;
		}
		else if (startPos == 4) {
			gPieces[8].value = 1;
		}
	}
	
	gPCWins = false;
	gGameSummary.innerHTML = "Game on!";
	gNumPieces = gPieces.length;
    gGameInProgress = true;
    drawBoard_ttt();
}

if (typeof resumeGame != "function") {
    saveGameState = function() {
	return false;
    }
    resumeGame = function() {
	return false;
    }
}

// called in HTML if player icon is clicked
function playerStart() {
	gTurn = true; // x = player
	newGame_ttt();
}

// called in HTML if PC icon is clicked
function pcStart() {
	gTurn = false; // x = PC
	newGame_ttt();
}

function initplay(canvasElement,gameSummary, divID) {
    if (!canvasElement) {
        canvasElement = document.createElement("canvas");
		canvasElement.id = "a";
    }
	div = document.getElementById(divID);
    div.appendChild(canvasElement);
	//document.body.appendChild(canvasElement);
	
	gCanvasElement = canvasElement;
	gDrawingContext = gCanvasElement.getContext("2d");
	
	gCanvasElement.width = kPixelWidth;
    gCanvasElement.height = kPixelHeight;

    gCanvasElement.addEventListener("click", playOnClick, false);
	
	gGameSummary = gameSummary;
	drawBoard_ttt();
	// for local storage
	//if (!resumeGame()) { 
	//	newGame_ttt();
    //}
}

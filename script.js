// Get the chess board element and create a div element to show the turn indicator
const chessBoard = document.getElementById("chessBoard");
const turnIndicator = document.createElement("h4");
const modal = document.querySelector('.modal-container');

// Set the text content, color, and alignment for the turn indicator and add it to the body
turnIndicator.textContent = "Current turn: Bitcoin";
turnIndicator.style.color = 'grey';
turnIndicator.style.textAlign = 'center';
document.body.appendChild(turnIndicator);

// Initialize the variables for the current player, history, and selected piece
let currentPlayer = "Bitcoin";
let history = [];
let selectedPiece = null;

// Initialize the variables for the casteling control
let wBigCastle = true, wSmallCastle = true, bBigCastle = true, bSmallCastle = true;
let wBigCastleAt = null, bBigCastleAt = null, wSmallCastleAt = null, bSmallCastleAt = null;

// Define the Piece class
class Piece {
    constructor(color, imagePath, type) {
        this.color = color;
        this.imagePath = imagePath;
        this.type = type;
    }
}

// Initialize the board with pieces and empty squares
let board = [];
for (let i = 0; i < 8; i++) {
    board[i] = [];
    for (let j = 0; j < 8; j++) {
        if (i === 0 & j === 2) board[i][j] = new Piece("Big Bank", "bailout.png", "queen"); // Big Bank queen
        else if (i === 0 & j === 5) board[i][j] = new Piece("Big Bank", "bailout.png", "queen"); // Big Bank queen
        else if (i === 1 & j === 4) board[i][j] = new Piece("", "  ", "");
        else if (i === 1 & j === 2) board[i][j] = new Piece("", "  ", "");
        else if (i === 1 & j === 3) board[i][j] = new Piece("", "  ", "");
        else if (i === 1 & j === 5) board[i][j] = new Piece("", "  ", "");
        else if (i === 0 & j === 4) board[i][j] = new Piece("Big Bank", "aid.png", "king"); // Big Bank king
        else if (i === 2) board[i][j] = new Piece("Bitcoin", "sir.png", "pawn"); // Bitcoin pawn
        else if (i === 3) board[i][j] = new Piece("Bitcoin", "sir.png", "pawn"); // Bitcoin pawn
        else if (i === 4) board[i][j] = new Piece("Bitcoin", "sir.png", "pawn"); // Bitcoin pawn
        else if (i === 5) board[i][j] = new Piece("Bitcoin", "sir.png", "pawn"); // Bitcoin pawn
        else if (i === 6) board[i][j] = new Piece("Bitcoin", "sir.png", "pawn"); // Bitcoin pawn
        else if (i === 7) board[i][j] = new Piece("Bitcoin", "sir.png", "pawn"); // Bitcoin pawn
        else if (i < 2) {
            if (j === 0 || j === 7) board[i][j] = new Piece("", "  ", "");
            else if (j === 1 || j === 6) board[i][j] = new Piece("", "  ", "");
            else if (j === 2 || j === 5) board[i][j] = new Piece("", "  ", "");
            else if (j === 3) board[i][j] = new Piece("Big Bank", "bailout.png", "queen");
            else if (j === 4) board[i][j] = new Piece("", "  ", "");
        } else board[i][j] = new Piece("", "  ", "");
    }
}
updateBoard(board, true);

// Function to update the board
function updateBoard(board, save) {
    let currentBoard = [];
    for (let i = 0; i < 8; i++) {
        currentBoard[i] = [];
        for (let j = 0; j < 8; j++) {
            currentBoard[i][j] = board[i][j];
        }
    }
    if (save) history.push(currentBoard);

    while (chessBoard.hasChildNodes()) {
        chessBoard.removeChild(chessBoard.firstChild);
    }
    for (let i = 0; i < 8; i++) {
        const row = chessBoard.insertRow(); // Create a new row
        for (let j = 0; j < 8; j++) {
            const cell = row.insertCell(); // Create a new cell
            cell.className = (i + j) % 2 === 0 ? "White" : "Black";
            cell.addEventListener("click", handleClick); // Add a click event listener
            cell.textContent = history[history.length - 1][i][j].unicode;
            cell.style.backgroundImage = `url(${board[i][j].imagePath})`;
            cell.style.backgroundSize = '80px 80px'; // Set the size of the background image
            cell.style.backgroundRepeat = 'no-repeat';
            cell.style.backgroundPosition = 'center';
            cell.textContent = ''; // Clear any previous content            
        }
    }
}



// Handle the click event
function handleClick(event) {
    // Get the row and column of the clicked cell and change the color of pieces
    const row = event.target.parentNode.rowIndex;
    const col = event.target.cellIndex;
    for (let i = 0; i < document.getElementsByTagName("td").length; i++) {
        document.getElementsByTagName("td")[i].classList.remove("piece-selected");
    }
    if (board[row][col].color === currentPlayer) {
        selectedPiece = { row, col };
        if (board[row][col].type === "pawn") {
            event.target.classList.add("piece-selected");
            const audio = new Audio('pawngrab.mp3');
            audio.play();
        } else if (board[row][col].type === "queen") {
            event.target.classList.add("piece-selected");
            const audio = new Audio('grunt1.mp3');
            audio.play();
        } else if (board[row][col].type === "king") {
            event.target.classList.add("piece-selected");
            const audio = new Audio('kings.mp3');
            audio.volume = 0.4;
            audio.play();
        }
    } else {
        if (!selectedPiece) return;
        const targetPiece = { row, col };
        movePiece(selectedPiece, targetPiece);
        selectedPiece = null;
        if (board[row][col].type === "pawn") {
            const audio = new Audio('pawnmove.mp3');
            audio.volume = 0.1;
            audio.play();
        } else if (board[row][col].type === "queen") {
            event.target.classList.add("piece-selected");
            const audio = new Audio('grunt.mp3');
            audio.volume = 0.5;
            audio.play();
        } else if (board[row][col].type === "king") {
            event.target.classList.add("piece-selected");
            const audio = new Audio('kingm.mp3');
            audio.volume = 0.3;
            audio.play();
        }
    }
}

function movePiece(selectedPiece, targetPiece) {
    const [fromRow, fromCol] = [selectedPiece.row, selectedPiece.col];
    const [toRow, toCol] = [targetPiece.row, targetPiece.col];
    let move = false;

    if (board[fromRow][fromCol].type === "pawn") move = pawnMove(board, fromRow, fromCol, toRow, toCol, currentPlayer, true, true);
    else if (board[fromRow][fromCol].type === "queen") move = queenMove(board, fromRow, fromCol, toRow, toCol, true);
    else if (board[fromRow][fromCol].type === "king") move = kingMove(board, fromRow, fromCol, toRow, toCol, true, true);

    // If the movement is valid, do it
    if (move) {
        board[toRow][toCol] = board[fromRow][fromCol];
        board[fromRow][fromCol] = new Piece("", "  ", "");
        currentPlayer = currentPlayer === "Bitcoin" ? "Big Bank" : "Bitcoin";
        turnIndicator.textContent = `Current turn: ${currentPlayer}`;
        updateBoard(board, true);
        isTheEnd();
    }
}

function pawnMove(thisBoard, fRow, fCol, tRow, tCol, player, enPassant, testCheck) {
    const direction = player === "Bitcoin" ? -1 : 1;
    // Normal move
    if ((fRow + direction === tRow) && (fCol === tCol)
        && !thisBoard[tRow][fCol].color) {
        if (testCheck) return !isCheck(thisBoard, fRow, fCol, tRow, tCol, false); else return true;
    }
    // Capture move
    else if ((fRow + direction === tRow) &&
        (fCol + 1 === tCol || fCol - 1 === tCol) && thisBoard[tRow][tCol].color !== ""
        && thisBoard[tRow][tCol].color !== player) {
        if (testCheck) return !isCheck(thisBoard, fRow, fCol, tRow, tCol, false); else return true;
    }
    // En passant move
    else if (((fRow === 3 && player === "Bitcoin") || (fRow === 4 && player === "Big Bank")) && (fCol + 1 === tCol || fCol - 1 === tCol)
        && thisBoard[fRow][tCol].type === "pawn" && thisBoard[fRow][tCol].color !== player
        && (fRow + direction === tRow) && (history[history.length - 2][tRow + direction][tCol].type == "pawn")
        && (history[history.length - 1][tRow + direction][tCol].type == "")) {
        if (enPassant) { thisBoard[fRow][tCol] = new Piece("", "  ", ""); }
        if (testCheck) return !isCheck(thisBoard, fRow, fCol, tRow, tCol, false); else return true;
    }
    return false;
}

function bishopMove(thisBoard, fRow, fCol, tRow, tCol, testCheck) {
    // Check if the move is a diagonal move
    if (Math.abs(fRow - tRow) !== Math.abs(fCol - tCol)) return false;
    // Check if the path to the target is clear
    let rowStep = (tRow - fRow) / Math.abs(tRow - fRow);
    let colStep = (tCol - fCol) / Math.abs(tCol - fCol);
    let row = fRow + rowStep;
    let col = fCol + colStep;
    while (row !== tRow || col !== tCol) {
        if (thisBoard[row][col].type !== "") return false;
        row += rowStep;
        col += colStep;
    }
    if (testCheck) return !isCheck(thisBoard, fRow, fCol, tRow, tCol, false); else return true;
}

function rookMove(thisBoard, fRow, fCol, tRow, tCol, testCasteling, testCheck) {
    // Check if the move is vertical or horizontal
    if (fRow !== tRow && fCol !== tCol) {
        return false;
    }
    // Check if the path to the target is clear
    if (fRow === tRow) {
        const start = Math.min(fCol, tCol) + 1;
        const end = Math.max(fCol, tCol);
        for (let i = start; i < end; i++) {
            if (thisBoard[fRow][i].color !== "") {
                return false;
            }
        }
    } else if (fCol === tCol) {
        const start = Math.min(fRow, tRow) + 1;
        const end = Math.max(fRow, tRow);
        for (let i = start; i < end; i++) {
            if (thisBoard[i][fCol].color !== "") {
                return false;
            }
        }
    }
    // Disables castling when moving the rook
    if (testCheck) return !isCheck(thisBoard, fRow, fCol, tRow, tCol, testCasteling); else return true;
}

function queenMove(thisBoard, fRow, fCol, tRow, tCol, testCheck) {
    if (rookMove(thisBoard, fRow, fCol, tRow, tCol, false, testCheck)) return true;
    return bishopMove(thisBoard, fRow, fCol, tRow, tCol, testCheck);
}

function kingMove(thisBoard, fRow, fCol, tRow, tCol, testCasteling, testCheck) {
    // The king can move one square in any direction
    if (Math.abs(fRow - tRow) <= 1 && Math.abs(fCol - tCol) <= 1) {
        if (testCheck) return !isCheck(thisBoard, fRow, fCol, tRow, tCol, testCasteling); else return true;
    }
    return false;
}

function isCheck(board, fRow, fCol, tRow, tCol, testCasteling) {
    let thisBoard = [];
    for (let i = 0; i < 8; i++) {
        thisBoard[i] = [];
        for (let j = 0; j < 8; j++) {
            thisBoard[i][j] = board[i][j];
        }
    }
    let kRow;
    let kCol;
    thisBoard[tRow][tCol] = thisBoard[fRow][fCol];
    thisBoard[fRow][fCol] = new Piece("", "  ", "");
    // Find the location of the king of the current player
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (thisBoard[i][j].type === "king" && thisBoard[i][j].color === currentPlayer) {
                kRow = i;
                kCol = j;
                break;
            }
        }
    }
    // Check if any opponent piece can attack the king's location
    otherPlayer = currentPlayer === "Bitcoin" ? "Big Bank" : "Bitcoin";
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (thisBoard[i][j].color !== currentPlayer) {
                if (thisBoard[i][j].type === "pawn") { if (pawnMove(thisBoard, i, j, kRow, kCol, otherPlayer, false, false)) return true; }
                else if (thisBoard[i][j].type === "knight") { if (knightMove(thisBoard, i, j, kRow, kCol, false)) return true; }
                else if (thisBoard[i][j].type === "bishop") { if (bishopMove(thisBoard, i, j, kRow, kCol, false)) return true; }
                else if (thisBoard[i][j].type === "rook") { if (rookMove(thisBoard, i, j, kRow, kCol, false, false)) return true; }
                else if (thisBoard[i][j].type === "queen") { if (queenMove(thisBoard, i, j, kRow, kCol, false)) return true; }
                else if (thisBoard[i][j].type === "king") { if (kingMove(thisBoard, i, j, kRow, kCol, false, false)) return true; }
            }
        }
    }
    return false;
}

function isTheEnd() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j].color === currentPlayer) {
                for (let k = 0; k < 8; k++) {
                    for (let l = 0; l < 8; l++) {
                        if (board[k][l].color !== currentPlayer) {
                            if (board[i][j].type === "rook") { if (rookMove(board, i, j, k, l, false, true)) return; }
                            else if (board[i][j].type === "knight") { if (knightMove(board, i, j, k, l, true)) return; }
                            else if (board[i][j].type === "bishop") { if (bishopMove(board, i, j, k, l, true)) return; }
                            else if (board[i][j].type === "queen") { if (queenMove(board, i, j, k, l, true)) return; }
                            else if (board[i][j].type === "king") { if (kingMove(board, i, j, k, l, false, true)) return; }
                            else if (board[i][j].type === "pawn") { if (pawnMove(board, i, j, k, l, currentPlayer, false, true)) return; }
                        }
                    }
                }
            }
        }
    }
    otherPlayer = currentPlayer === "Bitcoin" ? "Big Bank" : "Bitcoin";
    if (isCheck(board, 0, 0, 0, 0, false)) endModal(otherPlayer);
    else endModal("Stalemate");
}

function endModal(result) {
    document.querySelector(".btn-rook").style.display = "none";
    document.querySelector(".btn-knight").style.display = "none";
    document.querySelector(".btn-bishop").style.display = "none";
    document.querySelector(".btn-queen").style.display = "none";
    document.querySelector(".btn-close").style.display = "block";
    document.querySelector(".btn-refresh").style.display = "block";
    if (result === "Stalemate") {
        document.querySelector('.message').innerHTML = 'Stalemate - We all live happily ever after! Yay!';
    } else {
        document.querySelector('.message').innerHTML = result + ' team wins! We hope that you were invested in the more secure financial system.';
    }
    modal.classList.add('active');
    const audio = new Audio('pawngrab.mp3');
    audio.play();
    const audio1 = new Audio('notgood.mp3');
    audio1.volume = 0.2;
    audio1.play();
}

function closeBtn() {
    modal.classList.remove('active');
    const audio = new Audio('boom.m4a');
    audio.play();
}

function refresh() {
    const audio = new Audio('boom.m4a');
    audio.play();
    document.body.classList.add('shake');
    setTimeout(() => {
        window.location.reload();
    }, 700);
}

function undo() {
    if (history.length > 1) {
        const audio = new Audio('back.m4a');
        audio.play();
        audio.volume = .4;
        history.length = history.length - 1;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                board[i][j] = history[history.length - 1][i][j];
            }
        }
        if (history.length == wBigCastleAt) { wBigCastle = true; wBigCastleAt = null; }
        if (history.length == bBigCastleAt) { bBigCastle = true; bBigCastleAt = null; }
        if (history.length == wSmallCastleAt) { wSmallCastle = true; wSmallCastleAt = null; }
        if (history.length == bSmallCastleAt) { bSmallCastle = true; bSmallCastleAt = null; }
        updateBoard(board, false);
        currentPlayer = currentPlayer === "Bitcoin" ? "Big Bank" : "Bitcoin";
        turnIndicator.textContent = `Current turn: ${currentPlayer}`;
    }
}

function openFaqModal() {
    const faqModal = document.getElementById('faqModal');
    faqModal.style.display = 'block';
    const audio = new Audio('pawngrab.mp3');
    audio.play();
    const audio1 = new Audio('notgood.mp3');
    audio1.volume = 0.2;
    if (audio1.paused) {
        audio1.play();
    } else {
        console.log("Audio is already playing.");
    }
}

function closeFaqModal() {
    const faqModal = document.getElementById('faqModal');
    faqModal.style.display = 'none';
    const audio = new Audio('boom.m4a');
    audio.play();
}


function checkPawnCaptures(board) {
    let bitcoinPawnsRemaining = 0;

    // Iterate over the board to count Bitcoin's remaining pawns
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j].color === "Bitcoin" && board[i][j].type === "pawn") {
                bitcoinPawnsRemaining++;
            }
        }
    }

    // If all Bitcoin's pawns are captured, trigger end modal with "Big Bank" as the winner
    if (bitcoinPawnsRemaining === 0) {
        endModal("Big Bank");
    }
}
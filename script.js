const boardElem = document.getElementById("board");
const statusElem = document.getElementById("status");
const modeElem = document.getElementById("mode");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function createBoard() {
  boardElem.innerHTML = "";
  board.forEach((_, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.textContent = board[i];
    cell.addEventListener("click", () => handleMove(i));
    boardElem.appendChild(cell);
  });
}

function handleMove(index) {
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  updateBoard();

  if (checkWin(currentPlayer)) {
    statusElem.textContent = `🎉 ${currentPlayer === 'X' ? 'Player' : 'Computer'} ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    statusElem.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  if (modeElem.value === "cpu" && currentPlayer === "X") {
    currentPlayer = "O";
    statusElem.textContent = "🤖 Computer's turn...";
    setTimeout(computerMove, 500);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusElem.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function updateBoard() {
  boardElem.querySelectorAll(".cell").forEach((cell, i) => {
    cell.textContent = board[i];
    cell.classList.remove("win");
  });

  const win = getWinLine();
  if (win) win.forEach(i => boardElem.children[i].classList.add("win"));
}

function getWinLine() {
  return winPatterns.find(p => board[p[0]] && board[p[0]] === board[p[1]] && board[p[0]] === board[p[2]]);
}

function checkWin(player) {
  return winPatterns.some(p => board[p[0]] === player && board[p[1]] === player && board[p[2]] === player);
}

function computerMove() {
  const index = getBestMove();
  if (index !== -1) {
    board[index] = "O";
    updateBoard();

    if (checkWin("O")) {
      statusElem.textContent = "🤖 Computer wins!";
      gameActive = false;
    } else if (!board.includes("")) {
      statusElem.textContent = "It's a draw!";
      gameActive = false;
    } else {
      currentPlayer = "X";
      statusElem.textContent = "Player X's turn";
    }
  }
}

function getBestMove() {
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      if (checkWin("O")) { board[i] = ""; return i; }
      board[i] = "";
    }
  }

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "X";
      if (checkWin("X")) { board[i] = ""; return i; }
      board[i] = "";
    }
  }

  if (board[4] === "") return 4;

  const corners = [0,2,6,8].filter(i => board[i] === "");
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

  const empty = board.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  return empty.length ? empty[Math.floor(Math.random() * empty.length)] : -1;
}

function resetGame() {
  board = Array(9).fill("");
  gameActive = true;
  currentPlayer = "X";
  statusElem.textContent = "Player X's turn";
  createBoard();
}

createBoard();
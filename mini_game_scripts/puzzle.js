
const puzzleGrid = document.getElementById("puzzleGrid");
const winMessage = document.getElementById("winMessage");
const moveCounter = document.getElementById("moveCounter");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");

const gridSize = 3;
const tileCount = gridSize * gridSize;
let tiles = [];
let moves = 0;
let score = 500; // Starting score
let startTime;
let timerInterval;

function createTiles() {
  tiles = [];
  for (let i = 0; i < tileCount; i++) {
    const tile = document.createElement("div");
    tile.classList.add("puzzle-tile");
    tile.dataset.index = i;

    if (i < tileCount - 1) {
      const x = (i % gridSize) * -100; 
      const y = Math.floor(i / gridSize) * -100; 
      tile.style.backgroundImage = `url('../ironman.jpeg')`;
      tile.style.backgroundPosition = `${x}px ${y}px`;
    } else {
      tile.classList.add("empty");
    }

    tiles.push(tile);
  }
}

function renderTiles() {
  puzzleGrid.innerHTML = "";
  tiles.forEach((tile, index) => {
    puzzleGrid.appendChild(tile);
    tile.onclick = () => tileClickHandler(index);
  });

  if (checkWinCondition()) {
    clearInterval(timerInterval);
    winMessage.classList.remove("hidden");
    winMessage.style.display = "block";
    winMessage.innerText = `🎉 Congratulations! You solved the puzzle in ${moves} moves and ${formatTime(Date.now() - startTime)}!`;
  } else {
    winMessage.classList.add("hidden");
    winMessage.style.display = "none";
  }
}

function tileClickHandler(index) {
  if (!tiles[index].classList.contains("empty") && canMove(index)) {
    moveTile(index);
    moves++;
    moveCounter.innerText = `Moves: ${moves}`;
    score -= 2;  // Deduct score only after a valid move
    updateScore();  // Update the score display
  }
}

function canMove(index) {
  const emptyIndex = tiles.findIndex(tile => tile.classList.contains("empty"));
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;
  const emptyRow = Math.floor(emptyIndex / gridSize);
  const emptyCol = emptyIndex % gridSize;

  return (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
         (col === emptyCol && Math.abs(row - emptyRow) === 1);
}

function moveTile(index) {
  const emptyIndex = tiles.findIndex(tile => tile.classList.contains("empty"));

  if (canMove(index)) {
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
    renderTiles();
  }
}

function shuffleTiles() {
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  if (!isSolvable(tiles)) shuffleTiles();
}

function isSolvable(tiles) {
  const tileArray = tiles.map(tile => tile.dataset.index);
  const inversions = tileArray.reduce((count, currentValue, i) => {
    if (currentValue === (tileCount - 1).toString()) return count;
    for (let j = i + 1; j < tileArray.length; j++) {
      if (tileArray[j] !== (tileCount - 1).toString() && currentValue > tileArray[j]) {
        count++;
      }
    }
    return count;
  }, 0);

  return inversions % 2 === 0;
}

function checkWinCondition() {
  return tiles.every((tile, index) => tile.dataset.index == index);
}

function startTimer() {
  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerDisplay.innerText = `Time: ${formatTime(Date.now() - startTime)}`;
  }, 1000);
}

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function updateScore() {
  scoreDisplay.innerText = `Score: ${score}`;
}

function initGame() {
  createTiles();
  shuffleTiles();
  renderTiles();
  moves = 0;
  score = 500;
  moveCounter.innerText = "Moves: 0";
  updateScore();
  startTimer();
}

initGame();

export{updateScore};
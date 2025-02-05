function updateGameData(GameScore,score) {
    localStorage.setItem('Minesweeper', score);
}
// Constants
const GRID_SIZE = 8;
const MINE_COUNT = 10;
const RETRY_PENALTY = 200;

// Game state variables
let grid = [];
let revealed = [];
let flagged = [];
let gameActive = true;
let score = 1000;
let timer = 0;
let timerInterval;
let flagsLeft = MINE_COUNT;

// Utility function to count adjacent mines
function countAdjacentMines(x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const newY = y + dy;
            const newX = x + dx;
            if (newY >= 0 && newY < GRID_SIZE && newX >= 0 && newX < GRID_SIZE) {
                if (grid[newY][newX] === -1) count++;
            }
        }
    }
    return count;
}

function updateScore() {
    document.getElementById('score').textContent = score;
    updateGameData('Minesweeper', score); // Example gameId and score
}

function getHint() {
    if (!gameActive || score < 100) return;

    score -= 100;
    updateScore();

    // Find a safe unrevealed cell
    let safeCells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (!revealed[y][x] && !flagged[y][x] && grid[y][x] !== -1) {
                safeCells.push({x, y});
            }
        }
    }

    if (safeCells.length > 0) {
        const hint = safeCells[Math.floor(Math.random() * safeCells.length)];
        const cell = document.querySelector(`[data-x="${hint.x}"][data-y="${hint.y}"]`);
        cell.style.backgroundColor = '#0f0';
        setTimeout(() => {
            if (!revealed[hint.y][hint.x]) {
                cell.style.backgroundColor = '';
            }
        }, 1000);
    }
}

function gameOver(won) {
    gameActive = false;
    clearInterval(timerInterval);
    const gameOverElement = document.getElementById('gameOver');
    const gameOverTitle = document.getElementById('gameOverTitle');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const penaltyMessage = document.getElementById('penaltyMessage');

    if (won) {
        gameOverTitle.textContent = "You Won!";
        gameOverMessage.textContent = `Congratulations! You found all the mines!`;
        gameOverTitle.className = 'win-message';
        penaltyMessage.style.display = 'none';
    } else {
        gameOverTitle.textContent = "You Lost!";
        updateGameData('Minesweeper', 0); // Example gameId and score
        gameOverMessage.textContent = "Better luck next time!";
        gameOverTitle.className = 'lose-message';
        penaltyMessage.textContent = `Retry will cost ${RETRY_PENALTY} points`;
        penaltyMessage.style.display = 'block';
    }

    document.getElementById('finalScore').textContent = won ? score : 0;
    gameOverElement.style.display = 'block';

    // Reveal all mines
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (grid[y][x] === -1 && !flagged[y][x]) {
                const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                cell.classList.add('revealed', 'mine');
                cell.textContent = '💣';
            }
        }
    }
}

function checkWin() {
    let correctFlags = 0;
    let incorrectFlags = 0;
    
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (flagged[y][x]) {
                if (grid[y][x] === -1) {
                    correctFlags++;
                } else {
                    incorrectFlags++;
                }
            }
        }
    }

    if (correctFlags === MINE_COUNT && incorrectFlags === 0) {
        gameOver(true);
    }
}

function revealCell(x, y) {
    if (!gameActive || revealed[y][x] || flagged[y][x]) return;

    revealed[y][x] = true;
    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    cell.classList.add('revealed');

    if (grid[y][x] === -1) {
        gameOver(false);
        cell.classList.add('mine');
        cell.textContent = '💣';
    } else {
        if (grid[y][x] > 0) {
            cell.textContent = grid[y][x];
        } else {
            // Reveal adjacent empty cells
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const newY = y + dy;
                    const newX = x + dx;
                    if (newY >= 0 && newY < GRID_SIZE && newX >= 0 && newX < GRID_SIZE) {
                        if (!revealed[newY][newX]) {
                            revealCell(newX, newY);
                        }
                    }
                }
            }
        }
    }

    checkWin();
}

function toggleFlag(x, y) {
    if (!gameActive || revealed[y][x]) return;

    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    
    if (flagged[y][x]) {
        flagged[y][x] = false;
        cell.classList.remove('flagged');
        cell.textContent = '';
        flagsLeft++;
    } else if (flagsLeft > 0) {
        flagged[y][x] = true;
        cell.classList.add('flagged');
        cell.textContent = '🚩';
        flagsLeft--;
    }

    document.getElementById('flags').textContent = flagsLeft;
    checkWin();
}

function createGrid() {
    const gridElement = document.getElementById('grid');
    
    // Initialize arrays
    for (let i = 0; i < GRID_SIZE; i++) {
        grid[i] = new Array(GRID_SIZE).fill(0);
        revealed[i] = new Array(GRID_SIZE).fill(false);
        flagged[i] = new Array(GRID_SIZE).fill(false);
    }

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);
        if (grid[y][x] !== -1) {
            grid[y][x] = -1;
            minesPlaced++;
        }
    }

    // Calculate numbers
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (grid[y][x] !== -1) {
                grid[y][x] = countAdjacentMines(x, y);
            }
        }
    }

    // Create DOM elements
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.addEventListener('click', () => revealCell(x, y));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleFlag(x, y);
            });
            gridElement.appendChild(cell);
        }
    }

    // Start timer
    timerInterval = setInterval(() => {
        if (gameActive) {
            timer++;
            document.getElementById('timer').textContent = timer;
            score = Math.max(0, score - 1);
            updateScore();
        }
    }, 1000);

    // Prevent context menu from showing
    gridElement.addEventListener('contextmenu', (e) => e.preventDefault());
}

// Initialize game
function initializeGame() {
    createGrid();
    document.getElementById('hint').addEventListener('click', getHint);
    // Add this to your game over section
document.getElementById('retryButton').addEventListener('click', () => {
score = 0; // Reset the score to zero
updateScore(); // Update the UI with the new score
location.reload(); // Reload the page to restart the game
});

}

// Start the game
window.addEventListener('load', initializeGame);

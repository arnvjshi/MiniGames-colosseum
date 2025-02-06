function updateGameData(GameScore,score) {
    localStorage.setItem('WordleGame', score);
}

const words = [
    'BEACH', 'CRANE', 'FLAME', 'GHOST', 'HEART',
    'KNIFE', 'LUNAR', 'MAGIC', 'NIGHT', 'OCEAN',
    'PIANO', 'QUEEN', 'RIVER', 'STORM', 'TIGER',
    'URBAN', 'VIDEO', 'WHALE', 'YOUTH', 'ZEBRA',
    'BLOOM', 'CROWN', 'DREAM', 'FROST', 'GRAVE',
    'HASTE', 'IMAGE', 'JUICE', 'LIGHT', 'MONTH',
    'NOBLE', 'PAINT', 'QUICK', 'ROBOT', 'SHINE',
    'TRACE', 'UNITY', 'VOICE', 'WORLD', 'AMBER',
    'BRICK', 'CLOUD', 'DANCE', 'EAGLE', 'FLARE',
    'GRAPE', 'HOVER', 'IVORY', 'JADE', 'KARMA'
];

let gameState = {
    currentWord: '',
    currentGuess: [],
    currentRow: 0,
    wordsSolved: 0,
    wordsAttempted: 0,
    score: 500,
    triesLeft: 6,
    gameActive: true
};

function initializeGame() {
    gameState.currentWord = getRandomWord();
    gameState.currentRow = 0;
    gameState.currentGuess = [];
    gameState.triesLeft = 6;
    gameState.gameActive = true;
    createGrid();
    createKeyboard();
    updateStats();
    document.getElementById('nextWordBtn').style.display = 'none';
}

function getRandomWord() {
    const availableWords = words.filter(word => word !== gameState.currentWord);
    return availableWords[Math.floor(Math.random() * availableWords.length)];
}

function createGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            grid.appendChild(cell);
        }
    }
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
    ];

    keyboard.innerHTML = rows.map(row => `
        <div class="keyboard-row">
            ${row.map(key => `
                <button class="key" data-key="${key}">${key}</button>
            `).join('')}
        </div>
    `).join('');

    keyboard.addEventListener('click', e => {
        if (e.target.matches('.key') && gameState.gameActive) {
            handleInput(e.target.dataset.key);
        }
    });
}

function handleInput(key) {
    if (!gameState.gameActive) return;

    if (key === 'Enter') {
        if (gameState.currentGuess.length === 5) {
            checkGuess();
        }
    } else if (key === '⌫') {
        if (gameState.currentGuess.length > 0) {
            gameState.currentGuess.pop();
            updateGrid();
        }
    } else if (gameState.currentGuess.length < 5) {
        gameState.currentGuess.push(key);
        updateGrid();
    }
}

function updateGrid() {
    const cells = document.querySelectorAll('.cell');
    const rowStart = gameState.currentRow * 5;
    
    for (let i = 0; i < 5; i++) {
        cells[rowStart + i].textContent = gameState.currentGuess[i] || '';
    }
}

function checkGuess() {
    const guess = gameState.currentGuess.join('');
    const cells = document.querySelectorAll('.cell');
    const rowStart = gameState.currentRow * 5;
    let correct = 0;

    for (let i = 0; i < 5; i++) {
        const cell = cells[rowStart + i];
        const letter = guess[i];
        const key = document.querySelector(`[data-key="${letter}"]`);

        if (letter === gameState.currentWord[i]) {
            cell.classList.add('correct');
            key.classList.add('correct');
            correct++;
        } else if (gameState.currentWord.includes(letter)) {
            cell.classList.add('present');
            if (!key.classList.contains('correct')) {
                key.classList.add('present');
            }
        } else {
            cell.classList.add('absent');
            key.classList.add('absent');
        }
    }

    gameState.triesLeft--;
    gameState.score -= 10;
    
    if (correct === 5) {
        gameState.wordsSolved++;
        gameState.wordsAttempted++;
        if (gameState.wordsSolved === 3) {
            showMessage(`Congratulations! You've won! Final score: ${gameState.score}`);
            gameState.gameActive = false;
        } else {
            showMessage(`Correct! Click 'Try Next Word' to continue.`);
            gameState.gameActive = false;
            document.getElementById('nextWordBtn').style.display = 'block';
        }
    } else if (gameState.triesLeft === 0) {
        gameState.wordsAttempted++;
        gameState.score -= 50;
        showMessage(`Out of tries! The word was ${gameState.currentWord}. Click 'Try Next Word' to continue.`);
        gameState.gameActive = false;
        document.getElementById('nextWordBtn').style.display = 'block';
    } else {
        gameState.currentRow++;
        gameState.currentGuess = [];
    }

    updateStats();
}

function resetKeyboard() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.classList.remove('correct', 'present', 'absent');
    });
}

function updateStats() {
    document.getElementById('wordsSolved').textContent = gameState.wordsSolved;
    document.getElementById('score').textContent = gameState.score;
    updateGameData('Wordle',score);
    document.getElementById('wordsAttempted').textContent = gameState.wordsAttempted;
    document.getElementById('triesLeft').textContent = gameState.triesLeft;
}

function showMessage(msg) {
    document.getElementById('message').textContent = msg;
}

document.getElementById('nextWordBtn').addEventListener('click', () => {
    initializeGame();
});

document.addEventListener('keydown', e => {
    if (!gameState.gameActive) return;
    const key = e.key.toUpperCase();
    if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        handleInput(key === 'BACKSPACE' ? '⌫' : key);
    }
});

initializeGame();

export{initializeGame, getRandomWord, createGrid, createKeyboard, handleInput, updateGrid, checkGuess, resetKeyboard, updateStats, showMessage};
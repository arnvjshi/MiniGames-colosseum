
function updateGameData(GameScore,score) {
    localStorage.setItem('SyncSmash', score);
}

const p1Keys = ['W', 'A', 'S', 'D'];
const p2Keys = ['8', '4', '2', '6'];
const keyMap = {
    'w': 'W',
    'a': 'A',
    's': 'S',
    'd': 'D',
    '8': '8',
    '4': '4',
    '2': '2',
    '6': '6',
    'Numpad8': '8',
    'Numpad4': '4',
    'Numpad2': '2',
    'Numpad6': '6'
};

let gameActive = false;
let currentSequence = [];
let totalScore = 0;
let timeLeft = 60;
let timerInterval;
let currentP1Input = [];
let currentP2Input = [];
let currentLevel = 1;
let sequenceLength = 2;
let sequencesForNextLevel = 3;
let sequencesCompleted = 0;
let lastKeyPressTime = 0;
let syncAccuracy = 0;
let totalSequencesCompleted = 0;

// Screen Elements
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const endScreen = document.getElementById('end-screen');
const startGameBtn = document.getElementById('start-game-btn');
const restartBtn = document.getElementById('restart-btn');

// Game Elements
const timerDisplay = document.getElementById('timer');
const p1KeysDisplay = document.getElementById('p1-keys');
const p2KeysDisplay = document.getElementById('p2-keys');
const totalScoreDisplay = document.getElementById('total-score');
const p1Message = document.getElementById('p1-message');
const p2Message = document.getElementById('p2-message');
const levelDisplay = document.getElementById('level');
const syncMeter = document.getElementById('sync-meter');

// End Screen Elements
const finalScoreDisplay = document.getElementById('final-score');
const finalLevelDisplay = document.getElementById('final-level');
const finalTimeDisplay = document.getElementById('final-time');
const finalSequencesDisplay = document.getElementById('final-sequences');

function showScreen(screenId) {
    [startScreen, gameContainer, endScreen].forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function generateSequence() {
    currentSequence = Array.from({length: sequenceLength}, () => Math.floor(Math.random() * 4));
    p1KeysDisplay.textContent = currentSequence.map(i => p1Keys[i]).join(' ');
    p2KeysDisplay.textContent = currentSequence.map(i => p2Keys[i]).join(' ');
}

function levelUp() {
    currentLevel++;
    sequenceLength = Math.min(6, currentLevel + 1);
    sequencesForNextLevel = Math.min(5, currentLevel + 2);
    timeLeft += 15;
    levelDisplay.textContent = `Level ${currentLevel}`;
    sequencesCompleted = 0;
}

function startGame() {
    gameActive = true;
    totalScore = 0;
    timeLeft = 60;
    currentP1Input = [];
    currentP2Input = [];
    currentLevel = 1;
    sequenceLength = 2;
    sequencesForNextLevel = 3;
    sequencesCompleted = 0;
    totalSequencesCompleted = 0;
    syncAccuracy = 0;
    
    showScreen('game-container');
    totalScoreDisplay.textContent = '0';
    levelDisplay.textContent = 'Level 1';
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    generateSequence();
}

function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    
    // Update end screen stats
    finalScoreDisplay.textContent = totalScore;
    finalLevelDisplay.textContent = currentLevel;
    finalTimeDisplay.textContent = 60 - timeLeft;
    finalSequencesDisplay.textContent = totalSequencesCompleted;
    
    showScreen('end-screen');
}

function updateSyncMeter(syncTime) {
    const syncPercentage = Math.max(0, 100 - (syncTime / 10));
    syncMeter.style.width = `${syncPercentage}%`;
    return syncPercentage;
}

function checkInput(player, input, timestamp) {
    const expectedKeys = player === 1 ? p1Keys : p2Keys;
    const currentInput = player === 1 ? currentP1Input : currentP2Input;
    const otherInput = player === 1 ? currentP2Input : currentP1Input;
    const currentIndex = currentInput.length - 1;
    
    if (expectedKeys[currentSequence[currentIndex]] === input) {
        if (otherInput.length === currentInput.length) {
            const syncTime = Math.abs(timestamp - lastKeyPressTime);
            syncAccuracy = updateSyncMeter(syncTime);
        }
        
        lastKeyPressTime = timestamp;

        if (currentInput.length === currentSequence.length && 
            otherInput.length === currentSequence.length) {
            
            const syncBonus = Math.floor(syncAccuracy / 10);
            totalScore += (currentLevel * 100) + syncBonus;
            totalScoreDisplay.textContent = totalScore;
            updateGameData('SyncSmash',totalScore);
            
            sequencesCompleted++;
            totalSequencesCompleted++;
            currentP1Input = [];
            currentP2Input = [];
            
            if (sequencesCompleted >= sequencesForNextLevel) {
                levelUp();
            }
            
            generateSequence();
        }
        return true;
    }
    return false;
}

document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    
    const key = keyMap[e.key.toLowerCase()] || keyMap[e.code];
    if (!key) return;
    
    const timestamp = e.timeStamp;
    
    if (['W', 'A', 'S', 'D'].includes(key)) {
        if (currentP1Input.length < currentSequence.length) {
            currentP1Input.push(key);
            if (!checkInput(1, key, timestamp)) {
                p1Message.textContent = 'Wrong key!';
                setTimeout(() => p1Message.textContent = '', 500);
                currentP1Input = [];
                currentP2Input = [];
            }
        }
    } else if (['8', '4', '2', '6'].includes(key)) {
        if (currentP2Input.length < currentSequence.length) {
            currentP2Input.push(key);
            if (!checkInput(2, key, timestamp)) {
                p2Message.textContent = 'Wrong key!';
                setTimeout(() => p2Message.textContent = '', 500);
                currentP1Input = [];
                currentP2Input = [];
            }
        }
    }
});

startGameBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

export{
    startGame,
    endGame,
    generateSequence,
    levelUp,
    updateSyncMeter,
    checkInput
};
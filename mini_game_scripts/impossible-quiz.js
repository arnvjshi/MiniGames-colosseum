function updateGameData(GameScore,score) {
    localStorage.setItem('ImpossibleQuiz', score);
}
const questions = [
    {
        question: "WHAT IS 2 + 2?",
        options: ["5", "FISH", "4", "22"],
        correct: 2,
        timeLimit: 5
    },
    {
        question: "WHAT DO YOU DO AT A GREEN LIGHT?",
        options: ["STOP", "WAIT", "GO", "DANCE"],
        correct: 2,
        timeLimit: 4
    },
    {
        question: "HOW MANY MONTHS HAVE 28 DAYS?",
        options: ["1", "2", "ALL", "NONE"],
        correct: 2,
        timeLimit: 4
    },
    {
        question: "QUICKLY CLICK THE BLUE OPTION!",
        options: ["RED", "GREEN", "BLUE", "YELLOW"],
        correct: 2,
        timeLimit: 3
    },
    {
        question: "WHAT GOES UP BUT NEVER COMES DOWN?",
        options: ["BALLOON", "YOUR AGE", "ROCKET", "ELEVATOR"],
        correct: 1,
        timeLimit: 5
    },
    {
        question: "WHICH WORD IS SPELLED CORRECTLY?",
        options: ["RECIEVE", "SEPERATE", "CORRECTLY", "DEFINATELY"],
        correct: 2,
        timeLimit: 4
    },
    {
        question: "WHAT HAS KEYS BUT NO LOCKS?",
        options: ["DOOR", "KEYBOARD", "PIANO", "SAFE"],
        correct: 1,
        timeLimit: 5
    },
    {
        question: "HOW MANY SIDES DOES A CIRCLE HAVE?",
        options: ["0", "1", "2", "INFINITE"],
        correct: 0,
        timeLimit: 4
    },
    {
        question: "WHAT GETS WET WHILE DRYING?",
        options: ["OCEAN", "TOWEL", "RAIN", "SPONGE"],
        correct: 1,
        timeLimit: 5
    },
    {
        question: "CLICK THE SMALLEST NUMBER",
        options: ["1000", "10", "100", "1"],
        correct: 3,
        timeLimit: 4
    },
    {
        question: "WHAT HAS A HEAD AND TAIL BUT NO BODY?",
        options: ["SNAKE", "COIN", "WORM", "ARROW"],
        correct: 1,
        timeLimit: 3
    },
    {
        question: "WHICH OF THESE IS NOT A COLOR?",
        options: ["BLUE", "GREEN", "SQUARE", "RED"],
        correct: 2,
        timeLimit: 4
    },
    {
        question: "WHAT CAN TRAVEL AROUND THE WORLD WHILE STAYING IN A CORNER?",
        options: ["AIRPLANE", "POSTAGE STAMP", "INTERNET", "RADIO"],
        correct: 1,
        timeLimit: 5
    },
    {
        question: "IF YOU HAVE ME, YOU WANT TO SHARE ME. IF YOU SHARE ME, YOU HAVEN'T GOT ME. WHAT AM I?",
        options: ["SECRET", "MONEY", "LOVE", "KNOWLEDGE"],
        correct: 0,
        timeLimit: 3
    },
    {
        question: "CLICK THE ANSWER THAT MAKES NO SENSE",
        options: ["BANANA", "REASONABLE", "LOGIC", "SENSE"],
        correct: 0,
        timeLimit: 4
    }
];

let currentQuestion = 0;
let lives = 3;
let score = 0;
let timer = 30;
let timerInterval;
let correctIndexInRandomized;

const startScreen = document.getElementById('start-screen');
const quizContainer = document.getElementById('quiz-container');
const loadingOverlay = document.getElementById('loading-overlay');
const gameOverScreen = document.getElementById('game-over');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startGame() {
    startScreen.style.display = 'none';
    quizContainer.style.display = 'block';
    resetGame();
}

function restartGame() {
    gameOverScreen.style.display = 'none';
    quizContainer.style.display = 'block';
    resetGame();
}

function updateScoreDisplay() {
    document.getElementById('score').innerHTML = `SCORE: ${score}`;
    updateGameData('ImpossibleQuiz', score);
}

function startTimer() {
    const timerDisplay = document.getElementById('timer');
    timer = questions[currentQuestion].timeLimit;
    timerDisplay.innerHTML = `TIME: ${timer}`;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer--;
        timerDisplay.innerHTML = `TIME: ${timer}`;

        if (timer <= 0) {
            clearInterval(timerInterval);
            lives--;
            updateLivesDisplay();
            loadQuestion();
        }
    }, 1000);
}

function updateLivesDisplay() {
    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = `LIVES: ${'❤️'.repeat(lives)}`;
}

function showLoadingOverlay() {
    loadingOverlay.style.display = 'flex';
    quizContainer.style.display = 'none';
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
        quizContainer.style.display = 'block';
    }, 3000);
}

function loadQuestion() {
    clearInterval(timerInterval);
    
    if (lives <= 0) {
        gameOver();
        return;
    }

    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('options-container');
    const currentQ = questions[currentQuestion];

    let shuffledOptions = [...currentQ.options];
    shuffleArray(shuffledOptions);

    correctIndexInRandomized = shuffledOptions.indexOf(currentQ.options[currentQ.correct]);

    questionContainer.innerHTML = `<h2 class="question">${currentQ.question}</h2>`;
    
    optionsContainer.innerHTML = shuffledOptions.map((option, index) => 
        `<div class="option" onclick="checkAnswer(${index})">${option}</div>`
    ).join('');

    startTimer();
}

function checkAnswer(selectedIndex) {
    clearInterval(timerInterval);
    const currentQ = questions[currentQuestion];
    const optionsContainer = document.getElementById('options-container');
    const options = optionsContainer.getElementsByClassName('option');

    if (selectedIndex === correctIndexInRandomized) {
        score += 10;
        updateScoreDisplay();
        currentQuestion++;
        
        if (currentQuestion < questions.length) {
            showLoadingOverlay();
            setTimeout(loadQuestion, 3000);
        } else {
            gameOver();
        }
    } else {
        options[selectedIndex].classList.add('wrong');
        lives--;
        updateLivesDisplay();
        
        if (lives > 0) {
            setTimeout(loadQuestion, 500);
        } else {
            gameOver();
        }
    }
}

function gameOver() {
    quizContainer.style.display = 'none';
    gameOverScreen.style.display = 'flex';
    document.getElementById('final-score').innerHTML = `SCORE: ${score}`;
}

function resetGame() {
    currentQuestion = 0;
    lives = 3;
    score = 0;
    updateScoreDisplay();
    updateLivesDisplay();
    loadQuestion();
}
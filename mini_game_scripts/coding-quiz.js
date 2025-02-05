// Initialize score from localStorage or set to 0
let gameScore = parseInt(localStorage.getItem('CodingQuiz')) || 0;

const questions = [
    {
        text: "What does CSS stand for?",
        options: [
            "Cascading Style Sheets",
            "Computer Style System",
            "Creative Style Selector",
            "Coded Style Structure"
        ],
        correct: 0
    },
    {
        text: "Which HTML tag is used to define an internal CSS?",
        options: [
            "<script>",
            "<css>",
            "<style>",
            "<link>"
        ],
        correct: 2
    },
    // Add more questions here to reach 50
    {
        text: "What is the correct way to declare a JavaScript variable?",
        options: [
            "variable x = 5;",
            "var x = 5;",
            "x = 5;",
            "let x = 5;"
        ],
        correct: 3
    }
];

let attempts = 0;
let startTime, timerInterval;
let currentQuestion = null;

function updateGameScore(points) {
    gameScore += points;
    localStorage.setItem('CodingQuiz', gameScore.toString());
    updateStatus();
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateStatus, 1000);
}

function updateStatus() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('status').innerHTML = 
        `Score: ${gameScore} | Attempts: ${attempts} | Time: ${elapsedTime}s`;
}

function getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
}

function loadQuestion() {
    currentQuestion = getRandomQuestion();
    document.getElementById('question').textContent = currentQuestion.text;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    currentQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => checkAnswer(index));
        optionsContainer.appendChild(optionElement);
    });
}

function checkAnswer(selectedIndex) {
    attempts++;
    const resultElement = document.getElementById('result');
    const options = document.querySelectorAll('.option');

    // Disable all options
    options.forEach(option => {
        option.style.pointerEvents = 'none';
        option.style.opacity = '0.7';
    });

    if (selectedIndex === currentQuestion.correct) {
        resultElement.textContent = "✅ Correct! +10 points";
        resultElement.style.color = "green";
        updateGameScore(10);
        options[currentQuestion.correct].style.backgroundColor = '#28a745';
    } else {
        resultElement.textContent = "❌ Wrong! -10 points";
        resultElement.style.color = "red";
        updateGameScore(-10);
        options[currentQuestion.correct].style.backgroundColor = '#28a745';
        options[selectedIndex].style.backgroundColor = '#dc3545';
    }

    // Load next question after delay
    setTimeout(() => {
        loadQuestion();
        resultElement.textContent = "";
        resultElement.style.color = "white";
    }, 2000);
}

function initQuiz() {
    attempts = 0;
    loadQuestion();
    startTimer();
    updateStatus();
}

initQuiz();
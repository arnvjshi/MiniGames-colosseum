// Initialize score from localStorage or set to 0
let gameScore = parseInt(localStorage.getItem('CodingQuiz')) || 0;

const questions = [
    {
        text: "Which of the following is the correct syntax for a for loop in C?",
        options: [
            "for(i = 0; i < 10; i++) {}",
            "for(i = 0, i < 10, i++) {}",
            "for(i = 0; i < 10; i++)",
            "for(i = 0 to 10) {}"
        ],
        correct: 0
    },
    {
        text: "What will be the output of the following code?\\n#include <stdio.h>\\nint main() {\\n    int x = 5;\\n    printf(\"%d\", x++);\\n    return 0;\\n}",
        options: [
            "5",
            "6",
            "0",
            "Compilation Error"
        ],
        correct: 0
    },
    {
        text: "Which of the following is used for memory allocation in C?",
        options: [
            "malloc()",
            "free()",
            "calloc()",
            "All of the above"
        ],
        correct: 3
    },
    {
        text: "What is the default value of a variable declared as static?",
        options: [
            "Undefined",
            "0",
            "-1",
            "NULL"
        ],
        correct: 1
    },
    {
        text: "In C, the sizeof operator gives the size of:",
        options: [
            "A variable",
            "A data type",
            "A constant",
            "All of the above"
        ],
        correct: 3
    },
    {
        text: "Which of the following data types can store the largest range of integer values?",
        options: [
            "int",
            "long",
            "long long",
            "float"
        ],
        correct: 2
    },
    {
        text: "What is the value of x after the following code is executed?\\nint x = 10;\\nx = x++ + ++x;",
        options: [
            "21",
            "20",
            "19",
            "22"
        ],
        correct: 0
    },
    {
        text: "Which operator is used to get the address of a variable in C?",
        options: [
            "*",
            "&",
            "@",
            "#"
        ],
        correct: 1
    },
    {
        text: "What will be the output of the following code?\\n#include <stdio.h>\\nint main() {\\n    int a = 10, b = 5;\\n    printf(\"%d\", a & b);\\n    return 0;\\n}",
        options: [
            "15",
            "5",
            "0",
            "10"
        ],
        correct: 2
    },
    {
        text: "Which of the following is correct to declare a function in C?",
        options: [
            "int func(void)",
            "int func()",
            "int func();",
            "All of the above"
        ],
        correct: 3
    }
    // Add more questions here following the same format
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
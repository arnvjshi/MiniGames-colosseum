
function updateGameData(GameScore,score) {
    localStorage.setItem('Guess', score);
}

const characters = [
    {
        name: "Iron Man",
        hints: [
            "Created a highly advanced AI known as J.A.R.V.I.S.",
            "Developed a chest arc reactor to keep himself alive after a near-fatal injury"
        ]
    },
    {
        name: "Thor",
        hints: [
            "Was banished from his home realm for his arrogance and impulsive actions",
            "Wields a hammer forged in a dying star, capable of summoning lightning"
        ]
    },
    {
        name: "Black Widow",
        hints: [
            "Had her memories altered by the Russian government as part of her training",
            "Was a key player in the infiltration of the S.H.I.E.L.D. organization"
        ]
    },
    {
        name: "Doctor Strange",
        hints: [
            "Lost the use of his hands in a car accident, leading him to seek mystical healing",
            "Traded his hands for magical abilities, ultimately becoming the Sorcerer Supreme"
        ]
    },
    {
        name: "Captain America",
        hints: [
            "Underwent a secret government program that transformed him into a super soldier",
            "Served in World War II, but was frozen in ice and awoke decades later"
        ]
    },
];

let currentCharacter = 0;
let score = 0;
let hintsUsed = 0;
let currentHint = 0;
let canGuess = true;
let totalCharacters = characters.length;
let firstHintUsed = false;

const scoreDisplay = document.getElementById('score');
const hintsUsedDisplay = document.getElementById('hints-used');
const hintsContainer = document.getElementById('hints-container');
const guessInput = document.getElementById('guess-input');
const messageDiv = document.getElementById('message');
const nextButton = document.getElementById('next-button');
const finalMessage = document.getElementById('final-message');

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
}

function updateScore(points) {
    score = Math.min(500, score + points);
    scoreDisplay.textContent = score;
    updateGameData('Guess',score);
}

function showHint() {
    if (currentHint >= characters[currentCharacter].hints.length || !canGuess) return;
    
    const hint = characters[currentCharacter].hints[currentHint];
    const hintDiv = document.createElement('div');
    hintDiv.className = 'hint';
    hintDiv.textContent = hint;
    hintsContainer.appendChild(hintDiv);

    setTimeout(() => hintDiv.classList.add('visible'), 50);

    // Only deduct points for subsequent hints
    if (firstHintUsed) {
        updateScore(-20);  // Deduct points for subsequent hints
    } else {
        firstHintUsed = true;  // Mark the first hint as used
    }

    currentHint++;
    hintsUsed++;
    hintsUsedDisplay.textContent = hintsUsed;

    // Disable hint button if all hints are shown
    if (currentHint >= characters[currentCharacter].hints.length) {
        document.getElementById('hint-button').classList.add('hidden-element');
    }
}

function checkGuess() {
    const userGuess = guessInput.value.trim().toLowerCase();
    const correctAnswer = characters[currentCharacter].name.toLowerCase();

    if (userGuess === correctAnswer) {
        showMessage("Correct! Well done!", "success");
        updateScore(100);  // Reward for correct guess
        canGuess = false;
        nextButton.style.display = 'block';
    } else {
        showMessage("Incorrect! Try again.", "error");
    }
}

function endGame() {
    finalMessage.style.display = 'block';
    finalMessage.textContent = `Game Over! Your final score is ${score}. Congratulations!`;
    finalMessage.className = 'message congratulations';
}

function startNewCharacter() {
    currentHint = 0;
    firstHintUsed = false; // Reset for the new character
    canGuess = true;
    hintsContainer.innerHTML = '';
    guessInput.value = '';
    messageDiv.textContent = '';
    nextButton.style.display = 'none';
    document.getElementById('hint-button').classList.remove('hidden-element'); // Re-enable hint button for new character
    
    if (currentCharacter < totalCharacters) {
        showHint();
    } else {
        endGame();
    }
}

// Add event listener for the hint button
document.getElementById('hint-button').addEventListener('click', function() {
    if (canGuess) {
        showHint();
    }
});

// Add event listener for the guess button
document.getElementById('guess-button').addEventListener('click', checkGuess);

// Add event listener for the next button
nextButton.addEventListener('click', function() {
    currentCharacter++;
    startNewCharacter();
});

startNewCharacter();

export { showMessage, updateScore, showHint, checkGuess, endGame, startNewCharacter };
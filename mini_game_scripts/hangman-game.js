
function updateGameData(GameScore,score) {
    localStorage.setItem('HangmanGame', score);
}

const gameState = {
    questions: [
      { 
        word: 'STARK', 
        initialHint: 'Avengers, Surname',
        extraHint: 'The man inside the Iron Man suit' 
      },
      { 
        word: 'GROOT', 
        initialHint: 'Guardians of the Galaxy',
        extraHint: 'A talking tree from Guardians of the Galaxy' 
      },
      { 
        word: 'WANDA', 
        initialHint: 'Avengers, First name',
        extraHint: 'Lost her brother Pietro in Age of Ultron' 
      },
      { 
        word: 'PYTHON', 
        initialHint: 'Programming Language',
        extraHint: 'Named after a British comedy group, not a snake' 
      },
      { 
        word: 'THANOS', 
        initialHint: 'Marvel Villain',
        extraHint: 'The Mad Titan who sought to collect the Infinity Stones' 
      }
    ],
    currentQuestion: 0,
    currentWord: '',
    guessedLetters: new Set(),
    triesPerWord: [5, 5, 5, 5, 5],
    score: 0,
    maxScore: 500,
    hintUsed: false,
    gameOver: false
  };
  
  
          const hangmanStages = [
              `
    +---+
    |   |
        |
        |
        |
        |
  ========`,
              `
    +---+
    |   |
    O   |
        |
        |
        |
  ========`,
              `
    +---+
    |   |
    O   |
    |   |
        |
        |
  ========`,
              `
    +---+
    |   |
    O   |
   /|\\  |
        |
        |
  ========`,
              `
    +---+
    |   |
    O   |
   /|\\  |
   / \\  |
        |
  ========`
          ];
  
          function initializeGame() {
              gameState.currentWord = gameState.questions[gameState.currentQuestion].word;
              gameState.guessedLetters.clear();
              gameState.hintUsed = false;
              updateDisplay();
              createKeyboard();
              updateTriesDisplay();
              updateInitialHint();
              document.getElementById('hintText').textContent = '';
          }
  
          function createKeyboard() {
              const keyboard = document.getElementById('keyboard');
              keyboard.innerHTML = '';
              for (let i = 65; i <= 90; i++) {
                  const letter = String.fromCharCode(i);
                  const button = document.createElement('button');
                  button.textContent = letter;
                  button.className = 'key';
                  button.addEventListener('click', () => handleGuess(letter));
                  keyboard.appendChild(button);
              }
          }
  
          function updateInitialHint() {
              const initialHintElement = document.getElementById('initialHint');
              initialHintElement.textContent = `Initial Hint: ${gameState.questions[gameState.currentQuestion].initialHint}`;
          }
  
          function updateTriesDisplay() {
              for (let i = 0; i < 3; i++) {
                  const triesElement = document.getElementById(`tries${i + 1}`);
                  triesElement.textContent = `Word ${i + 1}: ${gameState.triesPerWord[i]} tries`;
                  triesElement.className = 'try-count' + (i === gameState.currentQuestion ? ' current' : '');
              }
          }
  
          function updateDisplay() {
              const wordDisplay = document.getElementById('wordDisplay');
              
              if (gameState.triesPerWord[gameState.currentQuestion] === 0) {
                  wordDisplay.textContent = gameState.currentWord;
              } else {
                  wordDisplay.textContent = gameState.currentWord
                      .split('')
                      .map(letter => gameState.guessedLetters.has(letter) ? letter : '_')
                      .join(' ');
              }
  
              document.getElementById('questionNumber').textContent = gameState.currentQuestion + 1;
              document.getElementById('score').textContent = gameState.score;
  
              document.getElementById('hangman').textContent = 
                  hangmanStages[5 - gameState.triesPerWord[gameState.currentQuestion]];
  
              document.querySelectorAll('.key').forEach(key => {
                  if (gameState.guessedLetters.has(key.textContent)) {
                      key.classList.add('used');
                      key.disabled = true;
                  }
              });
  
              document.getElementById('nextBtn').style.display = 
                  (isWordComplete() && gameState.triesPerWord[gameState.currentQuestion] > 0) ? 'block' : 'none';
          }
  
          function handleGuess(letter) {
              if (gameState.guessedLetters.has(letter)) return;
  
              gameState.guessedLetters.add(letter);
              
              if (!gameState.currentWord.includes(letter)) {
                  gameState.triesPerWord[gameState.currentQuestion]--;
                  gameState.score = Math.max(0, gameState.score - 20);
                  updateGameData('HangmanGame',score);
                  
                  if (gameState.triesPerWord[gameState.currentQuestion] === 0) {
                      handleWordFailure();
                  }
              } else {
                  const occurrences = gameState.currentWord.split(letter).length - 1;
                  gameState.score += occurrences * 30;
                  updateGameData('HangmanGame',score);
              }
  
              if (isWordComplete() && gameState.triesPerWord[gameState.currentQuestion] > 0) {
                  gameState.score += gameState.triesPerWord[gameState.currentQuestion] * 10;
                  updateGameData('HangmanGame',score);
              }
  
              updateDisplay();
              updateTriesDisplay();
          }
  
          function handleWordFailure() {
              updateDisplay();
              
              document.querySelectorAll('.key').forEach(key => {
                  key.disabled = true;
              });
  
              setTimeout(() => {
                  showMessage(`Incorrect! The word was: ${gameState.currentWord}`);
                  
                  setTimeout(() => {
                      if (gameState.currentQuestion < gameState.questions.length - 1) {
                          gameState.currentQuestion++;
                          initializeGame();
                      } else {
                          gameOver();
                      }
                  }, 500);
              }, 100);
          }
  
          function gameOver() {
              showMessage(`Game Complete! Final Score: ${gameState.score}`);
              document.querySelectorAll('.key').forEach(key => key.disabled = true);
              document.getElementById('hintBtn').disabled = true;
              document.getElementById('nextBtn').style.display = 'none';
          }
  
          function showHint() {
              if (!gameState.hintUsed) {
                  const hintText = document.getElementById('hintText');
                  hintText.textContent = `Extra Hint: ${gameState.questions[gameState.currentQuestion].extraHint}`;
                  gameState.score = Math.max(0, gameState.score - 50);
                  gameState.hintUsed = true;
                  updateDisplay();
              }
          }
  
          function isWordComplete() {
              return gameState.currentWord
                  .split('')
                  .every(letter => gameState.guessedLetters.has(letter));
          }
  
          function nextWord() {
              if (gameState.currentQuestion < gameState.questions.length - 1) {
                  gameState.currentQuestion++;
                  initializeGame();
              } else {
                  gameOver();
              }
          }
  
          function showMessage(message) {
              setTimeout(() => alert(message), 100);
          }
  
          // Event Listeners
          document.getElementById('hintBtn').addEventListener('click', showHint);
          document.getElementById('nextBtn').addEventListener('click', nextWord);
  
          // Start the game
          initializeGame();

export{
    initializeGame,
    createKeyboard,
    updateInitialHint,
    updateTriesDisplay,
    updateDisplay,
    handleGuess,
    handleWordFailure,
    gameOver,
    showHint,
    isWordComplete,
    nextWord,
    showMessage
};
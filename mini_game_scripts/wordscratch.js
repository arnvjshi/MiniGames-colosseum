function updateGameData(GameScore,score) {
    localStorage.setItem('WordScratch', score);
}
    // --- Game Variables ---
    const wordsPool = ["ironman", "thor", "hulk", "spiderman", "loki", "wanda", "vision", "hawkeye", "thanos", "blackwidow"];
    let words = [];
    let foundWords = new Set();
    let selectedCells = [];
    let isMouseDown = false;
    
    const substitutionRules = {
      r: "e",
      f: "i",
      h: "k",
      l: "q",
      n: "t"
    };
    
    // DOM Elements
    const instructions = document.getElementById('instructions');
    const gameContainer = document.getElementById('game-container');
    const timer = document.getElementById('timer');
    const wordGrid = document.getElementById('word-grid');
    const winMessageElement = document.getElementById('win-message');
    const scoreDisplay = document.getElementById('score');
    const gameTimerDisplay = document.getElementById('game-timer');
    
    // Countdown variables
    let countdown = 10;
    let startTime;
    let previousFoundTime; // For relative scoring
    let totalScore = 0;
    
    // Game timer variables
    const gameDuration =  900; // 5 minutes in seconds
    let gameTimeLeft = gameDuration;
    let gameTimerInterval;
    
    // Scoring parameters
    const maxScoreTotal = 1000;
    const maxTimeSeconds = 900; 
    const maxWordScore = maxScoreTotal / 5; 
    
    // Countdown before game starts
    const interval = setInterval(() => {
      timer.textContent = countdown;
      if (countdown === 0) {
        clearInterval(interval);
        instructions.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        setupGame();
        // Set the start time and initialize previousFoundTime
        startTime = Date.now();
        previousFoundTime = startTime;
        // Start the game timer
        startGameTimer();
      }
      countdown--; 
    }, 1000);
    
    function startGameTimer() {
      gameTimerInterval = setInterval(() => {
        gameTimeLeft--;
        const minutes = Math.floor(gameTimeLeft / 60);
        const seconds = gameTimeLeft % 60;
        gameTimerDisplay.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        if (gameTimeLeft <= 0) {
          clearInterval(gameTimerInterval);
          endGame();
        }
      }, 1000);
    }
    
    function endGame() {
      winMessageElement.textContent = `Game Over! Final Score: ${totalScore}`;
      winMessageElement.style.color = '#dc3545';
      // Disable further selections
      wordGrid.removeEventListener('mousedown', startSelection);
      wordGrid.removeEventListener('mouseover', extendSelection);
      wordGrid.removeEventListener('mouseup', checkSelection);
    }
    
    function getRandomWords() {
      return wordsPool.sort(() => 0.5 - Math.random()).slice(0, 5);
    }
    
    const grid = Array.from({ length: 10 }, () => Array(10).fill(''));
    
    function setupGame() {
      words = getRandomWords();
      fillGrid();
      renderGrid();
      logWordsInGrid();
    }
    
    function logWordsInGrid() {
      // For debugging: log the substituted words
      words.forEach(word => {
        console.log(applySubstitution(word));
      });
    }
    
    function applySubstitution(word) {
      return word
        .split('')
        .map(char => substitutionRules[char] || char)
        .join('');
    }
    
    function fillGrid() {
      words.forEach(word => {
        const substitutedWord = applySubstitution(word);
        let placed = false;
    
        while (!placed) {
          const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
          const row = Math.floor(Math.random() * (direction === 'horizontal' ? 10 : 10 - substitutedWord.length));
          const col = Math.floor(Math.random() * (direction === 'vertical' ? 10 : 10 - substitutedWord.length));
    
          if (canPlaceWord(substitutedWord, row, col, direction)) {
            placeWord(substitutedWord, row, col, direction);
            placed = true;
          }
        }
      });
    
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          if (!grid[r][c]) {
            grid[r][c] = String.fromCharCode(97 + Math.floor(Math.random() * 26));
          }
        }
      }
    }
    
    function canPlaceWord(word, row, col, direction) {
      for (let i = 0; i < word.length; i++) {
        if (direction === 'horizontal' && grid[row][col + i] !== '') return false;
        if (direction === 'vertical' && grid[row + i][col] !== '') return false;
      }
      return true;
    }
    
    function placeWord(word, row, col, direction) {
      for (let i = 0; i < word.length; i++) {
        if (direction === 'horizontal') {
          grid[row][col + i] = word[i];
        } else {
          grid[row + i][col] = word[i];
        }
      }
    }
    
    function renderGrid() {
      wordGrid.innerHTML = '';
      grid.forEach((row, rowIndex) => {
        row.forEach((letter, colIndex) => {
          const cell = document.createElement('div');
          cell.textContent = letter.toUpperCase();
          cell.dataset.row = rowIndex;
          cell.dataset.col = colIndex;
          cell.addEventListener('mousedown', () => startSelection(rowIndex, colIndex));
          cell.addEventListener('mouseover', () => extendSelection(rowIndex, colIndex));
          cell.addEventListener('mouseup', checkSelection);
          wordGrid.appendChild(cell);
        });
      });
    }
    
    function startSelection(row, col) {
      clearSelection();
      isMouseDown = true;
      const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
      selectedCells.push(cell);
      cell.classList.add('selected');
    }
    
    function extendSelection(row, col) {
      if (isMouseDown && selectedCells.length > 0) {
        const firstCell = selectedCells[0];
        const firstRow = parseInt(firstCell.dataset.row);
        const firstCol = parseInt(firstCell.dataset.col);
    
        if (row === firstRow || col === firstCol) {
          const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
          if (!selectedCells.includes(cell)) {
            selectedCells.push(cell);
            cell.classList.add('selected');
          }
        }
      }
    }
    
    function checkSelection() {
      isMouseDown = false;
      const selectedWord = selectedCells.map(cell => cell.textContent.toLowerCase()).join('');
      const originalWords = words.map(word => applySubstitution(word));
    
      if (originalWords.includes(selectedWord) && !foundWords.has(selectedWord)) {
        // Mark as correct
        selectedCells.forEach(cell => {
          cell.classList.add('correct');
          cell.classList.remove('selected');
        });
        foundWords.add(selectedWord);
    
        // Calculate relative time gap for scoring
        const currentTime = Date.now();
        const deltaSeconds = (currentTime - previousFoundTime) / 1000;
        previousFoundTime = currentTime; // update for next word
    
        // Calculate the word's score using a linear decay function
        const wordScore = Math.max(0, Math.floor(maxWordScore * (1 - deltaSeconds / maxTimeSeconds)));
        totalScore += wordScore;
        updateGameData('WordScratch',totalScore);
        updateScoreDisplay();
    
        console.log(`Found "${selectedWord}" after ${Math.floor(deltaSeconds)}s gap for ${wordScore} points`);
    
        if (foundWords.size === words.length) {
          declareWin();
        }
      } else {
        // Wrong selection: indicate error and then clear after 1 second
        selectedCells.forEach(cell => {
          cell.classList.add('wrong');
          cell.classList.remove('selected');
        });
    
        setTimeout(() => {
          selectedCells.forEach(cell => {
            cell.classList.remove('wrong');
            cell.classList.remove('selected');
          });
          clearSelection();
        }, 1000);
      }
    }
    
    function declareWin() {
      console.log('Congratulations! You found all the words!');
      winMessageElement.textContent = 'Congratulations! You found all the words! Final Score: ' + totalScore;
      clearInterval(gameTimerInterval);
    }
    
    function clearSelection() {
      selectedCells = [];
    }
    
    function updateScoreDisplay() {
      scoreDisplay.textContent = 'Score: ' + totalScore;
    }

    export{};
    {
        startGameTimer,
        endGame,
        setupGame,
        startSelection,
        extendSelection,
        checkSelection,
        declareWin,
        clearSelection,
        updateScoreDisplay
    }
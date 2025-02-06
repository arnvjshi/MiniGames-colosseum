
function updateGameData(GameScore,score) {
    localStorage.setItem('MemoryGame', score);
}

document.addEventListener('DOMContentLoaded', () => {
    const emojis = ['🍄', '🌟', '👾', '🚀', '🌈', '✨', '🎹', '🔪', '🐛', '🕚', '🦄', '🎃', '💎', '🦖', '🎸', '🎭', '🐉', '🎲'];
    let firstCard = null;
    let moves = 0;
    let matchedPairs = 0;
    let canClick = true;
    let score = 0;
    const totalPairs = emojis.length;
    const maxMoves = 110;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createGameBoard() {
        const gameBoard = document.getElementById('game-board');
        const shuffledEmojis = shuffleArray([...emojis, ...emojis]);

        gameBoard.innerHTML = '';
        shuffledEmojis.forEach((emoji) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.emoji = emoji;
            gameBoard.appendChild(card);
        });
        gameBoard.addEventListener('click', handleCardClick);
        resetGame();
    }

    function resetGame() {
        firstCard = null;
        moves = 0;
        matchedPairs = 0;
        canClick = true;
        score = 0;
        document.getElementById('game-status').textContent = 'Moves: 0';
        document.getElementById('score').textContent = 'Score: 0';
        document.getElementById('congrats').style.display = 'none';
    }

    function handleCardClick(event) {
        const card = event.target;
        if (!canClick || !card.classList || card.classList.contains('flipped') || card.classList.contains('matched')) return;

        card.classList.add('flipped');
        card.textContent = card.dataset.emoji;

        moves++;
        document.getElementById('game-status').textContent = `Moves: ${moves}`;

        if (moves > maxMoves) {
            endGame();
            return;
        }

        if (!firstCard) {
            firstCard = card;
        } else {
            if (firstCard.dataset.emoji === card.dataset.emoji) {
                firstCard.classList.add('matched');
                card.classList.add('matched');
                matchedPairs++;

                score += calculateScore(moves);
                updateGameData('MemoryGame',score);

                if (matchedPairs === totalPairs) {
                    endGame();
                }
                firstCard = null;
            } else {
                score -= calculatePenalty(moves);

                canClick = false;
                setTimeout(() => {
                    firstCard.classList.remove('flipped');
                    card.classList.remove('flipped');
                    firstCard.textContent = '';
                    card.textContent = '';
                    firstCard = null;
                    canClick = true;
                }, 1000);
            }

            document.getElementById('score').textContent = `Score: ${score}`;
        }
    }

    function calculateScore(moves) {
        if (moves <= 36) return 56;
        if (moves <= 50) return 50;
        if (moves <= 65) return 44;
        if (moves <= 80) return 38;
        if (moves <= 95) return 32;
        if (moves <= 110) return 28;
        return 0;  // No score after 110 moves
    }

    function calculatePenalty(moves) {
        if (moves <= 36) return 0;
        if (moves <= 50) return 2;
        if (moves <= 65) return 4;
        if (moves <= 80) return 6;
        if (moves <= 95) return 10;
        if (moves <= 110) return 12;
        return 0;  // No penalty after 110 moves
    }

    function endGame() {
        document.getElementById('congrats').style.display = 'block';
        document.getElementById('final-score').textContent = Math.max(0, Math.min(1000, score));
    }

    createGameBoard();
});
export{createGameBoard, resetGame, handleCardClick, calculateScore, calculatePenalty, endGame};
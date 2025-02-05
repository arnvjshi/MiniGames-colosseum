let GameScore=0;
        function updateGameData(GameScore,score) {
            localStorage.setItem('MemoryGame', score);
        }
        document.addEventListener('DOMContentLoaded', () => {
            const emojis = ['🍄', '🌟', '👾', '🚀', '🌈','✨','🎹','🔪','🐛','🕚'];
            let firstCard = null;
            let moves = 0;
            let matchedPairs = 0;
            let canClick = true;
            let startTime, timerInterval;

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
                document.getElementById('game-status').textContent = 'Moves: 0';
                document.getElementById('congrats').style.display = 'none';
                document.getElementById('timer').textContent = 'Time: 0s';
                clearInterval(timerInterval);
                startTimer();
            }
            const time=3*60;
            function startTimer() {
                startTime = Date.now();
                timerInterval = setInterval(updateTimer, 1000);
            }

            function updateTimer() {
                const elapsedTime = Math.floor((Date.now() -startTime) / 1000);
               
                document.getElementById('timer').textContent = `Time: ${elapsedTime}s`;
            }

            function handleCardClick(event) {
                const card = event.target;
                if (!canClick || !card.classList || card.classList.contains('flipped') || card.classList.contains('matched')) return;

                card.classList.add('flipped');
                card.textContent = card.dataset.emoji;

                if (!firstCard) {
                    firstCard = card;
                } else {
                    moves++;
                    document.getElementById('game-status').textContent = `Moves: ${moves}`;

                    if (firstCard.dataset.emoji === card.dataset.emoji) {
                        firstCard.classList.add('matched');
                        card.classList.add('matched');
                        matchedPairs++;

                        if (matchedPairs === emojis.length) {
                            clearInterval(timerInterval);
                            document.getElementById('congrats').style.display = 'block';
                        }
                        firstCard = null;
                    } else {
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
                }
            }

            createGameBoard();
        });

        export{GameScore,updateGameData,shuffleArray,createGameBoard,resetGame,startTimer,updateTimer,handleCardClick};
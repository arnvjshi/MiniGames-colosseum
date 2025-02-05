function updateGameData(GameScore,score) {
    localStorage.setItem('PatternMemoryQuiz', score);
}

let sequence = [];
        let playerSequence = [];
        let score = 0;
        let canClick = false;
        let timerInterval;
        let timeElapsed = 0;

        function startgame() {
            sequence = [];
            playerSequence = [];
            score = 0;
            timeElapsed = 0;
            document.getElementById('score').textContent = score||0;
            document.getElementById('timer').textContent = '0';
            document.getElementById('status').innerHTML = 'GET READY!<br>WATCH PATTERN';
            
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                timeElapsed++;
                document.getElementById('timer').textContent = timeElapsed;
            }, 1000);
            
            generateSequence();
        }

        function generateSequence() {
            const colors = ['red', 'blue', 'green', 'yellow'];
            sequence.push(colors[Math.floor(Math.random() * colors.length)]);
            canClick = false;
            playSequence();
        }

        async function playSequence() {
            document.getElementById('status').innerHTML = 'WATCH<br>CAREFULLY!';
            await sleep(1000);
            
            for (let color of sequence) {
                await highlightCard(color);
                await sleep(500);
            }
            
            document.getElementById('status').innerHTML = 'YOUR TURN!<br>REPEAT PATTERN';
            canClick = true;
            playerSequence = [];
        }

        function highlightCard(color) {
            return new Promise(resolve => {
                const card = document.querySelector(`[data-color="${color}"]`);
                card.classList.add('highlight');
                
                setTimeout(() => {
                    card.classList.remove('highlight');
                    resolve();
                }, 500);
            });
        }

        function makeGuess(color) {
            if (!canClick) return;
            
            highlightCard(color);
            playerSequence.push(color);
            
            if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
                gameOver();
                return;
            }
            
            if (playerSequence.length === sequence.length) {
                score++;
                document.getElementById('score').textContent = score;
                updateGameData('PatternMemoryGame',score*50);
                document.getElementById('status').innerHTML = 'PERFECT!<br>NEXT LEVEL';
                setTimeout(generateSequence, 1000);
            }
        }

        function gameOver() {
            clearInterval(timerInterval);
            document.getElementById('status').innerHTML = `GAME OVER!<br>SCORE: ${score}<br>TIME: ${timeElapsed}s`;
            canClick = false;
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        export{startgame};
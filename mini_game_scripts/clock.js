let hourHand = document.getElementById('hour-hand');
        let minuteHand = document.getElementById('minute-hand');
        let timeDisplay = document.getElementById('time-display');
        let questionText = document.getElementById('question');
        let message = document.getElementById('message');
        let scoreDisplay = document.getElementById('score-display');

        let hourAngle = 0;
        let minuteAngle = 0;
        let currentQuestion = 0;
        let score = 0;

        let questions = [
            { text: "What was the time on opening island?", answer: [4, 30] }, 
            { text: "The Guardians of the Galaxy are stuck in a time warp where time reverses by 13 minutes every 30 minutes. If it’s currently 3:44 PM, what time will they perceive after 4 hours?", answer: [6,0] }, 
            { text: "Loki, being mischievous, randomly turns back time by 37 minutes for every hour that passes. If it is currently 10:47 AM, what time will it be after 6 hours in Loki's reality?", answer: [1, 5] },
            { text: "Black Panther’s suit absorbs kinetic energy and stores it in a cycle: 5 min, 10 min, 15 min, 20 min, 25 min, … If he starts at 6:20 AM and completes the first 12 cycles, when does he finish?", answer: [11, 50] }, 
            { text: "Nick Fury sets a surveillance scan to repeat at prime-numbered minutes (2, 3, 5, 7, 11, 13…). If the first scan is at 12:17 PM, what time is the 15th scan?", answer: [5, 45] } 
        ];

        function updateTimeDisplay() {
            let hours = Math.floor(hourAngle / 30);
            let minutes = Math.floor(minuteAngle / 6);
            timeDisplay.textContent = `Time: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }

        function resetClock() {
            hourAngle = 0;
            minuteAngle = 0;
            rotateHand(hourHand, hourAngle);
            rotateHand(minuteHand, minuteAngle);
            updateTimeDisplay();
        }

        function checkCorrectTime() {
            let correctHour = questions[currentQuestion].answer[0];
            let correctMinute = questions[currentQuestion].answer[1];

            let currentHour = Math.floor(hourAngle / 30);
            let currentMinute = Math.floor(minuteAngle / 6);

            if (currentHour === correctHour && currentMinute === correctMinute) {
                message.textContent = "✅ Correct! Moving to the next question.";
                score += 100;
                // Update the score display
                scoreDisplay.textContent = `Score: ${score}`;
                currentQuestion++;

                if (currentQuestion < questions.length) {
                    setTimeout(() => {
                        message.textContent = "";
                        resetClock();
                        updateQuestion();
                    }, 1000);
                } else {
                    setTimeout(() => {
                        questionText.textContent = "🎉 Game Over! Final Score: " + score;
                        message.textContent = "";
                    }, 1000);
                }
            } else {
                message.textContent = "❌ Try again!";
            }
        }

        function updateQuestion() {
            questionText.textContent = questions[currentQuestion].text;
        }

        function rotateHand(hand, angle) {
            hand.style.transform = `rotate(${angle}deg)`;
        }

        function rotateHourHand() {
            hourAngle = (hourAngle + 30) % 360;
            rotateHand(hourHand, hourAngle);
            updateTimeDisplay();
            checkCorrectTime();
        }

        function rotateMinuteHand() {
            minuteAngle = (minuteAngle + 30) % 360;
            rotateHand(minuteHand, minuteAngle);
            updateTimeDisplay();
            checkCorrectTime();
        }

        hourHand.addEventListener('click', rotateHourHand);
        minuteHand.addEventListener('click', rotateMinuteHand);

        updateQuestion();
        updateTimeDisplay();
    
export{ updateTimeDisplay, resetClock, checkCorrectTime, updateQuestion, rotateHand, rotateHourHand, rotateMinuteHand };
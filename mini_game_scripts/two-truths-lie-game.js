const questions = [
    {
      options: [
        "Spider-Man's web shooters were mechanical in the comics",
        "The first Spider-Man comic was released in 1962",
        "Peter Parker worked at the Daily Planet newspaper"
      ],
      lieIndex: 2
    },
    {
      options: [
        "JavaScript was created in 10 days",
        "Python was named after the snake species",
        "The first computer bug was an actual moth"
      ],
      lieIndex: 1
    },
    {
      options: [
        "Thor's hammer Mjolnir is made of Uru metal",
        "Captain America's shield is pure vibranium",
        "The Infinity Gauntlet was forged in Wakanda"
      ],
      lieIndex: 2
    },
    {
      options: [
        "CSS was first proposed in 1994",
        "HTML6 is currently in development",
        "The first website is still online today"
      ],
      lieIndex: 1
    },
    {
      options: [
        "Tony Stark built the first Iron Man suit in a cave",
        "Bruce Banner became Hulk from gamma bomb testing",
        "Doctor Strange was a brain surgeon before becoming a sorcerer"
      ],
      lieIndex: 2
    },
    {
      options: [
        "Java was originally called Oak",
        "C++ was first called C with Objects",
        "Python was first released in 1995"
      ],
      lieIndex: 2
    },
    {
      options: [
        "Black Widow was originally a villain",
        "Hawkeye never missed a shot in the comics",
        "Nick Fury lost his eye to a Skrull attack"
      ],
      lieIndex: 1
    },
    {
      options: [
        "The first computer mouse was made of wood",
        "The first programming language was FORTRAN",
        "The first email was sent in 1975"
      ],
      lieIndex: 2
    },
    {
      options: [
        "Thanos is an Eternal-Deviant hybrid",
        "Groot's species can only say 'I am Groot'",
        "The Guardians of the Galaxy formed in the 1960s comics"
      ],
      lieIndex: 2
    },
    {
      options: [
        "Linux was initially called Freax",
        "The first computer virus was created in 1971",
        "WiFi stands for Wireless Fidelity"
      ],
      lieIndex: 2
    },
    {
      options: [
        "Doctor Doom was Reed Richards' college roommate",
        "The Silver Surfer was originally gold colored",
        "Magneto and Professor X were childhood friends"
      ],
      lieIndex: 1
    },
    {
      options: [
        "The first webcam was made to watch a coffee pot",
        "The term 'bug' was coined by Grace Hopper",
        "The first smartphone was released in 1999"
      ],
      lieIndex: 2
    },
    {
      options: [
        "Captain Marvel was originally male in the comics",
        "Wolverine's original costume was orange and brown",
        "Spider-Man's black suit was fan-designed"
      ],
      lieIndex: 1
    },
    {
      options: [
        "Git was created by Linus Torvalds",
        "JavaScript was created by Microsoft",
        "Ruby was created by a Japanese programmer"
      ],
      lieIndex: 1
    },
    {
      options: [
        "The Fantastic Four were Marvel's first superhero team",
        "Stan Lee created Batman",
        "Jack Kirby co-created Captain America"
      ],
      lieIndex: 1
    },
    {
      options: [
        "Ant-Man was a founding member of The Avengers in the comics",
        "Deadpool was originally a DC character",
        "The X-Men were created by Stan Lee and Jack Kirby"
      ],
      lieIndex: 1
    },
    {
      options: [
        "C was developed before Python",
        "Go was created by Google",
        "SQL stands for 'Sequential Query Language'"
      ],
      lieIndex: 2
    },
    {
      options: [
        "Loki is actually a Frost Giant by birth",
        "Black Panther's suit is made of Adamantium",
        "Doctor Strange trained in Kamar-Taj"
      ],
      lieIndex: 1
    },
    {
      options: [
        "The first website ever was created at CERN",
        "PHP stands for Personal Home Page",
        "C++ was developed by Dennis Ritchie"
      ],
      lieIndex: 2
    },
    {
      options: [
        "Vision was created using Tony Stark's AI, J.A.R.V.I.S.",
        "Scarlet Witch and Quicksilver were originally mutants in the comics",
        "Hulk's original color in the comics was green"
      ],
      lieIndex: 2
    },
    {
      options: [
        "The Python logo features a snake",
        "Swift is Apple's programming language",
        "Java was named after an Indonesian island"
      ],
      lieIndex: 2
    },
    {
      options: [
        "Marvel's Civil War storyline was about a superhero registration act",
        "Venom was originally a Spider-Man clone",
        "The Winter Soldier is Bucky Barnes"
      ],
      lieIndex: 1
    },
    {
      options: [
        "The Avengers first assembled in the comics in 1963",
        "Thor is actually a demigod in Marvel lore",
        "Captain America's shield was made by Howard Stark"
      ],
      lieIndex: 1
    },
    {
      options: [
        "The creator of C also helped create Unix",
        "JavaScript is the same as Java",
        "React was developed by Facebook"
      ],
      lieIndex: 1
    }
  ];
  
  
      let currentQuestions = [];
      let currentQuestionIndex = 0;
      let points = 0;
      let timer;
      let timeLeft;
  
      document.getElementById('startButton').addEventListener('click', startGame);
      document.getElementById('playAgainButton').addEventListener('click', startGame);
  
      function startGame() {
        points = 0;
        currentQuestionIndex = 0;
        currentQuestions = getRandomQuestions(10);
        
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('endScreen').classList.add('hidden');
        document.getElementById('gameScreen').classList.remove('hidden');
        
        updateUI();
        showQuestion();
      }
  
      function getRandomQuestions(num) {
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
      }
  
      function showQuestion() {
        if (currentQuestionIndex >= currentQuestions.length) {
          endGame();
          return;
        }
  
        const question = currentQuestions[currentQuestionIndex];
        const optionsContainer = document.getElementById('options');
        const optionElements = optionsContainer.children;
  
        for (let i = 0; i < optionElements.length; i++) {
          optionElements[i].textContent = question.options[i];
          optionElements[i].className = 'option p-4 rounded bg-gray-700 text-sm';
          optionElements[i].onclick = () => checkAnswer(i);
        }
  
        startTimer();
        updateUI();
      }
  
      function startTimer() {
        clearInterval(timer);
        timeLeft = 30;
        updateUI();
        
        timer = setInterval(() => {
          timeLeft--;
          updateUI();
          
          if (timeLeft <= 0) {
            clearInterval(timer);
            points -= 25;
            currentQuestionIndex++;
            showQuestion();
          }
        }, 1000);
      }
  
      function checkAnswer(selectedIndex) {
        clearInterval(timer);
        const question = currentQuestions[currentQuestionIndex];
        const optionsContainer = document.getElementById('options');
        
        // Disable all options
        Array.from(optionsContainer.children).forEach(option => {
          option.classList.add('disabled');
        });
  
        if (selectedIndex === question.lieIndex) {
          points += 50;
          optionsContainer.children[selectedIndex].classList.add('correct');
        } else {
          points -= 15;
          optionsContainer.children[selectedIndex].classList.add('wrong');
          optionsContainer.children[question.lieIndex].classList.add('correct');
        }
  
        setTimeout(() => {
          currentQuestionIndex++;
          showQuestion();
        }, 1500);
      }
  
      function updateUI() {
        document.getElementById('points').textContent = points;
        document.getElementById('timer').textContent = timeLeft;
        document.getElementById('questionCounter').textContent = currentQuestionIndex + 1;
      }
  
      function endGame() {
        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('endScreen').classList.remove('hidden');
        document.getElementById('finalScore').textContent = points;
        clearInterval(timer);
      }
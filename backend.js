const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const scoreboardPath = path.join(__dirname, 'scoreboard.json');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (index.html and minesweeper.html)
app.use(express.static(__dirname));  // Serve all files in the current directory

// Get scores for a specific game
app.get('/api/scores/:game', (req, res) => {
    const game = req.params.game;

    fs.readFile(scoreboardPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading scoreboard file.' });
        }

        const scoreboard = JSON.parse(data);

        if (!scoreboard.hasOwnProperty(game)) {
            return res.status(404).json({ message: 'Game not found in scoreboard.' });
        }

        res.json({ game, score: scoreboard[game] });
    });
});

// Update score for a specific game
app.post('/api/scores/:game', (req, res) => {
    const game = req.params.game;
    const { score } = req.body;

    if (typeof score !== 'number') {
        return res.status(400).json({ message: 'Invalid score data.' });
    }

    fs.readFile(scoreboardPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading scoreboard file.' });
        }

        const scoreboard = JSON.parse(data);

        if (!scoreboard.hasOwnProperty(game)) {
            return res.status(404).json({ message: 'Game not found in scoreboard.' });
        }

        // Update the score if the new score is higher
        if (score > scoreboard[game]) {
            scoreboard[game] = score;
        }

        fs.writeFile(scoreboardPath, JSON.stringify(scoreboard, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving score.' });
            }

            res.status(200).json({ message: 'Score updated successfully.' });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

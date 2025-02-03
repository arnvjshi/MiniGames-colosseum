const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const scoreboardPath = './scoreboard.json';

// Endpoint to get scores
app.get('/scores', (req, res) => {
    fs.readFile(scoreboardPath, (err, data) => {
        if (err) return res.status(500).send('Error reading scores');
        res.json(JSON.parse(data));
    });
});

// Endpoint to update scores
app.post('/scores', (req, res) => {
    const { game, points } = req.body;

    fs.readFile(scoreboardPath, (err, data) => {
        if (err) return res.status(500).send('Error reading scores');

        const scores = JSON.parse(data);
        if (scores[game] !== undefined) {
            scores[game] += points;
            fs.writeFile(scoreboardPath, JSON.stringify(scores, null, 2), err => {
                if (err) return res.status(500).send('Error updating scores');
                res.send('Scores updated');
            });
        } else {
            res.status(400).send('Invalid game');
        }
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

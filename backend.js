const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Path to the scoreboard JSON file
const SCOREBOARD_FILE = path.join(__dirname, 'scoreboard.json');

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API to fetch the scoreboard
app.get('/api/scoreboard', (req, res) => {
    fs.readFile(SCOREBOARD_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading scoreboard file:', err);
            return res.status(500).json({ error: 'Unable to read scoreboard' });
        }
        res.json(JSON.parse(data));
    });
});

// API to update the scoreboard
app.post('/api/scoreboard', (req, res) => {
    const { game, points } = req.body;

    if (!game || typeof points !== 'number') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    fs.readFile(SCOREBOARD_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading scoreboard file:', err);
            return res.status(500).json({ error: 'Unable to read scoreboard' });
        }

        const scoreboard = JSON.parse(data);

        if (scoreboard[game] === undefined) {
            return res.status(400).json({ error: 'Game not found in scoreboard' });
        }

        scoreboard[game] += points;

        fs.writeFile(SCOREBOARD_FILE, JSON.stringify(scoreboard, null, 2), (err) => {
            if (err) {
                console.error('Error writing to scoreboard file:', err);
                return res.status(500).json({ error: 'Unable to update scoreboard' });
            }
            res.json({ message: 'Score updated successfully', scoreboard });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

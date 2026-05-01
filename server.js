const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const app = express();
const PORT = 8080; // Replit's preferred port

// MIDDLEWARE - Must be before routes!
app.use(express.json()); 
app.use(express.static('public')); 
app.use(session({
    secret: 'tic-tac-toe-secret',
    resave: false,
    saveUninitialized: true
}));

// Define file paths
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const GAMES_FILE = path.join(__dirname, 'data', 'games.json'); // NEW: Added games path

// Helpers
const getUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');
const saveUsers = (users) => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

// ROUTES
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }
    users.push({ username, password }); // Plaintext per project rules
    saveUsers(users);
    res.json({ message: "Success! You can now log in." });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.username = user.username; // Saves session 
        return res.json({ message: "Welcome back!", username: user.username });
    }
    res.status(401).json({ message: "Invalid credentials" });
});

// NEW ROUTE: Save match data
app.post('/save-game', (req, res) => {
    const newMatch = req.body; // Gets { mode, winner, time } from board.js

    // 1. Read the current games.json from the data folder
    fs.readFile(GAMES_FILE, 'utf8', (err, data) => {
        let games = [];
        if (!err && data) {
            try {
                games = JSON.parse(data);
            } catch (e) {
                console.log("Empty or invalid JSON, starting fresh.");
            }
        }

        // 2. Add the new match to the array
        games.push(newMatch);

        // 3. Write it back to the file
        fs.writeFile(GAMES_FILE, JSON.stringify(games, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to save game' });
            }
            res.json({ message: 'Match saved successfully!' });
        });
    });
});

// NEW ROUTE: Send match data to the leaderboard
app.get('/get-games', (req, res) => {
    fs.readFile(GAMES_FILE, 'utf8', (err, data) => {
        if (err || !data) {
            // If the file doesn't exist or is empty, just send an empty array
            return res.json([]); 
        }
        try {
            const games = JSON.parse(data);
            res.json(games);
        } catch (e) {
            res.json([]);
        }
    });
});

app.listen(PORT, () => console.log(`Server active on port ${PORT}`));
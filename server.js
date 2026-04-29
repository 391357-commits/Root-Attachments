
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

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

const USERS_FILE = path.join(__dirname, 'data', 'users.json');

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
    users.push({ username, password }); // Plaintext per project rules [cite: 67]
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

app.listen(PORT, () => console.log(`Server active on port ${PORT}`));
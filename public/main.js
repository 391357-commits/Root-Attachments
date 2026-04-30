// ==========================================
// 0. AUTH / GAME CONTROL HANDLERS (used by index.html buttons)
// ==========================================
async function auth(action) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter a username and password.');
        return;
    }

    try {
        const response = await fetch('/' + action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            if (action === 'login') {
                window.location.href = 'main.html';
            } else {
                alert(data.message);
            }
        } else {
            alert(data.message || 'Something went wrong.');
        }
    } catch (err) {
        alert('Network error: ' + err.message);
    }
}

function startGame() {
    const area = document.getElementById('game-area');
    if (area) area.style.display = 'block';
}

function logout() {
    const controls = document.getElementById('game-controls');
    const authBox = document.getElementById('auth-box');
    if (controls) controls.style.display = 'none';
    if (authBox) authBox.style.display = 'block';
    const userInput = document.getElementById('username');
    const passInput = document.getElementById('password');
    if (userInput) userInput.value = '';
    if (passInput) passInput.value = '';
}

// ==========================================
// 1. LOGIN & REGISTRATION LOGIC
// ==========================================
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        alert(data.message);
    });
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Logged in successfully!");
            // Send user to the setup page after login
            window.location.href = 'main.html';
        } else {
            alert(data.message);
        }
    });
}

// ==========================================
// 2. GAME SETUP LOGIC (The Start Button)
// ==========================================
const startButton = document.getElementById('start-game-btn');
const gameModeSelect = document.getElementById('game-mode');
const aiSettings = document.getElementById('ai-settings');
const pvpSettings = document.getElementById('pvp-settings');
const difficultySelect = document.getElementById('ai-difficulty');
const personalitySelect = document.getElementById('ai-personality');

// Only run this if we are on the Game Setup page
if (startButton) {
    // Toggle AI and PvP settings visibility
    gameModeSelect.addEventListener('change', () => {
        const p2Input = document.getElementById('p2-name');
        if (gameModeSelect.value === 'bot') {
            aiSettings.style.display = 'block';
            if (p2Input) p2Input.parentElement.style.display = 'none'; // Hide P2 name input
        } else {
            aiSettings.style.display = 'none';
            if (p2Input) p2Input.parentElement.style.display = 'block'; // Show P2 name input
        }
    });

    // Handle the Start Match Click
    startButton.addEventListener('click', () => {
        const mode = gameModeSelect.value;

        // Grab the piece choice
        const pieceDropdown = document.getElementById('piece-select');
        const pieceChoice = pieceDropdown ? pieceDropdown.value : 'classic'; 

        // Grab the custom names!
        const p1Input = document.getElementById('p1-name');
        const p2Input = document.getElementById('p2-name');

        const p1Name = p1Input ? p1Input.value : 'Player 1';
        let p2Name = p2Input ? p2Input.value : 'Player 2';

        // Start building the URL with the mode, piece, AND Player 1's name
        let nextUrl = `game2.html?mode=${mode}&piece=${pieceChoice}&p1=${encodeURIComponent(p1Name)}`;

        // If they picked bot, add the bot settings and force P2 to be "Bot"
        if (mode === 'bot') {
            const difficulty = difficultySelect ? difficultySelect.value : 'easy';
            const personality = personalitySelect ? personalitySelect.value : 'friendly';
            nextUrl += `&difficulty=${difficulty}&personality=${personality}&p2=Bot`;
        } else {
            // If it's PvP, use the custom Player 2 name
            nextUrl += `&p2=${encodeURIComponent(p2Name)}`;
        }

        window.location.href = nextUrl;
    });
}
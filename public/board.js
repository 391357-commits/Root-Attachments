// 1. Read the URL for mode, piece choice, AND names
const urlParams = new URLSearchParams(window.location.search);
const isBotMode = urlParams.get('mode') === 'bot';
const pieceStyle = urlParams.get('piece') || 'classic'; 
const player1Name = urlParams.get('p1') || 'Player 1';
const player2Name = urlParams.get('p2') || 'Player 2';

// 2. Set the symbols based on what the user picked
let player1Symbol = 'X';
let player2Symbol = 'O';

if (pieceStyle === 'shapes') {
    player1Symbol = '🟦';
    player2Symbol = '🔺';
} else if (pieceStyle === 'emojis') {
    player1Symbol = '🌮';
    player2Symbol = '🍔';
}

// 3. Game State
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = player1Symbol; // Start with Player 1's symbol
let gameActive = true;

const cells = document.querySelectorAll('.cell');
const turnIndicator = document.getElementById('turn-indicator');
const resetBtn = document.getElementById('reset-btn');

// Immediately update the text with the starting player's name
turnIndicator.innerText = `${player1Name}'s Turn (${player1Symbol})`;

// 4. Handle a cell click
function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || !gameActive) return;

    // Human takes their turn
    playTurn(index, cell);

    // If bot mode, the bot takes its turn
    if (isBotMode && gameActive && currentPlayer === player2Symbol) {
        gameActive = false; 
        turnIndicator.innerText = `${player2Name} is thinking...`;
        setTimeout(makeBotMove, 500);
    }
}

// 5. The Logic to place a mark
function playTurn(index, cell) {
    board[index] = currentPlayer;
    cell.innerText = currentPlayer;

    // Keep CSS colors (Player 1 gets 'x' class, Player 2 gets 'o' class)
    const cssClass = currentPlayer === player1Symbol ? 'x' : 'o';
    cell.classList.add(cssClass);

    // Figure out whose name goes with the current symbol
    const currentName = currentPlayer === player1Symbol ? player1Name : player2Name;

    if (checkWinner()) {
        turnIndicator.innerText = `🎉 ${currentName} Wins! 🎉`;
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        turnIndicator.innerText = "It's a Draw!";
        gameActive = false;
        return;
    }

    // Switch turns between custom symbols
    currentPlayer = currentPlayer === player1Symbol ? player2Symbol : player1Symbol;

    // Figure out who is up next
    const nextName = currentPlayer === player1Symbol ? player1Name : player2Name;

    if (currentPlayer === player1Symbol || !isBotMode) {
        turnIndicator.innerText = `${nextName}'s Turn (${currentPlayer})`;
    }
}

// 6. The Bot's Brain
function makeBotMove() {
    const emptySpots = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') emptySpots.push(i);
    }

    if (emptySpots.length > 0) {
        const randomIndex = emptySpots[Math.floor(Math.random() * emptySpots.length)];
        const targetCell = document.querySelector(`[data-index="${randomIndex}"]`);

        gameActive = true; 
        playTurn(randomIndex, targetCell);
    }
}

// 7. Win Checking Logic
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

// 8. Attach Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

resetBtn.addEventListener('click', () => {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = player1Symbol;
    gameActive = true;
    turnIndicator.innerText = `${player1Name}'s Turn (${player1Symbol})`; // Reset uses P1 name
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('x', 'o'); // Remove colors on reset
    });
});
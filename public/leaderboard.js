// leaderboard.js

async function loadLeaderboard() {
    const tableBody = document.getElementById('leaderboard-body');

    try {
        // Ask the server for the game data
        const response = await fetch('/get-games');
        const games = await response.json();

        // Clear out any loading text
        tableBody.innerHTML = '';

        if (games.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 15px;">No games played yet!</td></tr>`;
            return;
        }

       
        // Loop through the games backwards (so the newest games show up at the top)
        for (let i = games.length - 1; i >= 0; i--) {
            const game = games[i];

            const row = document.createElement('tr');
            row.style.borderBottom = "1px solid #475569";

            // NEW: Fallback for older games already in your database
            const matchup = game.players ? game.players : "Unknown";

            // UPDATED: Added the matchup <td> with your 10px padding
            row.innerHTML = `
                <td style="padding: 10px;">${game.mode}</td>
                <td style="padding: 10px;">${matchup}</td>
                <td style="padding: 10px; font-weight: bold; color: #38bdf8;">${game.winner}</td>
                <td style="padding: 10px; font-size: 0.85rem; color: #94a3b8;">${game.time}</td>
            `;

            tableBody.appendChild(row);
        }

    } catch (err) {
        console.error("Failed to load leaderboard:", err);
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #ef4444;">Error loading data.</td></tr>`;
    }
}

// Run the function immediately when the page loads
loadLeaderboard();
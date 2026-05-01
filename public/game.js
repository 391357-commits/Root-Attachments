// 1. Grab the elements from your HTML so we can control them
const modeSelect = document.getElementById("game-mode");
const aiSettings = document.getElementById("ai-settings");
const startBtn = document.getElementById("start-game-btn");

// 2. Listen for when the user changes the dropdown menu
modeSelect.addEventListener("change", (e) => {
    // If they pick 'bot', show the extra settings. Otherwise, hide them.
    if (e.target.value === "bot") {
        aiSettings.style.display = "block";
    } else {
        aiSettings.style.display = "none";
    }
});

// 3. Listen for when the user clicks the "Start Match" button
startBtn.addEventListener("click", () => {
    // Find out what mode they selected
    const mode = modeSelect.value;

    // Start building the link to the next page
    let targetUrl = `/game2.html?mode=${mode}`;

    // If they picked bot, add the difficulty and personality to the link
    if (mode === "bot") {
        const difficulty = document.getElementById("ai-difficulty").value;
        const personality = document.getElementById("ai-personality").value;
        targetUrl += `&diff=${difficulty}&persona=${personality}`;
    }

    // This is the line that actually forces the browser to change pages!
    window.location.href = targetUrl;
});

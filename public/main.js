// Registration Logic
document.getElementById('register-form').addEventListener('submit', async (e) => {
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

// Login Logic
document.getElementById('login-form').addEventListener('submit', async (e) => {
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
        // You can redirect or show the game board here
    } else {
        alert(data.message);
    }
});
async function auth(type) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok && type === 'login') {
        document.getElementById('auth-box').style.display = 'none';
        document.getElementById('game-controls').style.display = 'block';
        document.getElementById('display-user').innerText = data.username;
    }
}
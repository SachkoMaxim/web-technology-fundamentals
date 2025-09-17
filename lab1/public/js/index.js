document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const room = document.getElementById('room').value;
    window.location.href = `chat.html?username=${username}&room=${room}`;
});

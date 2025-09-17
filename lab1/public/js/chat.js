const parseParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const room = urlParams.get('room');
    return { username, room };
};

const { username, room } = parseParams();

document.getElementById('room-info').querySelector('em').innerText = room;
document.getElementById('user-info').querySelector('em').innerText = username;

const outputMessage = (message) => {
    const div = document.createElement('div');
    div.id = message.msg_id;
    if (message.user === username) {
        div.id = `your-${message.msg_id}`;
    }
    div.innerHTML = `<p><strong>${message.user}</strong> <span>${message.time}</span></p><p>${message.text}</p>`;
    document.getElementById('messages').appendChild(div);
};

const socket = io();

socket.emit('joinRoom', { username, room });

socket.on('message', message => {
    outputMessage(message);
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});

socket.on('roomUsers', ({ users }) => {
    document.getElementById('users').innerHTML = users.map(user => `<li>${user.username}</li>`).join('');
});

document.getElementById('form-msg').addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('msg-input').value;
    socket.emit('chatMessage', msg);
    document.getElementById('msg-input').value = '';
});   

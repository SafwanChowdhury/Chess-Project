const socket = new WebSocket('ws://192.168.1.88:8080');

const lobbyList = document.getElementById('lobby-list');
const createLobbyButton = document.getElementById('create-lobby');
const refreshButton = document.getElementById('refresh');

lobbyList.addEventListener('click', function(event) {
    const target = event.target;
    if (target.classList.contains('join-btn')) {
        const room = target.parentElement.getAttribute('data-room');
        joinRoom(room);
    }
});

createLobbyButton.addEventListener('click', function() {
    const lobbyName = `Lobby ${lobbyList.childElementCount + 1}`;
    const message = {
        type: 'create',
        roomName: lobbyName
    };
    socket.send(JSON.stringify(message));
    addLobby(lobbyName);
});

refreshButton.addEventListener('click', function() {
    const message = {
        type: 'refresh'
    };
    socket.send(JSON.stringify(message));
});

socket.addEventListener('message', function(event) {
    const message = JSON.parse(event.data);
    if (message.type === 'roomList') {
        updateLobbyList(message.rooms);
    }
});

function joinRoom(room) {
    const message = {
        type: 'join',
        room: room
    };
    socket.send(JSON.stringify(message));
    // Navigate to game.html with the room ID as a URL parameter
    window.location.href = `game.html?roomId=${encodeURIComponent(room)}`;
}


function addLobby(lobbyName, players = 0) {
    const listItem = document.createElement('li');
    listItem.setAttribute('data-room', lobbyName);
    listItem.classList.add('lobby-item');
    listItem.innerHTML = `
        <div class="lobby-details">
            <h2>${lobbyName}</h2>
            <span class="players">${players} players</span>
        </div>
        <button class="join-btn">Join</button>
    `;
    lobbyList.appendChild(listItem);
}


function updateLobbyList(rooms) {
    lobbyList.innerHTML = '';
    rooms.forEach(room => {
        addLobby(room.name, room.players);
    });
}

const socket = new WebSocket('ws://192.168.1.88:8080');

const lobbyList = document.getElementById('lobby-list');
const createLobbyButton = document.getElementById('create-lobby');
const refreshButton = document.getElementById('refresh');

// Function to send a refresh message to the server and update the lobby list every few seconds
function autoRefresh() {
    const message = {
        type: 'refresh'
    };
    socket.send(JSON.stringify(message));
}

// Call autoRefresh() when the page loads
window.addEventListener('load', function() {
    autoRefresh();
    setInterval(autoRefresh, 5000); // Refresh every 5 seconds
});

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
    autoRefresh(); // Call autoRefresh() when the refresh button is clicked
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
    sessionStorage.setItem('roomId', room);
    // Navigate to game.html with the room ID as a URL parameter
    window.location.href = `game.html`;
}

function addLobby(lobbyName, players = 0) {
    const listItem = document.createElement('li');
    listItem.setAttribute('data-room', lobbyName);
    listItem.classList.add('lobby-item');
    const joinButton = document.createElement('button');
    joinButton.classList.add('join-btn');
    joinButton.innerText = 'Join';
    if (players >= 2) {
        joinButton.style.display = 'none';
    }
    joinButton.addEventListener('click', function(event) {
        joinRoom(lobbyName);
    });
    listItem.innerHTML = `
        <div class="lobby-details">
            <h2>${lobbyName}</h2>
            <span class="players">${players} players</span>
        </div>
    `;
    listItem.appendChild(joinButton);
    lobbyList.appendChild(listItem);
}

function updateLobbyList(rooms) {
    lobbyList.innerHTML = '';
    rooms.forEach(room => {
        addLobby(room.name, room.players);
    });
}

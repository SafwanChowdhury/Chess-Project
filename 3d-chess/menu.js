import socket from './socket.js';

const burger = document.getElementById("burger");
const menu = document.getElementById("menu");


burger.addEventListener("click", () => {
    menu.classList.toggle("active");
    document.getElementById("menu-glow").style.opacity = menu.classList[1] == 'active' ? 1 : 0;

});

const lobbiesButton = document.querySelector('a[href="#"]');
lobbiesButton.addEventListener('click', toggleLobbiesWindow);

function createLobbiesWindow() {
    const lobbiesWindow = document.createElement('div');
    lobbiesWindow.id = 'lobbies-window';
    lobbiesWindow.style.position = 'fixed';
    lobbiesWindow.style.top = '50%';
    lobbiesWindow.style.left = '50%';
    lobbiesWindow.style.transform = 'translate(-50%, -50%)';
    lobbiesWindow.style.backgroundColor = 'rgba(28, 42, 58, 0.75)';
    lobbiesWindow.style.width = '700px';
    lobbiesWindow.style.height = '600px';
    lobbiesWindow.style.borderRadius = '10px';
    lobbiesWindow.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    lobbiesWindow.style.padding = '20px';
    lobbiesWindow.style.display = 'flex';
    lobbiesWindow.style.flexDirection = 'column';

    const lobbyHeader = document.createElement('h2');
    lobbyHeader.textContent = 'Select a Lobby';
    lobbyHeader.style.color = '#f1c453';
    lobbyHeader.style.marginBottom = '20px';
    lobbiesWindow.appendChild(lobbyHeader);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.marginBottom = '20px';
    lobbiesWindow.appendChild(buttonContainer);

    const createLobbyButton = document.createElement('button');
    createLobbyButton.id = 'create-lobby';
    createLobbyButton.textContent = 'Create Lobby';
    createLobbyButton.className = 'cta-btn';
    buttonContainer.appendChild(createLobbyButton);

    const refreshButton = document.createElement('button');
    refreshButton.id = 'refresh';
    refreshButton.textContent = 'Refresh';
    refreshButton.className = 'cta-btn';
    buttonContainer.appendChild(refreshButton);

    lobbyList = document.createElement('ul');
    lobbyList.className = 'lobby-list';
    lobbyList.id = 'lobby-list';
    lobbyList.style.overflowY = 'scroll';
    lobbyList.style.flexGrow = '1';
    lobbiesWindow.appendChild(lobbyList);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.className = 'close-button';
    closeButton.addEventListener('click', toggleLobbiesWindow);
    lobbiesWindow.appendChild(closeButton);

    document.body.appendChild(lobbiesWindow);

    createLobbyButton.addEventListener('click', function() {
        const lobbyName = `Lobby ${lobbyList.childElementCount + 1}`;
        const message = {
            type: 'create',
            roomName: lobbyName
        };
        socket.send(JSON.stringify(message));
        addLobby(lobbyName); // Pass lobbyList as a parameter
    });

    refreshButton.addEventListener('click', function() {
        autoRefresh(); // Call autoRefresh() when the refresh button is clicked
    });

    socket.addEventListener('message', function(event) {
        const message = JSON.parse(event.data);
        if (message.type === 'roomList') {
            updateLobbyList(message.rooms); // Pass lobbyList as a parameter
        }
    });

    lobbyList.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('join-btn')) {
            const room = target.parentElement.getAttribute('data-room');
            joinRoom(room);
        }
    });
    autoRefresh()
    return lobbyList
}

let lobbyList;

function toggleLobbiesWindow() {
    const lobbiesWindow = document.getElementById('lobbies-window');
    if (!lobbiesWindow) {
        lobbyList = createLobbiesWindow();
    } else {
        lobbiesWindow.remove();
    }
}

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



socket.addEventListener('message', function(event) {
    const message = JSON.parse(event.data);
    if (message.type === 'roomList') {
        updateLobbyList(message.rooms);
    }
});

function joinRoom(room) {
    const lobbiesWindow = document.getElementById('lobbies-window');
    const message = {
        type: 'join',
        room: room
    };
    lobbiesWindow.remove();
    menu.classList.toggle("active");
    socket.send(JSON.stringify(message));
    sessionStorage.setItem('roomId', room);
    // Dispatch the custom 'joinGame' event when the 'join-btn' is pressed
    const joinGameEvent = new CustomEvent('joinGame');
    document.dispatchEvent(joinGameEvent);
}

function addLobby(lobbyName, players = 0) {
    const lobbyList = document.getElementById('lobby-list');
    const listItem = document.createElement('li');
    listItem.setAttribute('data-room', lobbyName);
    listItem.classList.add('lobby-item');
    const joinButton = document.createElement('button');
    joinButton.classList.add('join-btn');
    joinButton.innerText = 'Join';
    if (players >= 2) {
        joinButton.style.display = 'none';
    }
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
    const lobbyList = document.getElementById('lobby-list');
    if (lobbyList) {
        // Remove all lobby items from the list
        while (lobbyList.firstChild) {
            lobbyList.removeChild(lobbyList.firstChild);
        }
        if (Array.isArray(rooms)) {
            rooms.forEach(room => {
                addLobby(room.name, room.players);
            });
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    menu.classList.toggle("active");
    document.getElementById("menu-glow").style.opacity = 1;
    toggleLobbiesWindow();
});


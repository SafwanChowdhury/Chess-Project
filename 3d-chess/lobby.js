import socket from "./socket.js";

const lobbiesButton = document.querySelector('a[href="#"]');
lobbiesButton.addEventListener('click', toggleLobbiesWindow);

function createLobbiesWindow() {
    const lobbiesWindow = document.createElement('div');
    lobbiesWindow.id = 'lobbies-window';
    lobbiesWindow.classList.add('lobbies-window');

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

    const lobbyList = document.createElement('ul');
    lobbyList.className = 'lobby-list';
    lobbyList.id = 'lobby-list';
    lobbyList.style.maxHeight = '500px'; // Set the max-heiht property
    lobbyList.style.overflowY = 'scroll'; // Set the overflow-y property
    lobbyList.style.flexGrow = '1';
    lobbyList.style.scrollbarWidth = 'thin';
    lobbyList.style.scrollbarColor = '#F7C948 #021D3B';
    lobbyList.style.scrollbarTrackColor = '#021D3B';
    lobbyList.style.scrollbarFaceColor = '#F7C948';

    lobbiesWindow.appendChild(lobbyList);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.className = 'close-button';
    closeButton.addEventListener('click', toggleLobbiesWindow);
    lobbiesWindow.appendChild(closeButton);

    document.body.appendChild(lobbiesWindow);

    createLobbyButton.addEventListener('click', function () {
        const lobbyName = `Lobby ${lobbyList.childElementCount + 1}`;
        const message = {
            type: 'create',
            roomName: lobbyName
        };
        socket.send(JSON.stringify(message));
        addLobby(lobbyName); // Pass lobbyList as a parameter
    });

    refreshButton.addEventListener('click', function () {
        autoRefresh(); // Call autoRefresh() when the refresh button is clicked
    });

    socket.addEventListener('message', function (event) {
        const message = JSON.parse(event.data);
        if (message.type === 'roomList') {
            updateLobbyList(message.rooms); // Pass lobbyList as a parameter
        }
    });

    lobbyList.addEventListener('click', function (event) {
        const target = event.target;
        if (target.classList.contains('join-btn')) {
            const room = target.parentElement.getAttribute('data-room');
            joinRoom(room);
        }
    });

    lobbyList.addEventListener('click', function(event) {
        const target = event.target;
        const message = {
            type: 'delete',
            room: target.parentElement.getAttribute('data-room')
        };
        socket.send(JSON.stringify(message));
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


let clientID = null

socket.addEventListener('message', function(event) {
    const message = JSON.parse(event.data);
    switch (message.type) {
        case 'clientIndex':
            clientID = message.index
        case 'roomList':
            updateLobbyList(message.rooms);
    }
});

function joinRoom(room) {
    const lobbiesWindow = document.getElementById('lobbies-window');
    let message = {
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
    if (players >= 2 || clientID == 0) {
        joinButton.style.display = 'none';
    }
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.innerText = 'Delete';
    listItem.innerHTML = `
        <div class="lobby-details">
            <h2>${lobbyName}</h2>
            <span class="players">${players} players</span>
        </div>
    `;
    listItem.appendChild(joinButton);
    if (clientID == 0) {
        listItem.appendChild(deleteButton);
    }
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



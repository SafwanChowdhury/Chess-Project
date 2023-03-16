const socket = new WebSocket('ws://localhost:8080');

const lobbyList = document.getElementById('lobby-list');

lobbyList.addEventListener('click', function(event) {
    const target = event.target;
    if (target.tagName === 'LI') {
        const room = target.getAttribute('data-room');
        joinRoom(room);
    }
});

function joinRoom(room) {
    const message = {
        type: 'join',
        room: room
    };
    socket.send(JSON.stringify(message));
}
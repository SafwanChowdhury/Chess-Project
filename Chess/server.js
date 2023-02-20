
let socket = new WebSocket("ws://localhost:5173")

socket.onopen = function(e) {
    console.log("connected")
};


socket.onclose = function(event) {
    console.log("closed")
};

socket.onerror = function(error) {
    console.log("crashed")
};
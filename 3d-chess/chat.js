const chatTab = document.getElementById('chat-tab');
const chatBox = document.getElementById('chat-box');
const sendMessage = document.getElementById('send-message');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');

chatTab.addEventListener('click', () => {
    // Toggle the show-chat-box class
    chatBox.classList.toggle('show-chat-box');
});

sendMessage.addEventListener('click', () => {
    sendChatMessage();
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});

function sendChatMessage() {
    const messageText = messageInput.value.trim();

    if (messageText) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');

        const timestamp = new Date();
        const formattedTimestamp = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageElement.innerHTML = `<span>${messageText}</span><span class="chat-timestamp">(${formattedTimestamp})</span>`;
        chatMessages.appendChild(messageElement);

        // Scroll to the latest message
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Clear the input field
        messageInput.value = '';
    }
}


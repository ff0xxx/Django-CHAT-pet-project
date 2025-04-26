import { addMessageToChatLog } from './chat_ui.js'

// еще проблема в consumer была, 
// не только в том что этот жс не умеет переподключаться
let chatSocket = null;

connectWebSocket();

function connectWebSocket() {
    const groupUUID = document.querySelector('nav h2').dataset.groupUuid

    if (chatSocket != null) {
        chatSocket.onclose = null;  // Убираем старый onclose
        chatSocket.onerror = null;  // Убираем старый onerror
        chatSocket.close();         // Закрываем соединение
    }

    chatSocket = new WebSocket(
        'ws://' + window.location.host + '/ws/chat/' + groupUUID + '/'
    );

    chatSocket.onclose = function(e) {
        if (e.code == 1000) {
            console.log("Chat socket closed normally. Reconnecting...")
        } else {
            console.error(`Chat socket closed with code: ${e.code}. Reason: ${e.reason}. Reconnecting...`);
        }
        setTimeout(connectWebSocket, 2000);
    };

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data)
        const message = data['message']
        if (message == '') {return}
        
        const sender = data['sender']
        addMessageToChatLog(message, sender);
        // ??? fucking scrolling
        // https://ru.stackoverflow.com/questions/628058/javascript-%D0%9F%D1%80%D0%BE%D0%BA%D1%80%D1%83%D1%82%D0%B8%D1%82%D1%8C-%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%83-%D0%B2%D0%BD%D0%B8%D0%B7
    }
}

// Переподключаемся при изменении URL (если SPA)
window.addEventListener('popstate', connectWebSocket);


const messageInputDom = document.querySelector('#chat-message-input');
const messageSubmitDom = document.querySelector('#chat-message-submit'); 

messageSubmitDom.onclick = function(e) {
    sendMessage();
};
messageInputDom.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Предотвращаем стандартное поведение Enter (перенос строки)
        sendMessage();
    }
})

function sendMessage() {
    const message = messageInputDom.value.trim();
    // FIXME: ЭТО ЧТО Ж БЛЯТЬ ПОЛУЧАЕТСЯ
    // ЦИКЛИЧЕСКИЙ ИМПОРТ, СУКА?
    chatSocket.send(JSON.stringify({
        'message': message
    }));
    messageInputDom.value = '';
}
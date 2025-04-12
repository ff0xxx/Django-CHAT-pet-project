const roomName = document.querySelector('nav h2').dataset.roomName
const chatSocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/chat/' + roomName + '/'
);

chatSocket.onclose = function(e) {
    console.error("Chat socket closed unexpectedly")
}


chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data)
    const message = data['message']
    if (message == '') {return}
    const formattedMessage = escapeHTML(message).replace(/\n/g, '<br>');
    
    addMessageToChatLog(formattedMessage);
    
    const chatLog = document.querySelector('#chat-log')
    // ??? fucking scrolling
    // https://ru.stackoverflow.com/questions/628058/javascript-%D0%9F%D1%80%D0%BE%D0%BA%D1%80%D1%83%D1%82%D0%B8%D1%82%D1%8C-%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%83-%D0%B2%D0%BD%D0%B8%D0%B7
}

function addMessageToChatLog(formattedMessage) {
    const chatLog = document.querySelector('#chat-log');

    const rowDiv = document.createElement('div');
    rowDiv.className = 'row no-gutters';

    const colDiv = document.createElement('div');
    colDiv.className = 'col-md-3 offset-md-9';

    const chatBubbleDiv = document.createElement('div');
    chatBubbleDiv.className = 'chat-bubble chat-bubble--right';
    chatBubbleDiv.innerHTML = formattedMessage;

    const br = document.createElement('br');

    // Собираем элементы вместе
    colDiv.appendChild(chatBubbleDiv);
    rowDiv.appendChild(colDiv);

    // Добавляем сообщение в chatLog
    chatLog.appendChild(rowDiv);
    chatLog.appendChild(br);
}

function escapeHTML(str) {
    if (typeof str !== 'string') {
      return str;
    }
  
    return str.replace(/[&<>"']/g, function(m) {
      switch (m) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case "'":
          return '&#39;'; // или &apos; (не все браузеры поддерживают)
        default:
          return m;
      }
    });
}


const messageInputDom = document.querySelector('#chat-message-input');
const messageSubmitDom = document.querySelector('#chat-message-submit'); 

function sendMessage() {
    const message = messageInputDom.value.trim();
    chatSocket.send(JSON.stringify({
        'message': message
    }));
    messageInputDom.value = '';
}

messageSubmitDom.onclick = function(e) {
    sendMessage();
};
messageInputDom.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Предотвращаем стандартное поведение Enter (перенос строки) [временно]
        sendMessage();
    }
})
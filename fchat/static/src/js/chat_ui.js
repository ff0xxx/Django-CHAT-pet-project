export function addMessageToChatLog(message, sender) {
    const formattedMessage = escapeHTML(message).replace(/\n/g, '<br>');
    const currentUser = document.querySelector('#chat-message-submit').dataset.username
    const chatLog = document.querySelector('#chat-log');

    const chatBubbleDiv = document.createElement('div');
    if (currentUser == sender) {
        chatBubbleDiv.className = 'chat-bubble chat-bubble--right';
    } else {
        chatBubbleDiv.className = 'chat-bubble chat-bubble--left';
    }
    chatBubbleDiv.innerHTML = formattedMessage;

    const br = document.createElement('br');

    // Добавляем сообщение в chatLog
    chatLog.appendChild(chatBubbleDiv);
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
        // case "'":
        //   return '&#39;'; // не дружит с браузером ff
        default:
          return m;
      }
    });
}

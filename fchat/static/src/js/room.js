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
        const formattedMessage = escapeHTML(message).replace(/\n/g, '<br>');
        
        const sender = data['sender']
        addMessageToChatLog(formattedMessage, sender);
        // ??? fucking scrolling
        // https://ru.stackoverflow.com/questions/628058/javascript-%D0%9F%D1%80%D0%BE%D0%BA%D1%80%D1%83%D1%82%D0%B8%D1%82%D1%8C-%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%83-%D0%B2%D0%BD%D0%B8%D0%B7
    }
}

// Переподключаемся при изменении URL (если SPA)
window.addEventListener('popstate', connectWebSocket);


function addMessageToChatLog(formattedMessage, sender) {
    const currentUser = document.querySelector('#chat-message-submit').dataset.username
    const chatLog = document.querySelector('#chat-log');

    const chatBubbleDiv = document.createElement('div');
    if (currentUser == sender) {
        chatBubbleDiv.className = 'chat-bubble chat-bubble--right';
    } else {
        chatBubbleDiv.className = 'chat-bubble chat-bubble--left';
        // надо поразбираться со стилями для лева бля
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
        case "'":
          return '&#39;'; // или &apos; (не все браузеры поддерживают)
        default:
          return m;
      }
    });
}


const messageInputDom = document.querySelector('#chat-message-input');
const messageSubmitDom = document.querySelector('#chat-message-submit'); 

messageSubmitDom.onclick = function(e) {
    sendMessage();
};
messageInputDom.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Предотвращаем стандартное поведение Enter (перенос строки) [временно]
        sendMessage();
    }
})

function sendMessage() {
    const message = messageInputDom.value.trim();
    chatSocket.send(JSON.stringify({
        'message': message
    }));
    messageInputDom.value = '';
}

// ------------------------------------------------------------------------group add

// group uuid validate
const inputElement = document.querySelector('#groupInput')
inputElement.addEventListener('input', (e) => {
    const errorElement = document.querySelector('#groupInputError');
    const value = inputElement.value
    const allowedChars = /^[a-zA-Z0-9-]*$/

    // if (inputElement.value.length > 28) { 
    //     inputElement.style.borderColor = "red";
    //     inputElement.value = value.slice(0, 28); 
    //     errorElement.textContent = "Too many symbols!"
    //     errorElement.style.display = "block"
    // } else 
    if (!allowedChars.test(value)) {
        inputElement.value = value.slice(0, value.length - 1)
        errorElement.textContent = "Only a-z, A-Z, 0-9 and -!"
        errorElement.style.display = "block"
    } else if (!inputElement.value) {
        errorElement.textContent = "Please enter a group UUID!"
        errorElement.style.display = "block"
    } else {
        inputElement.style.borderColor ="";
        errorElement.textContent = ":)"
        errorElement.style.display = "none"
    }
})


document.getElementById('joinButton').addEventListener('click', joinRoom);
// еще как в один путь логина отлавливать ?next=... ?
// AJAX-запрос для значения uuid group при добавлении в группу
async function joinRoom() {
    try {
        // Проверка наличия элементов DOM
        // const csrfTokenInput = document.querySelector("input[name='csrfmiddlewaretoken']");
        // if (!csrfTokenInput) throw new Error("CSRF token not found");
        
        const groupInput = document.getElementById('groupInput');
        if (!groupInput) throw new Error("Group input not found");

        // const csrfToken = csrfTokenInput.value;
        const groupUUID = groupInput.value.trim();
        if (!groupUUID) throw new Error("Enter group UUID");

        // Отправка в формате JSON
        const response = await fetch('/chat/add/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector("[name=csrfmiddlewaretoken]")?.value || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uuid: groupUUID }),
        });

        // ??? Обработка HTTP ошибок
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        alert(data.message);
        
        if (data.redirect_url) {
            window.location.href = data.redirect_url;
        }
    } catch (error) {
        console.error('JoinRoom error:', error);
        alert(`Error: ${error.message}`);
    }
}
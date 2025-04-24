const inputElement = document.querySelector('#groupInput')
inputElement.addEventListener('input', inputValidate);
function inputValidate () {
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
}


document.getElementById('joinButton').addEventListener('click', joinRoom);
async function joinRoom() {
    try {
        // Проверка наличия элементов DOM
        // const csrfTokenInput = document.querySelector("input[name='csrfmiddlewaretoken']");
        // if (!csrfTokenInput) throw new Error("CSRF token not found");
        
        const groupInput = document.getElementById('groupInput')
        if (!groupInput) throw new Error("Group input not found")

        // const csrfToken = csrfTokenInput.value;
        const groupUUID = groupInput.value.trim()
        if (!groupUUID) throw new Error("Enter group UUID")

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
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }

        const data = await response.json();
        alert(data.message)
        
        if (data.redirect_url) {
            window.location.href = data.redirect_url
        }
    } catch (error) {
        console.error('JoinRoom error:', error)
        alert(`Error: ${error.message}`)
    }
}
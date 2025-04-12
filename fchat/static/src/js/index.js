const inputElement = document.querySelector('#roomInput')
const errorElement = document.querySelector('#roomInputError');

inputElement.addEventListener('input', (e) => {
    const value = inputElement.value
    const allowedChars = /^[a-zA-Z0-9_]*$/

    if (inputElement.value.length > 28) { 
        inputElement.style.borderColor = "red";
        inputElement.value = value.slice(0, 28); 
        errorElement.textContent = "Too many symbols!"
        errorElement.style.display = "block"
    } else if (!allowedChars.test(value)) {
        inputElement.value = value.slice(0, value.length - 1)
        errorElement.textContent = "Only a-z, A-Z, 0-9 and _!"
        errorElement.style.display = "block"
    } else {
        inputElement.style.borderColor ="";
        errorElement.textContent = ":)"
        errorElement.style.display = "none"
    }
})


function joinRoom() {
    const roomName = document.getElementById('roomInput').value.trim();
    
    if (!roomName) {
        alert('Please enter room name!');
        return;
    }
    console.log(encodeURIComponent(roomName))
    
    window.location.href = `/chat/${encodeURIComponent(roomName)}/`;
}
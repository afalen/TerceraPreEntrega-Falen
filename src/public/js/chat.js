
const socket = io();

document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault()
    const messageInput = document.getElementById("message")
    const message = messageInput.value
    messageInput.value = ""

    socket.emit("chatMessage", message)
})

socket.on("message", (data) => {
    //console.log(data)
    const chatMessages = document.getElementById("chat-messages")
    const messageElement = document.createElement("div")
    messageElement.innerHTML = `<strong>${data.username}:</strong> ${data.message}`
    chatMessages.appendChild(messageElement)
})

document.getElementById("username-form").addEventListener("submit", async(e) => {
    e.preventDefault()
/*     const usernameInput = document.getElementById("username")
    const username = usernameInput.value */


    const result = await fetch('http://localhost:8080/api/sessions/current', {
        method: "GET",
    }) 
    const user = await result.json()

   // console.log(user.payload.email)
        
    
    socket.emit("newUser", user.payload.email)

    Swal.fire({
        icon: "success",
        title: "Bienvenido al chat",
        text: `Estas conectado como ${user.payload.email}`
    })

    document.getElementById("username-form").style.display = "none"
    document.getElementById("chat-form").style.display = "block"

})

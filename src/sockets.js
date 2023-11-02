const users = {}

export const chat = (io) =>{

        io.on("connection", (socket) => {
            console.log("Un usuario se ha conectado", socket.id);
            socket.on("newUser", (username) => {
                users[socket.id] = username;
                //console.log(users)
                io.emit("userConnected", username)
            })
        
        
            socket.on("chatMessage", (message) => {
                const username = users[socket.id];
                //console.log(users[socket.id])
                //console.log(message)
                io.emit("message", { username, message })
            })
        
            socket.on("disconnect", () => {
                const username = users[socket.id];
                delete users[socket.id];
                io.emit("userDisconnected", username)
            })
        })
}

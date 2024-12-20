import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket
    room: string
}

let allSockets: User[] = [];

// socket - It lets you talk to that person connected to you on this scoket.

wss.on("connection", function(socket) { 

    socket.on("message", function(message) {
        const parsedMessage = JSON.parse(message as unknown as string);
        if(parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }

        if(parsedMessage.type === "chat") {
            const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room

            allSockets
            .filter((x) => x.room === currentUserRoom)
            .forEach((user) => user.socket.send(parsedMessage.payload.message));

        }
    })
})
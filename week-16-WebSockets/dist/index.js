"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
// socket - It lets you talk to that person connected to you on this scoket.
wss.on("connection", function (socket) {
    socket.on("message", function (message) {
        var _a;
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type === "chat") {
            const currentUserRoom = (_a = allSockets.find((x) => x.socket == socket)) === null || _a === void 0 ? void 0 : _a.room;
            allSockets
                .filter((x) => x.room === currentUserRoom)
                .forEach((user) => user.socket.send(parsedMessage.payload.message));
        }
    });
});

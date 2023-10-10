"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSocket = void 0;
const index_1 = require("../index");
function startSocket() {
    index_1.io.on('connection', (socket) => {
        console.log(socket.id);
        socket.on('message', (socket) => {
            console.log(socket);
            index_1.io.emit('message', 'test');
        });
    });
}
exports.startSocket = startSocket;
//# sourceMappingURL=SocketController.js.map
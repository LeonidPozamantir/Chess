const socketIo = require('socket.io');

class SocketManager {
    sockets = {};

    init(server, sessionMiddleware) {
        const io = socketIo(server);
        io.use((socket, next) => {
            sessionMiddleware(socket.request, {}, next);
        });
        
        io.on('connection', (socket) => {
            let userId = socket.request.session.passport && socket.request.session.passport.user;
            if (!userId) return;
            this.sockets[userId] = socket;
            socket.on('message', (message) => {
                this.listener && this.listener.receiveMessage(userId, message);
            })
        });
    }

    sendMessage(userId, message) {
        this.sockets[userId] && this.sockets[userId].send(message);
    }

    setListener(listener) {
        this.listener = listener;
    }

    // TODO: move to a separate class
    notify(userId, message) {
        this.sendMessage(userId, message);
    }
}


module.exports = new SocketManager();



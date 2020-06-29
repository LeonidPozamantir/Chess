const ChessPosition = require('./ChessPosition');

class GameManager {
    games = [];
    gamesByClient = {};
    receiveMessage(userId, message) {
        let move = message;
        let game = this.gamesByClient[userId];
        if (!game.isMoveLegal(move)) return;
        game.makeMove(move);
        if (userId === game.white.userId) game.black.clientManager.notify(game.black.userId, game.white.userId, move);
        else if (userId === game.black.userId) game.white.clientManager.notify(game.white.userId, game.black.userId, move);
    }

    setClientManager(clientManager) {
        this.clientManager = clientManager;
    }

    createGame(whiteId, blackId) {
        let game = new Game();
        let blackClientManager = blackId === -1 ? this.computerPlayer : this.clientManager;
        game.init(whiteId, this.clientManager, blackId, blackClientManager);
        this.games.push(game);
        this.gamesByClient[whiteId] = game;
        this.gamesByClient[blackId] = game;
    }

    setComputerPlayer(computerPlayer) {
        this.computerPlayer = computerPlayer;
    }

    getGame(playerId) {
        return this.gamesByClient[playerId] || null;
    }
}

class Game {

    init(whiteId, whiteClientManager, blackId, blackClientManager) {
        this.position = new ChessPosition();
        this.position.setPiecesList(true);
        this.white = { userId: whiteId, clientManager: whiteClientManager };
        this.black = { userId: blackId, clientManager: blackClientManager };
    }

    makeMove(move) {
        this.position = this.position.makeMove(move);
    }

    getLegalMoves() {
        return this.position.getLegalMoves();
    }

    isMoveLegal(move) {
        return this.position.isMoveLegal(move);
    }
}

module.exports = new GameManager();
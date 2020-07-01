const ChessPosition = require('./ChessPosition');

const GameActionEnum = {
    StartGame: 0,
};

class GameManager {
    games = [];
    gameRequests = [];
    gamesByClient = {};
    receiveMessage(userId, message) {
        if (message.move) {
            let { move } = message;
            let game = this.gamesByClient[userId];
            if (game.getStatus() !== GameStatusEnum.InProgress) return;
            if (!game.isMoveLegal(move)) return;
            game.makeMove(move);
            if (userId === game.white.userId) game.black.clientManager.notify(game.black.userId, { opponentId: game.white.userId, move });
            else if (userId === game.black.userId) game.white.clientManager.notify(game.white.userId, { opponentId: game.black.userId, move });
        }
    }

    setClientManager(clientManager) {
        this.clientManager = clientManager;
    }

    requestGame(request) {
        const match = this.findMatchingRequestOrAdd(request);
        if (!match) return;
        let whiteId;
        let blackId;
        if (Math.random() < 0.5) {
            whiteId = request.userId;
            blackId = match.userId;
        } else {
            blackId = request.userId;
            whiteId = match.userId;
        }
        const game = this.createGame(whiteId, blackId);
        game.white.clientManager.notify(whiteId, { action: {
            actionType: GameActionEnum.StartGame,
            opponentId: blackId,
            color: 'w',
        } });
        game.black.clientManager.notify(blackId, { action: {
            actionType: GameActionEnum.StartGame,
            opponentId: whiteId,
            color: 'b',
        } });
    }

    createGame(whiteId, blackId) {
        let game = new Game();
        let blackClientManager = blackId === -1 ? this.computerPlayer : this.clientManager;
        game.init(whiteId, this.clientManager, blackId, blackClientManager);
        // this.games.push(game);
        this.gamesByClient[whiteId] = game;
        this.gamesByClient[blackId] = game;
        return game;
    }

    setComputerPlayer(computerPlayer) {
        this.computerPlayer = computerPlayer;
    }

    getGame(playerId) {
        return this.gamesByClient[playerId] || null;
    }

    findMatchingRequestOrAdd(request) {
        for (let i = 0; i < this.gameRequests.length; i++) {
            if (this.gameRequests[i].userId === request.userId) return false;
            // TODO - if (!condition) continue;
            return this.gameRequests.splice(i, 1)[0];
        }
        this.gameRequests.push(request);
    }
}

const GameStatusEnum = {
    InProgress: 1,
    Finished: 2,
};
const GameResultEnum = {
    NotFinished: 0,
    WhiteWonByCheckmate: 1,
    BlackWonByCheckmate: 2,
    WhiteResigned: 3,
    BlackResigned: 4,
    WhiteLostByTime: 5,
    BlackLostByTime: 6,
    DrawAccepted: 7,
    DrawByRepetion: 8,
    DrawBy50Moves: 9,
    DrawByStalemate: 10,
    DrawByInsufficientMaterial: 11,
};

class Game {

    init(whiteId, whiteClientManager, blackId, blackClientManager) {
        this.position = new ChessPosition();
        this.position.setPiecesList(true);
        this.white = { userId: whiteId, clientManager: whiteClientManager };
        this.black = { userId: blackId, clientManager: blackClientManager };
        this.gameStatus = GameStatusEnum.InProgress;
        this.gameResult = GameResultEnum.NotFinished;
    }

    makeMove(move) {
        this.position = this.position.makeMove(move);
        if (this.position.isCheckmate()) {
            this.gameStatus = GameStatusEnum.Finished;
            if (this.position.sideToMove === 'w') this.gameResult = GameResultEnum.BlackWonByCheckmate;
            else this.gameResult = GameResultEnum.WhiteWonByCheckmate;
        }
        if (this.position.isStalemate()) {
            this.gameStatus = GameStatusEnum.Finished;
            this.gameResult = GameResultEnum.DrawByStalemate;
        }
    }

    getLegalMoves() {
        return this.position.getLegalMoves();
    }

    isMoveLegal(move) {
        return this.position.isMoveLegal(move);
    }

    getStatus() {
        return this.gameStatus;
    }

    getResult() {
        return this.gameResult;
    }
}

module.exports = new GameManager();
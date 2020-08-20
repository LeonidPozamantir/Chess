const ChessPosition = require('./ChessPosition');
const dbConnector = require('./dbConnector');

class GameManager {
    games = [];
    gameRequests = [];
    gamesByClient = {};
    receiveMessage(userId, message) {
        let game = this.gamesByClient[userId];
        if (game.getStatus() !== GameStatusEnum.InProgress) return;
        if (message.move) {
            let { move } = message;
            if (!game.isMoveLegal(move)) return;
            const userToMove = game.position.sideToMove === 'w' ? game.white.userId : game.black.userId;
            if (userToMove !== userId) return;
            game.makeMove(move);
            if (userId === game.white.userId) game.black.clientManager.notify(game.black.userId, { 
                type: 'move', opponentId: game.white.userId, move, whiteRemainingTime: game.whiteRemainingTime, blackRemainingTime: game.blackRemainingTime
            });
            else if (userId === game.black.userId) game.white.clientManager.notify(game.white.userId, {
                type: 'move', opponentId: game.black.userId, move, whiteRemainingTime: game.whiteRemainingTime, blackRemainingTime: game.blackRemainingTime
            });
            game.whiteOfferedDraw = false;
            game.blackOfferedDraw = false;
            if (game.getStatus() === GameStatusEnum.Finished) {
                this.deleteAndSaveGame(game);
            }
        } else if (message.action) {
            let { action } = message;
            if (action === GameEventsEnum.OfferDraw) {
                if (game.whiteOfferedDraw || game.blackOfferedDraw) return;
                if (userId === game.white.userId) {
                    if (!game.whiteCanOfferDraw) return;
                    game.black.clientManager.notify(game.black.userId, { type: 'event', opponentId: game.white.userId, eventType: GameEventsEnum.OfferDraw });
                    game.whiteOfferedDraw = true;
                    game.whiteCanOfferDraw = false;
                }
                else if (userId === game.black.userId) {
                    if (!game.blackCanOfferDraw) return;
                    game.white.clientManager.notify(game.white.userId, { type: 'event', opponentId: game.black.userId, eventType: GameEventsEnum.OfferDraw });
                    game.blackOfferedDraw = true;
                    game.blackCanOfferDraw = false;
                }
            } else if (action === GameEventsEnum.AcceptDraw) {
                if (!(userId === game.white.userId && game.blackOfferedDraw || userId === game.black.userId && game.whiteOfferedDraw)) return;
                game.finishGame(GameResultEnum.DrawAccepted);
                game.black.clientManager.notify(game.black.userId, { type: 'event', opponentId: game.white.userId, eventType: GameEventsEnum.AcceptDraw });
                game.white.clientManager.notify(game.white.userId, { type: 'event', opponentId: game.black.userId, eventType: GameEventsEnum.AcceptDraw });
                this.deleteAndSaveGame(game);
                return;
            } else if (action === GameEventsEnum.DeclineDraw) {
                if (userId === game.white.userId) {
                    game.blackOfferedDraw = false;
                    game.black.clientManager.notify(game.black.userId, { type: 'event', opponentId: game.white.userId, eventType: GameEventsEnum.DeclineDraw });
                } else {
                    game.whiteOfferedDraw = false;
                    game.white.clientManager.notify(game.white.userId, { type: 'event', opponentId: game.black.userId, eventType: GameEventsEnum.DeclineDraw });
                }
            } else if (action === GameEventsEnum.Resign) {
                const gameResult = userId === game.white.userId ? GameResultEnum.WhiteResigned : GameResultEnum.BlackResigned;
                game.finishGame(gameResult);
                game.white.clientManager.notify(game.white.userId, { type: 'event', opponentId: game.black.userId, eventType: GameEventsEnum.Resign, gameResult });
                game.black.clientManager.notify(game.black.userId, { type: 'event', opponentId: game.white.userId, eventType: GameEventsEnum.Resign, gameResult });
                return;
            }
        }
    }

    setClientManager(clientManager) {
        this.clientManager = clientManager;
    }

    async requestGame(request) {
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
        const whiteUser = await dbConnector.getUserById(whiteId);
        const blackUser = await dbConnector.getUserById(blackId);
        const game = this.createGame(whiteId, blackId, { game: 5 });
        game.white.clientManager.notify(whiteId, {
            type: 'event',
            eventType: GameEventsEnum.StartGame,
            opponentId: blackId,
            opponentName: blackUser.userName,
            opponentRating: blackUser.rating,
            opponentProfilePicture: blackUser.profilePicture,
            color: 'w',
            timeControl: game.timeControl,
        });
        game.black.clientManager.notify(blackId, {
            type: 'event',
            eventType: GameEventsEnum.StartGame,
            opponentId: whiteId,
            opponentName: whiteUser.userName,
            opponentRating: whiteUser.rating,
            opponentProfilePicture: whiteUser.profilePicture,
            color: 'b',
            timeControl: game.timeControl,
        });
    }

    createGame(whiteId, blackId, timeControl) {
        let game = new Game();
        let blackClientManager = blackId === -1 ? this.computerPlayer : this.clientManager;
        game.init(whiteId, this.clientManager, blackId, blackClientManager, timeControl, this);
        // this.games.push(game);
        this.gamesByClient[whiteId] = game;
        this.gamesByClient[blackId] = game;
        return game;
    }

    deleteAndSaveGame(game) {
        // TODO: save the game
        delete this.gamesByClient[game.white.userId];
        delete this.gamesByClient[game.black.userId];
    }

    setComputerPlayer(computerPlayer) {
        this.computerPlayer = computerPlayer;
    }

    getGame(playerId) {
        return this.gamesByClient[playerId] || null;
    }

    async getGameState(playerId) {
        const res = {
            isWaitingForGameStart: false,
            gameStatus: GameStatusEnum.NotStarted,
            gameResult: GameResultEnum.NotFinished,
            position: new ChessPosition(),
            playerColor: 'w',
            opponentId: null,
            opponentName: null,
            opponentProfilePicture: null,
            opponentRating: null,
            lastMove: null,
            whiteRemainingTime: null,
            blackRemainingTime: null,
            moves: [],
        };
        if (this.gameRequests.some(r => r.userId === playerId)) return {...res, isWaitingForGameStart : true };
        const game = this.getGame(playerId);
        if (!game) return res;
        res.gameStatus = GameStatusEnum.InProgress;
        res.position = game.getPosition();
        res.playerColor = game.white.userId === playerId ? 'w' : 'b';
        const opponentId = game.white.userId === playerId ? game.black.userId : game.white.userId;
        const opponent = await dbConnector.getUserById(opponentId);
        res.opponentName = opponent.userName;
        res.opponentRating = opponent.rating;
        res.opponentProfilePicture = opponent.profilePicture;
        res.lastMove = game.lastMove;
        game.updateRemainingTime();
        res.whiteRemainingTime = game.whiteRemainingTime;
        res.blackRemainingTime = game.blackRemainingTime;
        res.wasDrawOffered = !(game.white.userId === playerId ? game.whiteCanOfferDraw : game.blackCanOfferDraw);
        res.opponentOfferedDraw = game.white.userId === playerId ? game.blackOfferedDraw : game.whiteOfferedDraw;
        res.moves = game.moves;
        return res;
    }

    findMatchingRequestOrAdd(request) {
        for (let i = 0; i < this.gameRequests.length; i++) {
            if (this.gameRequests[i].userId === request.userId) return false;
            // TODO - if (!condition) continue;
            return this.gameRequests.splice(i, 1)[0];
        }
        this.gameRequests.push(request);
    }

    notifyEvent(game, event) {
        // for now only in case of timeout
        game.white.clientManager.notify(game.white.userId, { 
            type: 'event', opponentId: game.black.userId, eventType: event, gameResult: game.gameResult, whiteRemainingTime: game.whiteRemainingTime, blackRemainingTime: game.blackRemainingTime
        });
        game.black.clientManager.notify(game.black.userId, { 
            type: 'event', opponentId: game.white.userId, eventType: event, gameResult: game.gameResult, whiteRemainingTime: game.whiteRemainingTime, blackRemainingTime: game.blackRemainingTime
        });
        this.deleteAndSaveGame(game);
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

const GameEventsEnum = {
    StartGame: 0,
    OfferDraw: 1,
    AcceptDraw: 2,
    DeclineDraw: 3,
    Resign: 4,
    Timeout: 5,
};

class Game {

    init(whiteId, whiteClientManager, blackId, blackClientManager, timeControl, gameManager) {
        this.position = new ChessPosition();
        this.position.setPiecesList(true);
        this.white = { userId: whiteId, clientManager: whiteClientManager };
        this.black = { userId: blackId, clientManager: blackClientManager };
        this.gameStatus = GameStatusEnum.InProgress;
        this.gameResult = GameResultEnum.NotFinished;
        this.timeControl = timeControl;
        this.whiteRemainingTime = timeControl.game * 60 * 1000;
        this.blackRemainingTime = timeControl.game * 60 * 1000;
        this.lastClockUpdate = Date.now();
        this.timeCountdown();
        this.gameManager = gameManager;
        this.whiteOfferedDraw = false;
        this.blackOfferedDraw = false;
        this.whiteCanOfferDraw = true;
        this.blackCanOfferDraw = true;
        this.moves = [];
    }

    makeMove(move) {
        this.updateRemainingTime();
        const isLegal = this.position.isMoveLegal(move);
        if (isLegal) this.addMoveRecord(move);
        this.position = this.position.makeMove(move);
        if (isLegal) {
            this.lastMove = move;
            if (this.position.isCheckmate()) {
                const gameResult = this.position.sideToMove === 'w' ? GameResultEnum.BlackWonByCheckmate : GameResultEnum.WhiteWonByCheckmate;
                this.finishGame(gameResult);
                return;
            }
            if (this.position.isStalemate()) {
                this.finishGame(GameResultEnum.DrawByStalemate);
                return;
            }
        }
        this.timeCountdown();
    }

    updateRemainingTime() {
        const curClockUpdate = Date.now();
        const timeReduction = curClockUpdate - this.lastClockUpdate;
        this.lastClockUpdate = curClockUpdate;
        if (this.position.sideToMove === 'w') this.whiteRemainingTime -= timeReduction; else this.blackRemainingTime -= timeReduction;
    }

    timeCountdown() {
        if (this.timer) clearTimeout(this.timer);
        const [gameResult, remainingTime] = this.position.sideToMove === 'w' 
                ? [GameResultEnum.WhiteLostByTime, this.whiteRemainingTime]
                : [GameResultEnum.BlackLostByTime, this.blackRemainingTime];
        this.timer = setTimeout(() => {
            this.updateRemainingTime();
            this.finishGame(gameResult);
            this.gameManager.notifyEvent(this, GameEventsEnum.Timeout);
        }, remainingTime);
    }

    addMoveRecord(move) {
        if (!this.moves.length || this.position.sideToMove === 'w') this.moves.push({});
        this.moves[this.moves.length - 1][this.position.sideToMove] = {
            move: move,
            notation: this.position.getMoveNotation(move),
        };
    }

    finishGame(gameResult) {
        this.gameStatus = GameStatusEnum.Finished;
        this.gameResult = gameResult;
        if (this.timer) clearTimeout(this.timer);
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

    getPosition() {
        return this.position;
    }
}

module.exports = new GameManager();
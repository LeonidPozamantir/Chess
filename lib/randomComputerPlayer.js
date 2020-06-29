const gameManager = require('./gameManager');

class RandomComputerPlayer {
    notify(playerId, opponentId, move) {
        const game = gameManager.getGame(opponentId);
        const legalMoves = game.getLegalMoves();
        const moveNumber = Math.floor(Math.random() * legalMoves.length);
        gameManager.receiveMessage(playerId, legalMoves[moveNumber]);
    }
}

module.exports = new RandomComputerPlayer();
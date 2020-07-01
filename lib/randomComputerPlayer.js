const gameManager = require('./gameManager');

class RandomComputerPlayer {
    notify(playerId, opponentId, move) {
        let moveNumber = null;
        const game = gameManager.getGame(opponentId);
        const legalMoves = game.getLegalMoves();
        for (let i = 0; i < legalMoves.length; i++) {
            let position = game.position.copy();
            position = position.makeMove(legalMoves[i]);
            if (position.isCheckmate()) {
                moveNumber = i;
                break;
            }
        }
        if (moveNumber === null) moveNumber = Math.floor(Math.random() * legalMoves.length);
        // const moveNumber = Math.floor(Math.random() * legalMoves.length);
        gameManager.receiveMessage(playerId, legalMoves[moveNumber]);
    }
}

module.exports = new RandomComputerPlayer();
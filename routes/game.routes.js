const { Router } = require('express');
const router = Router();

const gameManager = require('../lib/gameManager');

router.post('/request', async (req, res) => {
    await gameManager.requestGame({ userId: req.user.id });
    res.status(200).json({ resultCode: 0, data: {}, messages: [] });
});

router.get('/state', async (req, res) => {
    const gameState = await gameManager.getGameState(req.user.id);
    res.status(200).json({ resultCode: 0, data: gameState, messages: [] })
});

module.exports = router;
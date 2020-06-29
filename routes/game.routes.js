const { Router } = require('express');
const router = Router();

const gameManager = require('../lib/gameManager');

router.post('/start', (req, res) => {
    gameManager.createGame(req.user.id, -1);
    res.status(200).json({ resultCode: 0, data: {}, messages: [] });
});

module.exports = router;
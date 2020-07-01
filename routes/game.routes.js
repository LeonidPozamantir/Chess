const { Router } = require('express');
const router = Router();

const gameManager = require('../lib/gameManager');

router.post('/request', (req, res) => {
    gameManager.requestGame({ userId: req.user.id });
    res.status(200).json({ resultCode: 0, data: {}, messages: [] });
});

module.exports = router;
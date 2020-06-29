const { Router } = require("express");
const dbConnector = require("../lib/dbConnector");
const router = Router();

router.get('/', (req, res) => {
    dbConnector.getUserByName(req.user.userName)
    .then(user => {
        res.status(200).json({ resultCode: 0, data: {email: user.email, rating: user.rating}, messages: [] });
    });
});

router.post('/saveSettings', (req, res) => {
    dbConnector.changeUserData(req.user.userName, req.body.email, req.body.rating)
    .then(() => {
        res.status(200).json({ resultCode: 0, data: req.body, messages: [] });
    });
});

module.exports = router;
const { Router } = require("express");

const dbConnector = require("../lib/dbConnector");
const router = Router();
const storageManager = require('../lib/storageManager');


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

router.post('/savePicture', (req, res) => {
    dbConnector.getUserById(req.user.id)
    .then(user => {
        oldProfilePictureLink = user.profilePicture;
        if (oldProfilePictureLink) return storageManager.deleteFile(oldProfilePictureLink);
    })
    .then(() => storageManager.putFile(req.body, req.headers['x-extension']))
    .tap((fullUrl) => dbConnector.setProfilePicture(req.user.id, fullUrl))
    .then((fullUrl) => {
        res.status(200).json({ resultCode: 0, data: {fileLink: fullUrl}, messages: [] });
    })
    .catch(err => {
        res.status(200).json({ resultCode: 1, data: {}, messages: ['Server error'] });
        console.log(err);
    });
    
});

module.exports = router;
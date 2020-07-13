const { Router } = require("express");
const dbConnector = require("../lib/dbConnector");
const router = Router();
const config = require('config');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({ accessKeyId: config.secrets.s3.keyId, secretAccessKey: config.secrets.s3.secretKey });
const { uuid } = require('uuidv4');

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
    const filename = uuid().replace(/-/g, '_') + req.headers['x-extension'] || '.ext';
    const prefix = config.storage.s3Url;
    const fullUrl = prefix + filename;
    dbConnector.getUserById(req.user.id)
    .then(user => {
        oldProfilePictureLink = user.profilePicture;
        if (oldProfilePictureLink) return s3.deleteObject({ Bucket: 'leochess', Key: oldProfilePictureLink.substring(prefix.length) }).promise();
    })
    .then(res => console.log(res))
    .then(() => s3.putObject({ Bucket: 'leochess', Key: filename, Body: req.body }).promise())
    .then(() => dbConnector.setProfilePicture(req.user.id, fullUrl))
    .then(() => {
        res.status(200).json({ resultCode: 0, data: {fileLink: fullUrl}, messages: [] });
    })
    .then(() => dbConnector.getUserById(req.user.id))
    .then(user => {

    })
    .catch(err => {
        res.status(200).json({ resultCode: 1, data: {}, messages: ['Server error'] });
        console.log(err);
    });
    
});

module.exports = router;
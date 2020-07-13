const { Router } = require('express');
const router = Router();
const passport = require('passport');

const dbConnector = require('../lib/dbConnector');

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) return res.status(200).json({resultCode: 1, data: {}, messages: [error]});
        return req.logIn(user, (err) => {
            if (err) {
              return next(err);
            }
            if (!req.body.rememberMe) req.session.cookie.maxAge = false;
            return res.status(200).json({resultCode: 0, data: getUserData(user), messages: []});
        });
    })(req, res, next);
});

router.post('/register', (req, res) => {
    let { userName, password, email } = req.body;
    let newUser = { userName, password, email };
    dbConnector.addUser(newUser)
    .then(() => {
        return req.logIn(newUser, (err) => {
            if (err) {
              return next(err);
            }
            if (!req.body.rememberMe) req.session.cookie.maxAge = false;
            return res.status(200).json({resultCode: 0, data: getUserData(newUser), messages: []});
        });
    })
    .catch(err => {
        res.status(200).json({ resultCode: 1, data: {}, messages: [err] });
    });
});

router.get('/me', (req, res) => {
    let responseData = req.user 
        ? {resultCode: 0, data: getUserData(req.user), messages: []}
        : {resultCode: 1, data: {}, messages: ['User is not logged in']};
    res.status(200).json(responseData);
});

router.post('/logout', (req, res) => {
    req.logout();
    res.status(200).json({resultCode: 0, data: {}, messages: []});
});

router.get('/getUserData', (req, res) => {
    res.status(200).json(req.user);
});

function getUserData(user) {
    if (!user) return {};
    const { userName, email, rating, profilePicture } = user;
    return { userName, email, rating, profilePicture };
}

module.exports = router;
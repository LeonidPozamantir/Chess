const { Router } = require('express');
const router = Router();
const passport = require('passport');

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) return res.status(200).json({resultCode: 1, data: {}, messages: [error]});
        return req.logIn(user, (err) => {
            if (err) {
              return next(err);
            }
            if (!req.body.rememberMe) req.session.cookie.maxAge = false;
            return res.status(200).json({resultCode: 0, data: {userName: user.userName}, messages: []});
        });
    })(req, res, next);
});

router.get('/me', (req, res) => {
    let responseData = req.user 
        ? {resultCode: 0, data: {userName: req.user.userName}, messages: []} 
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

module.exports = router;
const express = require('express');
const app = express();
const config = require('config');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

const auth = require('./lib/auth');

const PORT = config.general.port || 5000;

app.use(express.json());
app.use(session({ 
    secret: config.secrets.session,
    rolling: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000 * 60 * 24,
        sameSite: true,
        secure: config.general.httpsEnabled,
    },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/auth.routes'));
app.get('/libs', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'lib', 'ChessPosition.js'));
});

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
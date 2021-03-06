const express = require('express');
const app = express();
const config = require('config');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const http = require('http');

require('./lib/auth'); // DO NOT DELETE - passport initialization
const socketManager = require('./lib/socketManager');
const gameManager = require('./lib/gameManager');
const randomComputerPlayer = require('./lib/randomComputerPlayer');

const PORT = config.general.port || 5000;

const sessionMiddleware = session({
    secret: config.secrets.session,
    rolling: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000 * 60 * 24,
        sameSite: true,
        secure: config.general.httpsEnabled,
    },
});

app.use(express.json());
app.use(express.raw({ type: 'image/*', limit: '3mb' }));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/auth.routes'));
app.use('/profile', require('./routes/profile.routes'));
app.use('/game', require('./routes/game.routes'));
app.get('/libs', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'lib', 'ChessPosition.js'));
});

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const server = http.createServer(app);
socketManager.init(server, sessionMiddleware);
socketManager.setListener(gameManager);
gameManager.setClientManager(socketManager);
gameManager.setComputerPlayer(randomComputerPlayer);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});



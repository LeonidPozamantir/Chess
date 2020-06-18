const express = require('express');
const app = express();
const config = require('config');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const PORT = config.general.port || 5000;

let users = {
    leo: {password: '140386', desc: 'brother'},
    jane: {password: '200490', desc: 'sister'},
};

app.use(express.json());
app.use(session({ secret: 'keyboard cat', rolling: true, cookie: { maxAge: 60000 }}))
passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password',
}, function(username, password, done) {
    console.log('strategy', username, password);
    if (!users[username]) return done('User does not exist');
    if (users[username].password !== password) return done('Wrong password');
    return done(null, users[username]);
}));
passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((user, done) => {
    done(null, user);
});
app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', require('./routes/auth.routes'));

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
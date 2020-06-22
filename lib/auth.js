const passport = require('passport');
const LocalStrategy = require('passport-local');

const dbConnector = require('./dbConnector');

passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password',
}, async function(username, password, done) {
    let user = await dbConnector.getUser(username);
    if (!user) return done('User does not exist');
    if (user.password !== password) return done('Wrong password');
    return done(null, user);
}));
passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
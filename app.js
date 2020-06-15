const express = require('express');
const app = express();
const config = require('config');
const path = require('path');

const PORT = config.general.port || 5000;

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
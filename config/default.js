module.exports = {
    general: {
        port: 5000,
        httpsEnabled: false, //TODO in the distant future
    },
    secrets: {
        session: 'keyboard cat',
    },
    storage: {
        s3Url: 'https://leochess.s3.eu-central-1.amazonaws.com/',
    },
};
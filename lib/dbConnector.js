let users = {
    leo: {userName: 'leo', password: '140386', desc: 'brother'},
    jane: {userName: 'jane', password: '200490', desc: 'sister'},
};

class DBConnector {
    getUser(userName) {
        return Promise.resolve(users[userName]);
    }
};

module.exports = new DBConnector();
let users = {
    leo: {id: 1, userName: 'leo', password: '140386', email: 'brother', rating: 1600},
    jane: {id: 2, userName: 'jane', password: '200490', email: 'sister', rating: 1200},
};

class DBConnector {
    getUserByName(userName) {
        return Promise.resolve(users[userName]);
    }
    getUserById(id) {
        let keys = Object.keys(users);
        for (let i = 0; i < keys.length; i++) {
            if (users[keys[i]].id === id) return Promise.resolve(users[keys[i]]);
        }
        return Promise.reject();
    }
    addUser(user) {
        if (users[user.userName]) return Promise.reject('User already exists');
        users[user.userName] = {id: users.length + 1, userName: user.userName, password: user.password, email: user.email};
        return Promise.resolve(user);
    }
    changeUserData(userName, email, rating) {
        let user = users[userName];
        user.email = email;
        user.rating = rating;
        return Promise.resolve(user);
    }
};

module.exports = new DBConnector();
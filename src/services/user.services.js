const User = require('../models/user.model');

class UserService {
    async store(data) {
        return await User.create(data);
    }

    async login(data) {
        const user = await User.findOne({ email: data.email });
        console.log(user.password);
        console.log(user);
        
        if(!user || user.password !== data.password) {
            throw new Error('Email or password is incorrect!');
        }
        return user;
    }
}

module.exports = new UserService();
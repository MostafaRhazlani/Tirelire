const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

class UserService {
    async store(data) {
        return await User.create(data);
    }

    async login(data) {
        const user = await User.findOne({ email: data.email });
        
        if(!user || user.password !== data.password) {
            throw new Error('Email or password is incorrect!');
        }
        
        const userData = {
            id: user._id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
        }
        
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        return token;
    }
}

module.exports = new UserService();
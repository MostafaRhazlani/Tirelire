const UserService = require('../services/user.services.js');

class UserController {
    async store(req, res) {
        try {
            const data = {
                full_name: req.body.full_name,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
                cin: req.body.cin,
                nationalIdImage: req.file ? req.file.filename : null
            };
            
            const user = await UserService.store(data);
            res.status(201).json({ message: 'User created successfully!' , user});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const token = await UserService.login(req.body);
            res.status(200).json({ message: 'User logged successfully!', token});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new UserController();
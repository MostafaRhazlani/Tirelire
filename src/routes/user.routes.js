const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload.js');
const { validate, registerValidation, logginValidation } = require('../middleware/user.validation');
const authMiddleware = require('../middleware/auth.js');
const roleMiddleware = require('../middleware/role.js');
const userController = require('../controllers/user.controller');

router.post('/user/store', (req, res, next) => {
    upload.single('nationalIdImage')(req, res, (err) => {
        if(err) {
            return res.status(400).json({ status: 'error', errors: { nationalIdImage: err.message } })
        } 
        if(req.file) req.body.nationalIdImage = "1"  
        next();
    });
}, registerValidation(), validate, (req, res) => userController.store(req, res));
router.post('/user/login', upload.none(), logginValidation(), validate, (req, res) => userController.login(req, res));

router.get('/profile', authMiddleware, roleMiddleware(['Particulier']), (req, res) => {
    res.send(`Welcome back MR. ${req.user.full_name}`);
})
module.exports = router;


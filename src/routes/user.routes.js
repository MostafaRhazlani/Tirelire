const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { validate, registerValidation, logginValidation } = require('../middleware/user.validation');
const authMiddleware = require('../middleware/auth.js');
const userController = require('../controllers/user.controller');

router.post('/user/store', registerValidation(), validate, (req, res) => userController.store(req, res));
router.post('/user/login', upload.none(), logginValidation(), validate, (req, res) => userController.login(req, res));

router.get('/profile', authMiddleware, (req, res) => {
    res.send(`Welcome back MR. ${req.user.full_name}`);
    
})
module.exports = router;


const express = require('express');
const router = express.Router();
const { validate, registerValidation, logginValidation } = require('../middleware/user.validation');
const userController = require('../controllers/user.controller');

router.post('/user/store', registerValidation(), validate, (req, res) => userController.store(req, res));
router.post('/user/login', logginValidation(), validate, (req, res) => userController.login(req, res));

module.exports = router;


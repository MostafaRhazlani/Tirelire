const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const paymentValidation = require('../middleware/payment.validation');
const validate = require('../middleware/validate.errors');
const upload = require('../middleware/upload');
const PaymentController = require('../controllers/payment.controller');

router.post('/create/payment', authMiddleware, roleMiddleware('Particulier'), upload.none(), paymentValidation(), validate, (req, res) => PaymentController.createPayment(req, res));

module.exports = router;

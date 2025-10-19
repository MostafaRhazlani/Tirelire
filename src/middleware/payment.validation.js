const { body } = require('express-validator');

const paymentValidation = () => [
    body('groupId').notEmpty().withMessage('Group id is required'),
    body('roundId').notEmpty().withMessage('Contribution round id is required'),
    body('amount').notEmpty().withMessage('Amount is required'),
]

module.exports = paymentValidation;
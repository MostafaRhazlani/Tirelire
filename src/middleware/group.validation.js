const { body } = require('express-validator');

const groupValidation = () => [
    body('groupName').notEmpty().withMessage('Group name is required'),
    body('description').optional(),
    body('rules.contributionAmount').notEmpty().withMessage('Contribution amount is required'),
    body('rules.deadlineDays').notEmpty().withMessage('Deadline days is required'),
]

module.exports = groupValidation;
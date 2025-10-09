const { body, validationResult  } = require('express-validator');

const registerValidation = () => [
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('cin').notEmpty().withMessage('CIN is required'),
    body('nationalIdImage').notEmpty().withMessage('National ID image is required'),
    body('selfieImage').notEmpty().withMessage('Selfie image is required')
]

const validate = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const formattedErrors = {};
        errors.array().forEach(err => formattedErrors[err.path] = err.msg);
        return res.status(400).json({ status: 'error', errors: formattedErrors });
    }
    next();
};

const logginValidation = () => [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email'),
    body('password')
        .notEmpty().withMessage('Password is required'),
]

module.exports = {
    registerValidation,
    logginValidation,
    validate
}
const { validationResult } = require('express-validator');


const validate = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const formattedErrors = {};
        errors.array().forEach(err => formattedErrors[err.path] = err.msg);
        return res.status(400).json({ status: 'error', errors: formattedErrors });
    }
    next();
};

module.exports = validate;
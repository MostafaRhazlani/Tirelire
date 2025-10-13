const jwt = require('jsonwebtoken');

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        const jwtSecret = process.env.JWTSECRET;
        const token = req.header('Authorization').split(' ')[1];
        const currentUser = jwt.decode(token, jwtSecret);
        
        if(roles.includes(currentUser.role)) {
            next();
        } else {
            res.status(402).json({ message: 'You can\'t access to this endpoint!' });
        }
    }
}

module.exports = roleMiddleware;
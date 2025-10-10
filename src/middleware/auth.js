const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const header = req.header('Authorization');
    
    if(!header) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = header.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid', error: error.message });
    }
}

module.exports = authMiddleware;
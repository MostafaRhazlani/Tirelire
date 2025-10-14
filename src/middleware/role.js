const roleMiddleware = (roles) => {
    return (req, res, next) => {
        const currentUser = req.user;
        
        if(roles.includes(currentUser.role)) {
            next();
        } else {
            res.status(402).json({ message: 'You can\'t access to this endpoint!' });
        }
    }
}

module.exports = roleMiddleware;
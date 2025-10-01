const jwt = require('jsonwebtoken');

const authorize = (roles = []) => {
    return (req, res, next) => {
        try {
            const authHeader = req.header('Authorization');
            if (!authHeader) {
                return res.status(401).send('Authorization header is missing.');
            }

            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).send('Token is missing.');
            }

            const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verifiedUser;

            if (roles.length > 0 && !verifiedUser.roles.some(r => roles.includes(r))) {
                return res.status(403).send('Access denied. Insufficient permissions.');
            }

            next();
        } catch (err) {
            console.error(err);

            if (err.name === 'JsonWebTokenError') {
                return res.status(401).send('Invalid token.');
            } else if (err.name === 'TokenExpiredError') {
                return res.status(401).send('Token has expired.');
            } else {
                return res.status(500).json({ message: 'An error occurred during authorization.', error: err });
            }
        }
    };
};

module.exports = authorize;

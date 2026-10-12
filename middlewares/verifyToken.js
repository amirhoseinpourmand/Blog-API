const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Invalid Authorization Header');
        error.status = 401;
        throw error;
    }

    const token = authHeader;

    let decodedToken = jwt.verify(token, "Amir2004")

    if (!decodedToken) {
        const error = new Error("Invalid Token")
        error.status = 401;
        throw error;
    }

    req.userId = decodedToken.userId;
    next();
}
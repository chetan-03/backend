const jwt = require('jsonwebtoken');
const JWT_SECRET = 'chetanvanam7890$_';

const fetchuser = (req, res, next) => {
    // retriving jwt token from the header
    const token = req.header('auth-token');
    // checking token is empty or not 
    if (!token) {
        res.status(401).json({ error: 'Please authenticate with valid token' });
    }
    try {
        // verifying token with jwt verify function and storing user in browser's req.user
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user;
        next()
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate with valid token' })
    }
}


module.exports = fetchuser;
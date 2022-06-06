var jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'ashishkumarguptacse2023';

const fetchUser = (req, res, next) => {
    try {
        // Get the user from the header file
        const token = req.header('user-token');
        if (!token) {
            res.status(401).send({ error: "Invalid User Id" })
        }
        req.userId = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        res.status(500).json({ "Server Error": error.message });
    }
}
module.exports = fetchUser;
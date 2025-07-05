import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import config from '../config/index.js';

const protect = async (req, res, next) => {
    let token;

    // Check for the token in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (e.g., "Bearer eyJhbGci...")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, config.JWT_SECRET);

            // Get user from the token's payload (ID) and attach it to the request object
            // We exclude the password from the user object being attached
            req.user = await User.findById(decoded.user.id).select('-password');
            
            if (!req.user) {
                 return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Proceed to the next middleware or the route handler
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export default protect;
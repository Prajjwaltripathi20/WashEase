const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Verify employee token and check role
// @route   Middleware for employee routes
const employeeAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ message: 'Employee not found' });
            }

            // Check if user is an employee (washer or admin)
            if (req.user.role !== 'washer' && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied. Employee role required.' });
            }
            
            next();
        } catch (error) {
            console.error('Employee auth error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { employeeAuth };


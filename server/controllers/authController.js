const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { checkConnection } = require('../config/db');
        if (!checkConnection()) {
            return res.status(503).json({ message: 'Database not connected. Please check server configuration.' });
        }

        const { name, email, password, role, hostelBlock, roomNumber } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            hostelBlock,
            roomNumber
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                hostelBlock: user.hostelBlock,
                roomNumber: user.roomNumber,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { checkConnection } = require('../config/db');
        if (!checkConnection()) {
            return res.status(503).json({ message: 'Database not connected. Please check server configuration.' });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                hostelBlock: user.hostelBlock,
                roomNumber: user.roomNumber,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

module.exports = { registerUser, loginUser };

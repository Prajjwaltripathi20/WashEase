const Laundry = require('../models/Laundry');
const { checkConnection, connectDB } = require('../config/db');

// @desc    Create new laundry request
// @route   POST /api/laundry
// @access  Private
const createLaundryRequest = async (req, res) => {
    try {
        if (!checkConnection()) {
            await connectDB();
            if (!checkConnection()) {
                return res.status(503).json({ message: 'Database not connected. Please check server configuration.' });
            }
        }

        const { clothes, specialInstructions } = req.body;

        if (!clothes || !Array.isArray(clothes) || clothes.length === 0) {
            return res.status(400).json({ message: 'Please provide at least one clothing item' });
        }

        // Validate each clothing item
        for (const item of clothes) {
            if (!item.itemType || !item.quantity || item.quantity < 1) {
                return res.status(400).json({ message: 'Each item must have a type and quantity of at least 1' });
            }
        }

        const laundry = new Laundry({
            user: req.user._id,
            clothes,
            specialInstructions: specialInstructions || '',
            status: 'pending'
        });

        const createdLaundry = await laundry.save();
        const populatedLaundry = await Laundry.findById(createdLaundry._id).populate('user', 'name email');

        res.status(201).json(populatedLaundry);
    } catch (error) {
        console.error('Error in createLaundryRequest:', error);
        res.status(500).json({ message: error.message || 'Failed to create laundry request' });
    }
};

// @desc    Get logged in user's laundry requests
// @route   GET /api/laundry
// @access  Private
const getMyLaundry = async (req, res) => {
    try {
        if (!checkConnection()) {
            await connectDB();
            if (!checkConnection()) {
                return res.status(503).json({ message: 'Database not connected. Please check server configuration.' });
            }
        }

        const laundry = await Laundry.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('user', 'name email');
        res.json(laundry);
    } catch (error) {
        console.error('Error in getMyLaundry:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch laundry requests' });
    }
};

// @desc    Get all laundry requests (Admin/Washer)
// @route   GET /api/laundry/all
// @access  Private (Admin/Washer)
const getAllLaundry = async (req, res) => {
    try {
        if (!checkConnection()) {
            await connectDB();
            if (!checkConnection()) {
                return res.status(503).json({ message: 'Database not connected. Please check server configuration.' });
            }
        }

        const laundry = await Laundry.find({})
            .populate('user', 'name email roomNumber hostelBlock')
            .sort({ createdAt: -1 });
        res.json(laundry);
    } catch (error) {
        console.error('Error in getAllLaundry:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch all laundry requests' });
    }
};

// @desc    Update laundry status
// @route   PUT /api/laundry/:id
// @access  Private (Admin/Washer)
const updateLaundryStatus = async (req, res) => {
    try {
        if (!checkConnection()) {
            await connectDB();
            if (!checkConnection()) {
                return res.status(503).json({ message: 'Database not connected. Please check server configuration.' });
            }
        }

        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const validStatuses = ['pending', 'picked_up', 'in_progress', 'ready', 'delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const laundry = await Laundry.findById(req.params.id);

        if (!laundry) {
            return res.status(404).json({ message: 'Laundry request not found' });
        }

        laundry.status = status;

        // Update dates based on status
        if (status === 'picked_up' && !laundry.pickupDate) {
            laundry.pickupDate = new Date();
        }
        if (status === 'delivered' && !laundry.deliveryDate) {
            laundry.deliveryDate = new Date();
        }

        const updatedLaundry = await laundry.save();
        const populatedLaundry = await Laundry.findById(updatedLaundry._id)
            .populate('user', 'name email roomNumber hostelBlock');

        res.json(populatedLaundry);
    } catch (error) {
        console.error('Error in updateLaundryStatus:', error);
        res.status(500).json({ message: error.message || 'Failed to update laundry status' });
    }
};

module.exports = { createLaundryRequest, getMyLaundry, getAllLaundry, updateLaundryStatus };

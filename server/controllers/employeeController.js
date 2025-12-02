const User = require('../models/User');
const Laundry = require('../models/Laundry');
const jwt = require('jsonwebtoken');
const { checkConnection } = require('../config/db');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Employee login
// @route   POST /api/employee/login
// @access  Public
const employeeLogin = async (req, res) => {
    try {
        if (!checkConnection()) {
            return res.status(503).json({ message: 'Database not connected. Please check server configuration.' });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const employee = await User.findOne({ email, role: { $in: ['washer', 'admin'] } });

        if (!employee) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (await employee.matchPassword(password)) {
            res.json({
                _id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                token: generateToken(employee._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error in employeeLogin:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Get all assigned orders for employee
// @route   GET /api/employee/orders
// @access  Private (Employee)
const getAssignedOrders = async (req, res) => {
    try {
        if (!checkConnection()) {
            return res.status(503).json({ message: 'Database not connected. Please check server configuration.' });
        }

        const employeeId = req.user._id;

        // Get orders assigned to this employee or pending orders
        const orders = await Laundry.find({
            $or: [
                { assignedTo: employeeId },
                { status: 'pending', assignedTo: null }
            ]
        })
            .populate('user', 'name email roomNumber hostelBlock')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Error in getAssignedOrders:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch orders' });
    }
};

// @desc    Accept an order
// @route   POST /api/employee/orders/:id/accept
// @access  Private (Employee)
const acceptOrder = async (req, res) => {
    try {
        if (!checkConnection()) {
            return res.status(503).json({ message: 'Database not connected. Please check server configuration.' });
        }

        const order = await Laundry.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Order is not in pending status' });
        }

        if (order.assignedTo && order.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Order is already assigned to another employee' });
        }

        order.assignedTo = req.user._id;
        order.status = 'accepted';

        // Add to activity log
        order.activityLog.push({
            status: 'accepted',
            updatedBy: req.user._id,
            updatedAt: new Date(),
            notes: 'Order accepted by employee'
        });

        const updatedOrder = await order.save();
        const populatedOrder = await Laundry.findById(updatedOrder._id)
            .populate('user', 'name email roomNumber hostelBlock')
            .populate('assignedTo', 'name email')
            .populate('activityLog.updatedBy', 'name email');

        res.json(populatedOrder);
    } catch (error) {
        console.error('Error in acceptOrder:', error);
        res.status(500).json({ message: error.message || 'Failed to accept order' });
    }
};

// @desc    Reject an order
// @route   POST /api/employee/orders/:id/reject
// @access  Private (Employee)
const rejectOrder = async (req, res) => {
    try {
        if (!checkConnection()) {
            return res.status(503).json({ message: 'Database not connected. Please check server configuration.' });
        }

        const { reason } = req.body;
        const order = await Laundry.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Order is not in pending status' });
        }

        order.status = 'rejected';
        order.rejectionReason = reason || 'No reason provided';

        // Add to activity log
        order.activityLog.push({
            status: 'rejected',
            updatedBy: req.user._id,
            updatedAt: new Date(),
            notes: reason || 'Order rejected by employee'
        });

        const updatedOrder = await order.save();
        const populatedOrder = await Laundry.findById(updatedOrder._id)
            .populate('user', 'name email roomNumber hostelBlock')
            .populate('assignedTo', 'name email')
            .populate('activityLog.updatedBy', 'name email');

        res.json(populatedOrder);
    } catch (error) {
        console.error('Error in rejectOrder:', error);
        res.status(500).json({ message: error.message || 'Failed to reject order' });
    }
};

// @desc    Update order status
// @route   PUT /api/employee/orders/:id/status
// @access  Private (Employee)
const updateOrderStatus = async (req, res) => {
    try {
        if (!checkConnection()) {
            return res.status(503).json({ message: 'Database not connected. Please check server configuration.' });
        }

        const { status, notes } = req.body;
        const validStatuses = ['picked_up', 'in_progress', 'washed', 'ironed', 'ready', 'delivered'];

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Laundry.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order is assigned to this employee
        if (order.assignedTo && order.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not assigned to this order' });
        }

        // Validate status progression
        const statusFlow = {
            'accepted': ['picked_up'],
            'picked_up': ['in_progress'],
            'in_progress': ['washed'],
            'washed': ['ironed'],
            'ironed': ['ready'],
            'ready': ['delivered']
        };

        if (statusFlow[order.status] && !statusFlow[order.status].includes(status)) {
            return res.status(400).json({
                message: `Cannot change status from ${order.status} to ${status}. Valid next status: ${statusFlow[order.status].join(', ')}`
            });
        }

        const oldStatus = order.status;
        order.status = status;

        // Update dates based on status
        if (status === 'picked_up' && !order.pickupDate) {
            order.pickupDate = new Date();
        }
        if (status === 'delivered' && !order.deliveryDate) {
            order.deliveryDate = new Date();
        }

        // Add to activity log
        order.activityLog.push({
            status: status,
            updatedBy: req.user._id,
            updatedAt: new Date(),
            notes: notes || `Status changed from ${oldStatus} to ${status}`
        });

        const updatedOrder = await order.save();
        const populatedOrder = await Laundry.findById(updatedOrder._id)
            .populate('user', 'name email roomNumber hostelBlock')
            .populate('assignedTo', 'name email')
            .populate('activityLog.updatedBy', 'name email');

        res.json(populatedOrder);
    } catch (error) {
        console.error('Error in updateOrderStatus:', error);
        res.status(500).json({ message: error.message || 'Failed to update order status' });
    }
};

// @desc    Get single order details
// @route   GET /api/employee/orders/:id
// @access  Private (Employee)
const getOrderDetails = async (req, res) => {
    try {
        if (!checkConnection()) {
            return res.status(503).json({ message: 'Database not connected. Please check server configuration.' });
        }

        const order = await Laundry.findById(req.params.id)
            .populate('user', 'name email roomNumber hostelBlock')
            .populate('assignedTo', 'name email')
            .populate('activityLog.updatedBy', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error in getOrderDetails:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch order details' });
    }
};

module.exports = {
    employeeLogin,
    getAssignedOrders,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    getOrderDetails
};


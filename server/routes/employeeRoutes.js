const express = require('express');
const router = express.Router();
const {
    employeeLogin,
    getAssignedOrders,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    getOrderDetails
} = require('../controllers/employeeController');
const { employeeAuth } = require('../middleware/employeeMiddleware');

// Public routes
router.post('/login', employeeLogin);

// Protected routes (require employee authentication)
router.use(employeeAuth);

router.get('/orders', getAssignedOrders);
router.get('/orders/:id', getOrderDetails);
router.post('/orders/:id/accept', acceptOrder);
router.post('/orders/:id/reject', rejectOrder);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;


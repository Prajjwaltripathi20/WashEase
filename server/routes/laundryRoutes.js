const express = require('express');
const router = express.Router();
const { createLaundryRequest, getMyLaundry, getAllLaundry, updateLaundryStatus, deleteLaundryRequest } = require('../controllers/laundryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createLaundryRequest)
    .get(protect, getMyLaundry);

router.route('/all').get(protect, getAllLaundry); // Add role check later if needed
router.route('/:id')
    .put(protect, updateLaundryStatus)
    .delete(protect, deleteLaundryRequest);

module.exports = router;

const mongoose = require('mongoose');

const activityLogSchema = mongoose.Schema({
    status: { type: String, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedAt: { type: Date, default: Date.now },
    notes: { type: String }
}, { _id: false });

const laundrySchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Employee assigned
    clothes: [
        {
            itemType: { type: String, required: true }, // e.g., Shirt, Pant
            quantity: { type: Number, required: true }
        }
    ],
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'picked_up', 'in_process', 'washed', 'ironed', 'ready', 'delivered'],
        default: 'pending'
    },
    rejectionReason: { type: String }, // If rejected
    pickupDate: { type: Date },
    deliveryDate: { type: Date },
    specialInstructions: { type: String },
    activityLog: [activityLogSchema], // Track all status changes
}, { timestamps: true });

const Laundry = mongoose.model('Laundry', laundrySchema);
module.exports = Laundry;

const mongoose = require('mongoose');

const laundrySchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clothes: [
        {
            itemType: { type: String, required: true }, // e.g., Shirt, Pant
            quantity: { type: Number, required: true }
        }
    ],
    status: {
        type: String,
        enum: ['pending', 'picked_up', 'in_progress', 'ready', 'delivered'],
        default: 'pending'
    },
    pickupDate: { type: Date },
    deliveryDate: { type: Date },
    specialInstructions: { type: String },
}, { timestamps: true });

const Laundry = mongoose.model('Laundry', laundrySchema);
module.exports = Laundry;

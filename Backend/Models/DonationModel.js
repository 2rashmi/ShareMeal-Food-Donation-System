const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationSchema = new Schema({
    donorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    foodType: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0.01 },
    quantityUnit: { type: String, required: true, enum: ["kg", "g", "l", "ml", "pcs", "boxes", "packets", "bottles"] },
    expiryDate: { type: Date, required: true },
    pickupLocation: { type: String, required: true },
    contactInfo: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected", "Claimed", "Assigned", "InProgress", "Delivered"], default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Donation", donationSchema);
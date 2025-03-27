const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationSchema = new Schema({
    donorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    foodType: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    expiryDate: { type: Date, required: true },
    pickupLocation: { type: String, required: true },
    contactInfo: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Claimed", "Assigned", "InProgress", "Delivered"], default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Donation", donationSchema);
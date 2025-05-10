const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
    donationId: { type: Schema.Types.ObjectId, ref: "Donation", required: true },
    deliveryAgentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pickupLocation: { type: String, required: true },
    destinationAddress: { type: String, required: true },
    pickupTime: { type: Date },
    deliveryTime: { type: Date },
    status: { type: String, enum: ["Assigned", "InProgress", "Delivered", "Cancelled"], default: "Assigned" }
});

module.exports = mongoose.model("Delivery", deliverySchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ngoClaimSchema = new Schema({
    donationId: { type: Schema.Types.ObjectId, ref: "Donation", required: true },
    ngoId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pickupDate: { type: Date, required: true },
    contactPerson: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Collected", "Cancelled"], default: "Pending" }
});

module.exports = mongoose.model("NgoClaim", ngoClaimSchema);
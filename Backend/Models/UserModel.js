const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Base user schema with common fields
const baseUserSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Donor", "NGO", "DeliveryAgent"], required: true },
    email: { type: String, required: true, unique: true, trim: true },
    approved: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    rejectionReason: { type: String },
    rejectionDate: { type: Date }
}, { timestamps: true });

// Donor specific fields
const donorSchema = new Schema({
    organizationName: { type: String },
    foodTypePreferences: [{
        type: String,
        enum: ["Cooked Food", "Packaged Food", "Raw Ingredients"]
    }],
    availability: {
        type: String,
        enum: ["Daily", "Weekly", "Monthly"]
    },
    preferredContactMethod: {
        type: String,
        enum: ["Email", "Phone"]
    }
});

// NGO specific fields
const ngoSchema = new Schema({
    ngoName: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    website: { type: String },
    serviceArea: {
        type: String,
        enum: ["City", "District"]
    },
    ngoType: [{
        type: String,
        enum: ["Food Distribution", "Shelter", "Child Welfare"]
    }],
    operatingHours: { type: String }
});

// Delivery Agent specific fields
const deliveryAgentSchema = new Schema({
    vehicleType: {
        type: String,
        enum: ["Bike", "Car", "Truck"]
    },
    licenseNumber: { type: String },
    workAvailability: {
        type: String,
        enum: ["Full-Time", "Part-Time"]
    },
    maxDeliveryCapacity: { type: Number, min: 0 },
    preferredWorkLocations: [{ type: String, trim: true }]
});

// Create the base User model
const User = mongoose.model("User", baseUserSchema);

// Create role-specific models using discriminators
const Donor = User.discriminator("Donor", donorSchema);
const NGO = User.discriminator("NGO", ngoSchema);
const DeliveryAgent = User.discriminator("DeliveryAgent", deliveryAgentSchema);

module.exports = { User, Donor, NGO, DeliveryAgent };
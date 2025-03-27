const Donation = require("../models/Donation");
const Request = require("../models/Request");
const Delivery = require("../models/Delivery");
const User = require("../models/User");

// ==========================
// DONATION CONTROLLERS
// ==========================

// Create a new donation
exports.createDonation = async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json({ message: "Donation submitted successfully", donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all donations
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve/Reject a donation
exports.updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    res.status(200).json({ message: "Donation status updated", donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// REQUEST CONTROLLERS
// ==========================

// Create a new food request
exports.createRequest = async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();
    res.status(201).json({ message: "Request submitted successfully", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all food requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve/Reject a request
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.status(200).json({ message: "Request status updated", request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// DELIVERY CONTROLLERS
// ==========================

// Assign a delivery
exports.createDelivery = async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    await delivery.save();
    res.status(201).json({ message: "Delivery assigned successfully", delivery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find().populate("donationId requestId");
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update delivery status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryStatus } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, { deliveryStatus }, { new: true });
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });
    res.status(200).json({ message: "Delivery status updated", delivery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// USER CONTROLLERS
// ==========================

// Register a new user (Admin, Donor, or Delivery Person)
exports.registerUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

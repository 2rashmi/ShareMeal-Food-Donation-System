const Donation = require("../Models/DonationModel");
const NgoClaim = require("../Models/NgoClaimModel");
const mongoose = require("mongoose");

const addDonation = async (req, res) => {
    const { donorId, foodType, quantity, expiryDate, pickupLocation, contactInfo } = req.body;
    try {
        const donation = new Donation({ donorId, foodType, quantity, expiryDate, pickupLocation, contactInfo });
        await donation.save();
        res.status(201).json({ donation });
    } catch (err) {
        res.status(500).json({ message: "Error adding donation", error: err });
    }
};

const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find().populate("donorId", "username");
        res.status(200).json({ donations });
    } catch (err) {
        res.status(500).json({ message: "Error fetching donations", error: err });
    }
};

const getDonationById = async (req, res) => {
    const { id } = req.params;
    try {
        const donation = await Donation.findById(id).populate("donorId", "username");
        if (!donation) return res.status(404).json({ message: "Donation not found" });
        res.status(200).json({ donation });
    } catch (err) {
        res.status(500).json({ message: "Error fetching donation", error: err });
    }
};

const updateDonation = async (req, res) => {
    const { id } = req.params;
    const { status, foodType, quantity, expiryDate, pickupLocation, contactInfo } = req.body;
    try {
        const donation = await Donation.findById(id);
        if (!donation) return res.status(404).json({ message: "Donation not found" });

        // Handle status updates (approval/rejection)
        if (status) {
            if (donation.status === "Claimed" || donation.status === "Assigned" || donation.status === "InProgress" || donation.status === "Delivered") {
                return res.status(403).json({ message: "Cannot update status of donation that is already in process" });
            }
            if (!["Approved", "Rejected", "Pending", "Claimed", "Assigned", "InProgress", "Delivered"].includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }
            donation.status = status;
        }

        // Handle other field updates
        if (foodType) donation.foodType = foodType;
        if (quantity) donation.quantity = quantity;
        if (expiryDate) donation.expiryDate = expiryDate;
        if (pickupLocation) donation.pickupLocation = pickupLocation;
        if (contactInfo) donation.contactInfo = contactInfo;

        await donation.save();
        res.status(200).json({ donation });
    } catch (err) {
        res.status(500).json({ message: "Error updating donation", error: err });
    }
};

const deleteDonation = async (req, res) => {
    const { id } = req.params;
    try {
        const donation = await Donation.findById(id);
        if (!donation) {
            console.error("Donation not found:", id);
            return res.status(404).json({ message: "Donation not found" });
        }
        
        // Only prevent deletion of donations that are in process
        if (donation.status === "Claimed" || donation.status === "Assigned" || donation.status === "InProgress" || donation.status === "Delivered") {
            console.error("Cannot delete donation in status:", donation.status);
            return res.status(403).json({ message: "Cannot delete donation that is already in process" });
        }
        
        // Delete any associated claims first
        try {
            const deleteClaimsResult = await NgoClaim.deleteMany({ donationId: id });
            console.log("Deleted associated claims:", deleteClaimsResult);
        } catch (claimErr) {
            console.error("Error deleting associated claims:", claimErr);
        }
        
        const deleteResult = await Donation.findByIdAndDelete(id);
        console.log("Delete result:", deleteResult);
        
        res.status(200).json({ message: "Donation deleted successfully" });
    } catch (err) {
        console.error("Error deleting donation:", err);
        res.status(500).json({ 
            message: "Error deleting donation", 
            error: err.message
        });
    }
};

exports.addDonation = addDonation;
exports.getAllDonations = getAllDonations;
exports.getDonationById = getDonationById;
exports.updateDonation = updateDonation;
exports.deleteDonation = deleteDonation;
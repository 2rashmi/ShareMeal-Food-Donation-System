const Donation = require("../Models/DonationModel");
const NgoClaim = require("../Models/NgoClaimModel");
const mongoose = require("mongoose");
const { User } = require("../Models/UserModel");
const sendEmail = require("../utils/email");

const addDonation = async (req, res) => {
    const { donorId, foodType, quantity, quantityUnit, expiryDate, pickupLocation, contactInfo } = req.body;
    try {
        const donation = new Donation({ 
            donorId, 
            foodType, 
            quantity, 
            quantityUnit,
            expiryDate, 
            pickupLocation, 
            contactInfo 
        });
        await donation.save();
        res.status(201).json({ donation });
    } catch (err) {
        console.error("Error adding donation:", err);
        res.status(500).json({ message: "Error adding donation", error: err.message });
    }
};

const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find()
            .populate({
                path: "donorId",
                select: "username _id"
            })
            .select('foodType quantity quantityUnit expiryDate pickupLocation contactInfo status createdAt donorId');
        
        console.log("Sending donations:", donations); // Debug log
        res.status(200).json({ donations });
    } catch (err) {
        console.error("Error fetching donations:", err);
        res.status(500).json({ message: "Error fetching donations", error: err.message });
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
    const { status, foodType, quantity, quantityUnit, expiryDate, pickupLocation, contactInfo } = req.body;
    try {
        const donation = await Donation.findById(id);
        if (!donation) return res.status(404).json({ message: "Donation not found" });

        let statusChanged = false;
        // Handle status updates (approval/rejection)
        if (status) {
            if (donation.status === "Claimed" || donation.status === "Assigned" || donation.status === "InProgress" || donation.status === "Delivered") {
                return res.status(403).json({ message: "Cannot update status of donation that is already in process" });
            }
            if (!["Approved", "Rejected", "Pending", "Claimed", "Assigned", "InProgress", "Delivered"].includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }
            if (donation.status !== status) {
                donation.status = status;
                statusChanged = true;
            }
        }

        // Handle other field updates
        if (foodType) donation.foodType = foodType;
        if (quantity) donation.quantity = quantity;
        if (quantityUnit) donation.quantityUnit = quantityUnit;
        if (expiryDate) donation.expiryDate = expiryDate;
        if (pickupLocation) donation.pickupLocation = pickupLocation;
        if (contactInfo) donation.contactInfo = contactInfo;

        await donation.save();

        // Send email if status changed
        if (statusChanged) {
            // Find donor's email
            const donor = await User.findById(donation.donorId);
            if (donor && donor.email) {
                let subject = 'Donation Status Update';
                let message = `Your donation status has been updated to: ${donation.status}`;
                console.log(`Attempting to send email to: ${donor.email}`);
                try {
                    await sendEmail(donor.email, subject, message);
                    console.log('Email sent successfully');
                } catch (emailErr) {
                    console.error('Failed to send email:', emailErr);
                }
            } else {
                console.log('No donor email found for donation:', donation._id);
            }
        }

        res.status(200).json({ donation });
    } catch (err) {
        console.error("Error updating donation:", err);
        res.status(500).json({ message: "Error updating donation", error: err.message });
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
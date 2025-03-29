const NgoClaim = require("../Models/NgoClaimModel");
const Donation = require("../Models/DonationModel");

const claimDonation = async (req, res) => {
    const { donationId, ngoId, pickupDate, contactPerson } = req.body;
    try {
        console.log("Attempting to claim donation:", donationId);
        
        // First check for existing claims
        const existingClaim = await NgoClaim.findOne({ donationId });
        if (existingClaim) {
            console.log("Found existing claim for donation:", donationId);
            return res.status(403).json({ 
                message: "This donation has already been claimed by another NGO" 
            });
        }

        // Then check donation status
        const donation = await Donation.findById(donationId);
        if (!donation) {
            console.log("Donation not found:", donationId);
            return res.status(404).json({ message: "Donation not found" });
        }

        console.log("Donation status:", donation.status);
        if (donation.status !== "Approved") {
            return res.status(403).json({ 
                message: `Cannot claim donation with status: ${donation.status}. Only approved donations can be claimed.` 
            });
        }
        
        // Create the claim first
        console.log("Creating new claim for donation:", donationId);
        const claim = new NgoClaim({ donationId, ngoId, pickupDate, contactPerson });
        await claim.save();
        
        // Then update the donation status
        try {
            console.log("Updating donation status to Claimed:", donationId);
            const updatedDonation = await Donation.findByIdAndUpdate(
                donationId, 
                { status: "Claimed" },
                { new: true }
            );
            console.log("Updated donation status:", updatedDonation.status);
        } catch (updateErr) {
            console.error("Error updating donation status:", updateErr);
            // If status update fails, delete the claim and return error
            await NgoClaim.findByIdAndDelete(claim._id);
            return res.status(500).json({ 
                message: "Failed to update donation status. Please try again.",
                error: updateErr.message 
            });
        }
        
        res.status(201).json({ claim });
    } catch (err) {
        console.error("Error in claimDonation:", err);
        res.status(500).json({ message: "Error claiming donation", error: err.message });
    }
};

const getAllClaims = async (req, res) => {
    try {
        const claims = await NgoClaim.find()
            .populate({
                path: "donationId",
                select: "foodType quantity expiryDate pickupLocation contactInfo"
            })
            .populate({
                path: "ngoId",
                select: "username _id"
            });
        console.log("Fetched claims:", claims);
        res.status(200).json({ claims });
    } catch (err) {
        console.error("Error fetching claims:", err);
        res.status(500).json({ message: "Error fetching claims", error: err.message });
    }
};

const updateClaim = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const claim = await NgoClaim.findByIdAndUpdate(id, { status }, { new: true });
        if (!claim) return res.status(404).json({ message: "Claim not found" });
        res.status(200).json({ claim });
    } catch (err) {
        res.status(500).json({ message: "Error updating claim", error: err });
    }
};

const deleteClaim = async (req, res) => {
    const { id } = req.params;
    try {
        const claim = await NgoClaim.findById(id);
        if (claim.status === "Collected") return res.status(403).json({ message: "Cannot delete collected claim" });
        await NgoClaim.findByIdAndDelete(id);
        await Donation.findByIdAndUpdate(claim.donationId, { status: "Approved" });
        res.status(200).json({ message: "Claim deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting claim", error: err });
    }
};

exports.claimDonation = claimDonation;
exports.getAllClaims = getAllClaims;
exports.updateClaim = updateClaim;
exports.deleteClaim = deleteClaim;
const Donation = require("../Models/DonationModel");
const NgoClaim = require("../Models/NgoClaimModel");
const Delivery = require("../Models/DeliveryModel");

const generateDonationReport = async (req, res) => {
    try {
        console.log("Generating donation report...");
        const donations = await Donation.find()
            .populate({
                path: 'donorId',
                select: 'username email'
            });
        console.log(`Found ${donations.length} donations`);
        
        const report = {
            totalDonations: donations.length,
            donationsByStatus: {
                Pending: donations.filter(d => d.status === "Pending").length,
                Approved: donations.filter(d => d.status === "Approved").length,
                Claimed: donations.filter(d => d.status === "Claimed").length,
                Delivered: donations.filter(d => d.status === "Delivered").length,
                Rejected: donations.filter(d => d.status === "Rejected").length
            },
            donationsByFoodType: {},
            recentDonations: donations.slice(-5).map(d => ({
                id: d._id,
                foodType: d.foodType,
                quantity: d.quantity,
                status: d.status,
                donorId: d.donorId,
                date: d.createdAt
            }))
        };

        // Calculate donations by food type
        donations.forEach(donation => {
            report.donationsByFoodType[donation.foodType] = 
                (report.donationsByFoodType[donation.foodType] || 0) + 1;
        });

        console.log("Donation report generated successfully");
        res.status(200).json(report);
    } catch (err) {
        console.error("Error generating donation report:", err);
        res.status(500).json({ message: "Error generating donation report", error: err.message });
    }
};
const generateClaimsReport = async (req, res) => {
    try {
        console.log("Generating claims report...");
        const claims = await NgoClaim.find()
            .populate({
                path: 'donationId',
                select: 'foodType quantity'
            })
            .populate({
                path: 'ngoId',
                select: 'username email'
            });
        console.log(`Found ${claims.length} claims`);
        
        const report = {
            totalClaims: claims.length,
            claimsByStatus: {
                Pending: claims.filter(c => c.status === "Pending").length,
                Approved: claims.filter(c => c.status === "Approved").length,
                Collected: claims.filter(c => c.status === "Collected").length,
                Cancelled: claims.filter(c => c.status === "Cancelled").length
            },
            recentClaims: claims.slice(-5).map(c => ({
                id: c._id,
                foodType: c.donationId?.foodType || 'Unknown',
                quantity: c.donationId?.quantity || 'Unknown',
                status: c.status,
                ngoId: c.ngoId,
                date: c.createdAt
            }))
        };

        console.log("Claims report generated successfully");
        res.status(200).json(report);
    } catch (err) {
        console.error("Error generating claims report:", err);
        res.status(500).json({ message: "Error generating claims report", error: err.message });
    }
};

// Generate Delivery Report
const generateDeliveryReport = async (req, res) => {
    try {
        console.log("Generating delivery report...");
        const deliveries = await Delivery.find()
            .populate('donationId', 'foodType quantity')
            .populate('deliveryAgentId', 'username email');
        console.log(`Found ${deliveries.length} deliveries`);
        
        const report = {
            totalDeliveries: deliveries.length,
            deliveriesByStatus: {
                Assigned: deliveries.filter(d => d.status === "Assigned").length,
                InProgress: deliveries.filter(d => d.status === "InProgress").length,
                Delivered: deliveries.filter(d => d.status === "Delivered").length,
                Cancelled: deliveries.filter(d => d.status === "Cancelled").length
            },
            recentDeliveries: deliveries.slice(-5).map(d => ({
                id: d._id,
                foodType: d.donationId?.foodType || 'Unknown',
                quantity: d.donationId?.quantity || 'Unknown',
                status: d.status || 'Unknown',
                deliveryAgent: d.deliveryAgentId?.username || 'Unknown',
                date: d.createdAt
            }))
        };

        console.log("Delivery report generated successfully");
        res.status(200).json(report);
    } catch (err) {
        console.error("Error generating delivery report:", err);
        res.status(500).json({ message: "Error generating delivery report", error: err.message });
    }
};


module.exports = {
    generateDonationReport,
    generateClaimsReport,
    generateDeliveryReport
}; 
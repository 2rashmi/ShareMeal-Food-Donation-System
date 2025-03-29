const Donation = require("../Models/DonationModel");


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

module.exports = {
    generateDonationReport,
    generateClaimsReport
}; 
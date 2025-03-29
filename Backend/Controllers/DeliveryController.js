const Delivery = require("../Models/DeliveryModel");
const Donation = require("../Models/DonationModel");

const assignDelivery = async (req, res) => {
    const { donationId, deliveryAgentId } = req.body;
    try {
        const donation = await Donation.findById(donationId);
        if (donation.status !== "Claimed") return res.status(403).json({ message: "Donation not claimed yet" });
        const delivery = new Delivery({ donationId, deliveryAgentId });
        await delivery.save();
        await Donation.findByIdAndUpdate(donationId, { status: "Assigned" });
        res.status(201).json({ delivery });
    } catch (err) {
        res.status(500).json({ message: "Error assigning delivery", error: err });
    }
};

const getAllDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find()
            .populate({
                path: "donationId",
                select: "foodType quantity expiryDate pickupLocation contactInfo",
                populate: {
                    path: "donorId",
                    select: "username _id"
                }
            })
            .populate({
                path: "deliveryAgentId",
                select: "username _id"
            });
        console.log("Fetched deliveries:", deliveries);
        res.status(200).json({ deliveries });
    } catch (err) {
        console.error("Error fetching deliveries:", err);
        res.status(500).json({ message: "Error fetching deliveries", error: err.message });
    }
};

const getDeliveryById = async (req, res) => {
    const { id } = req.params;
    try {
        const delivery = await Delivery.findById(id)
            .populate({
                path: "donationId",
                populate: {
                    path: "donorId",
                    select: "username"
                }
            })
            .populate("deliveryAgentId", "username");
        if (!delivery) return res.status(404).json({ message: "Delivery not found" });
        res.status(200).json({ delivery });
    } catch (err) {
        res.status(500).json({ message: "Error fetching delivery", error: err });
    }
};

const updateDelivery = async (req, res) => {
    const { id } = req.params;
    const { status, pickupTime, deliveryTime } = req.body;
    try {
        const delivery = await Delivery.findByIdAndUpdate(id, { status, pickupTime, deliveryTime }, { new: true });
        if (!delivery) return res.status(404).json({ message: "Delivery not found" });
        if (status === "InProgress") await Donation.findByIdAndUpdate(delivery.donationId, { status: "InProgress" });
        if (status === "Delivered") await Donation.findByIdAndUpdate(delivery.donationId, { status: "Delivered" });
        res.status(200).json({ delivery });
    } catch (err) {
        res.status(500).json({ message: "Error updating delivery", error: err });
    }
};

const deleteDelivery = async (req, res) => {
    const { id } = req.params;
    try {
        const delivery = await Delivery.findById(id);
        if (delivery.status === "Delivered") return res.status(403).json({ message: "Cannot delete delivered delivery" });
        await Delivery.findByIdAndDelete(id);
        await Donation.findByIdAndUpdate(delivery.donationId, { status: "Claimed" });
        res.status(200).json({ message: "Delivery deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting delivery", error: err });
    }
};

exports.assignDelivery = assignDelivery;
exports.getAllDeliveries = getAllDeliveries;
exports.getDeliveryById = getDeliveryById;
exports.updateDelivery = updateDelivery;
exports.deleteDelivery = deleteDelivery;
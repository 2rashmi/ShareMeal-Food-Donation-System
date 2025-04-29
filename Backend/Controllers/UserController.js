const { User, Donor, NGO, DeliveryAgent } = require("../Models/UserModel");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
    const { username, password, role, email, ...roleSpecificData } = req.body;
    
    try {
        if (!username || !password || !role || !email) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let user;
        switch (role) {
            case "Donor":
                user = new Donor({ username, password: hashedPassword, role, email, ...roleSpecificData });
                break;
            case "NGO":
                user = new NGO({ username, password: hashedPassword, role, email, ...roleSpecificData });
                break;
            case "DeliveryAgent":
                user = new DeliveryAgent({ username, password: hashedPassword, role, email, ...roleSpecificData });
                break;
            default:
                return res.status(400).json({ message: "Invalid role" });
        }

        await user.save();
        res.status(201).json({ message: "User registered, awaiting approval", userId: user._id });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !user.approved) {
            return res.status(401).json({ message: "User not found or not approved" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.status(200).json({ 
            user: { 
                id: user._id, 
                role: user.role, 
                username: user.username,
                email: user.email 
            } 
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
};

const approveUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { approved: true, rejected: false },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User approved successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Error approving user", error: err.message });
    }
};

const rejectUser = async (req, res) => {
    const { rejectionReason } = req.body;
    try {
        if (!rejectionReason) {
            return res.status(400).json({ message: "Rejection reason is required" });
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { rejected: true, approved: false, rejectionReason, rejectionDate: new Date() },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User rejected successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error rejecting user", error: err.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: "Error fetching user profile", error: err.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updateData = req.body;

        // Validate and update email
        if (updateData.email && updateData.email !== user.email) {
            const emailExists = await User.findOne({ email: updateData.email });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = updateData.email;
        }

        // Update role-specific fields
        switch (user.role) {
            case "Donor":
                user.organizationName = updateData.organizationName || user.organizationName;
                user.foodTypePreferences = updateData.foodTypePreferences || user.foodTypePreferences;
                user.availability = updateData.availability || user.availability;
                user.preferredContactMethod = updateData.preferredContactMethod || user.preferredContactMethod;
                break;
            case "NGO":
                user.ngoName = updateData.ngoName || user.ngoName;
                user.registrationNumber = updateData.registrationNumber || user.registrationNumber;
                user.website = updateData.website || user.website;
                user.serviceArea = updateData.serviceArea || user.serviceArea;
                user.ngoType = updateData.ngoType || user.ngoType;
                user.operatingHours = updateData.operatingHours || user.operatingHours;
                break;
            case "DeliveryAgent":
                user.vehicleType = updateData.vehicleType || user.vehicleType;
                user.licenseNumber = updateData.licenseNumber || user.licenseNumber;
                user.workAvailability = updateData.workAvailability || user.workAvailability;
                user.maxDeliveryCapacity = updateData.maxDeliveryCapacity || user.maxDeliveryCapacity;
                user.preferredWorkLocations = updateData.preferredWorkLocations || user.preferredWorkLocations;
                break;
        }

        const updatedUser = await user.save();
        res.status(200).json({ 
            message: "Profile updated successfully", 
            user: updatedUser.toObject({ getters: true }) 
        });
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ message: "Error updating profile", error: err.message });
    }
};

const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting profile", error: err.message });
    }
};

exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getAllUsers = getAllUsers;
exports.approveUser = approveUser;
exports.rejectUser = rejectUser;
exports.getUserProfile = getUserProfile;
exports.updateUserProfile = updateUserProfile;
exports.deleteUserProfile = deleteUserProfile;
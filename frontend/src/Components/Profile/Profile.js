import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import "./Profile.css";

function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/users/profile/${currentUser.id}`);
                setUser(res.data.user);
                setFormData(res.data.user);
            } catch (err) {
                setError("Failed to fetch profile: " + (err.response?.data?.message || err.message));
            }
        };
        fetchUserProfile();
    }, [currentUser.id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            const field = name;
            setFormData(prev => {
                const currentValues = prev[field] || [];
                if (checked) {
                    return { ...prev, [field]: [...currentValues, value] };
                } else {
                    return { ...prev, [field]: currentValues.filter(v => v !== value) };
                }
            });
        } else if (name === "preferredWorkLocations") {
            const locations = value.split(",").map(loc => loc.trim()).filter(loc => loc);
            setFormData(prev => ({ ...prev, [name]: locations }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            if (!validateForm()) {
                return;
            }

            const res = await axios.put(`http://localhost:5001/users/profile/${currentUser.id}`, formData);
            setUser(res.data.user);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            setError("Failed to update profile: " + (err.response?.data?.message || err.message));
        }
    };

    const validateForm = () => {
        if (!formData.email) {
            setError("Email is required");
            return false;
        }

        switch (user.role) {
            case "Donor":
                if (!formData.availability || !formData.preferredContactMethod) {
                    setError("Please fill in all required fields");
                    return false;
                }
                break;
            case "NGO":
                if (!formData.ngoName || !formData.registrationNumber || !formData.serviceArea || !formData.operatingHours) {
                    setError("Please fill in all required fields");
                    return false;
                }
                break;
            case "DeliveryAgent":
                if (!formData.vehicleType || !formData.licenseNumber || !formData.workAvailability || !formData.maxDeliveryCapacity) {
                    setError("Please fill in all required fields");
                    return false;
                }
                break;
        }
        return true;
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5001/users/profile/${currentUser.id}`);
            localStorage.removeItem("user");
            navigate("/login");
        } catch (err) {
            setError("Failed to delete profile: " + (err.response?.data?.message || err.message));
        }
    };

    const renderRoleSpecificFields = () => {
        if (!user) return null;

        switch (user.role) {
            case "Donor":
                return (
                    <>
                    <label>Organization Name:</label>
                        <div className="form-group">
                            
                            <input
                                type="text"
                                name="organizationName"
                                value={formData.organizationName || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        
                        <label>Availability:</label>
                        <div className="form-group">
                            
                            <select
                                name="availability"
                                value={formData.availability || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                            >
                                <option value="">Select Availability</option>
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </div>

                        <label>Preferred Contact Method:</label>
                        <div className="form-group">
                            
                            <select
                                name="preferredContactMethod"
                                value={formData.preferredContactMethod || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                            >
                                <option value="">Select Contact Method</option>
                                <option value="Email">Email</option>
                                <option value="Phone">Phone</option>
                            </select>
                        </div>
                    </>
                );
            case "NGO":
                return (
                    <>
                        <label>NGO Name:</label>
                        <div className="form-group">
                           
                            <input
                                type="text"
                                name="ngoName"
                                value={formData.ngoName || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <label>Registration Number:</label>
                        <div className="form-group">
                           
                            <input
                                type="text"
                                name="registrationNumber"
                                value={formData.registrationNumber || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <label>Website:</label>
                        <div className="form-group">
                            
                            <input
                                type="text"
                                name="website"
                                value={formData.website || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <label>Service Area:</label>
                        <div className="form-group">
                            
                            <select
                                name="serviceArea"
                                value={formData.serviceArea || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                            >
                                <option value="">Select Service Area</option>
                                <option value="City">City</option>
                                <option value="District">District</option>
                            </select>
                        </div>

                        

                        <label>Operating Hours:</label>
                        <div className="form-group">
                            
                            <input
                                type="text"
                                name="operatingHours"
                                value={formData.operatingHours || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>
                    </>
                );
            case "DeliveryAgent":
                return (
                    <>
                        <label>Vehicle Type:</label>
                        <div className="form-group">
                           
                            <select
                                name="vehicleType"
                                value={formData.vehicleType || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                            >
                                <option value="">Select Vehicle Type</option>
                                <option value="Bike">Bike</option>
                                <option value="Car">Car</option>
                                <option value="Truck">Truck</option>
                            </select>
                        </div>

                        <label>License Number:</label>
                        <div className="form-group">
                           
                            <input
                                type="text"
                                name="licenseNumber"
                                value={formData.licenseNumber || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <label>Work Availability:</label>
                        <div className="form-group">
                            
                            <select
                                name="workAvailability"
                                value={formData.workAvailability || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                            >
                                <option value="">Select Work Availability</option>
                                <option value="Full-Time">Full-Time</option>
                                <option value="Part-Time">Part-Time</option>
                            </select>
                        </div>

                        <label>Max Delivery Capacity:</label>
                        <div className="form-group">
                            
                            <input
                                type="number"
                                name="maxDeliveryCapacity"
                                value={formData.maxDeliveryCapacity || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <label>Preferred Work Locations:</label>
                        <div className="form-group">
                            
                            <input
                                type="text"
                                name="preferredWorkLocations"
                                value={formData.preferredWorkLocations?.join(", ") || ""}
                                onChange={(e) => {
                                    const locations = e.target.value.split(",").map(loc => loc.trim());
                                    setFormData(prev => ({ ...prev, preferredWorkLocations: locations }));
                                }}
                                disabled={!isEditing}
                            />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container">
            <Nav />
            <div className="profile-form">
                <h1>Profile</h1>
                <label>Username:</label>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        
                        <input
                            type="text"
                            value={user.username}
                            disabled
                        />
                    </div>

                    <label>Email: <span className="required">*</span></label>
                    <div className="form-group">
                        
                        <input
                            type="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>
                    {renderRoleSpecificFields()}
                </form>
                
                <div className="profile-actions">
                    {!isEditing ? (
                        <>
                            <button type="button" className="btn edit" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                            <button type="button" className="btn delete" onClick={() => setShowDeleteConfirm(true)}>
                                Delete Profile
                            </button>
                        </>
                    ) : (
                        <>
                            <button type="button" className="btn save" onClick={handleSubmit}>
                                Save Changes
                            </button>
                            <button type="button" className="btn cancel" onClick={() => {
                                setIsEditing(false);
                                setFormData(user);
                                setError("");
                            }}>
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Delete Profile</h2>
                        <p>Are you sure you want to delete your profile? This action cannot be undone.</p>
                        <div className="modal-buttons">
                            <button onClick={handleDelete} className="btn delete">
                                Confirm Delete
                            </button>
                            <button onClick={() => setShowDeleteConfirm(false)} className="btn cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile; 
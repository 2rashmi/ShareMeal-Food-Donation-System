import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../Nav/Nav";
import "../../App.css";

function UpdateDonation() {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    // Get current date and time in local timezone
    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Format date for datetime-local input
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Format date for server
    const formatDateForServer = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toISOString();
    };

    const validateContactInfo = (value) => {
        if (!value) return false;
        const numbersOnly = value.toString().replace(/\D/g, '');
        return numbersOnly.length === 10;
    };

    const validateExpiryDate = (date) => {
        if (!date) return false;
        const selectedDate = new Date(date);
        const currentDate = new Date();
        return selectedDate > currentDate;
    };

    useEffect(() => {
        const fetchDonation = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/donations/${id}`);
                setInputs(res.data.donation);
            } catch (err) {
                console.error("Error fetching donation:", err);
                alert("Failed to fetch donation details");
                navigate("/donor");
            }
        };
        fetchDonation();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "contactInfo") {
            // Only allow numbers and limit to 10 digits
            const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
            setInputs(prev => ({ ...prev, [name]: numbersOnly }));
            if (!validateContactInfo(numbersOnly)) {
                setErrors(prev => ({ ...prev, contactInfo: "Contact number must be exactly 10 digits" }));
            } else {
                setErrors(prev => ({ ...prev, contactInfo: null }));
            }
        } else if (name === "expiryDate") {
            if (validateExpiryDate(value)) {
                setInputs(prev => ({ ...prev, [name]: value }));
                setErrors(prev => ({ ...prev, expiryDate: null }));
            } else {
                setErrors(prev => ({ 
                    ...prev, 
                    expiryDate: "Expiry date must be in the future" 
                }));
            }
        } else {
            setInputs(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateContactInfo(inputs.contactInfo)) {
            return;
        }

        if (!validateExpiryDate(inputs.expiryDate)) {
            return;
        }

        try {
            // Format the data before sending to server
            const updateData = {
                ...inputs,
                expiryDate: formatDateForServer(inputs.expiryDate)
            };
            
            await axios.put(`http://localhost:5001/donations/${id}`, updateData);
            alert("Donation updated successfully!");
            navigate("/donor");
        } catch (err) {
            alert("Failed to update donation: " + err.response.data.message);
        }
    };

    return (
        <div className="page-container">
            <Nav />
            <div className="content-container">
                <div className="form-card">
                    <div className="form-header">
                        <h1>Update Donation</h1>
                        <p>Update your donation details</p>
                    </div>
                    <form onSubmit={handleSubmit} className="donation-form">
                        <div className="form-group">
                            <label htmlFor="foodType">Food Type</label>
                            <input
                                type="text"
                                id="foodType"
                                name="foodType"
                                value={inputs.foodType || ""}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Rice, Vegetables, Fruits"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="quantity">Quantity</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={inputs.quantity || ""}
                                onChange={handleChange}
                                required
                                placeholder="Enter quantity"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="expiryDate">Expiry Date & Time</label>
                            <input
                                type="datetime-local"
                                id="expiryDate"
                                name="expiryDate"
                                value={formatDateForInput(inputs.expiryDate)}
                                onChange={handleChange}
                                required
                                min={getCurrentDateTime()}
                            />
                            {errors.expiryDate && (
                                <div className="error-message">{errors.expiryDate}</div>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="pickupLocation">Pickup Location</label>
                            <input
                                type="text"
                                id="pickupLocation"
                                name="pickupLocation"
                                value={inputs.pickupLocation || ""}
                                onChange={handleChange}
                                required
                                placeholder="Enter pickup address"
                            />
                        </div>
                        <div className="form-group contact-input">
                            <label htmlFor="contactInfo">Contact Number</label>
                            <input
                                type="tel"
                                id="contactInfo"
                                name="contactInfo"
                                value={inputs.contactInfo || ""}
                                onChange={handleChange}
                                required
                                placeholder="Enter 10-digit contact number"
                                pattern="[0-9]{10}"
                                maxLength="10"
                            />
                            <div className={`char-counter ${validateContactInfo(inputs.contactInfo) ? 'valid' : ''}`}>
                                {(inputs.contactInfo || "").length}/10
                            </div>
                            {errors.contactInfo && (
                                <div className="error-message">{errors.contactInfo}</div>
                            )}
                        </div>
                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={!validateContactInfo(inputs.contactInfo) || !validateExpiryDate(inputs.expiryDate)}
                            >
                                Update Donation
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => navigate("/donor")}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateDonation;
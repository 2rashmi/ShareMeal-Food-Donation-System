import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import "./Donation.css";

function AddDonation() {
    const [inputs, setInputs] = useState({
        foodType: "",
        quantity: "",
        quantityUnit: "kg", // Default unit
        expiryDate: "",
        pickupLocation: "",
        contactInfo: ""
    });
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "contactInfo") {
            // Only allow numbers and limit to 10 digits
            const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
            setInputs(prev => ({ ...prev, [name]: numericValue }));
        } else if (name === "expiryDate") {
            // Simply set the value as is, without any timezone conversion
            setInputs(prev => ({ ...prev, [name]: value }));
        } else if (name === "foodType") {
            // Only allow letters and spaces, with a maximum of 50 characters
            const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
            setInputs(prev => ({ ...prev, [name]: lettersOnly }));
        } else {
            setInputs(prev => ({ ...prev, [name]: value }));
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate food type
            if (!/^[a-zA-Z\s]+$/.test(inputs.foodType)) {
                alert("Food type can only contain letters and spaces");
                return;
            }
            // Convert quantity to number and keep unit separate
            const donationData = {
                ...inputs,
                quantity: parseFloat(inputs.quantity),
                quantityUnit: inputs.quantityUnit,
                donorId: user.id
            };
            console.log("Sending donation data:", donationData); // Debug log
            const response = await axios.post("http://localhost:5001/donations", donationData);
            console.log("Server response:", response.data); // Debug log
            alert("Donation added successfully!");
            navigate("/donor");
        } catch (err) {
            console.error("Error details:", err.response?.data);
            alert("Failed to add donation: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="page-container">
            <Nav />
            <div className="content-container">
                <div className="form-card">
                    <div className="form-header">
                        <h1>Add New Donation</h1>
                        <p>Share your surplus food to help those in need</p>
                    </div>
                    <form onSubmit={handleSubmit} className="donation-form">
                    <label htmlFor="foodType">Food Type</label>
                        <div className="form-group">
                            <input
                                type="text"
                                id="foodType"
                                name="foodType"
                                value={inputs.foodType}
                                onChange={handleChange}
                                required
                                pattern="[a-zA-Z\s]+"
                                maxLength="50"
                                title="Please enter only letters and spaces"
                                placeholder="e.g., Rice, Vegetables, Fruits"
                            />
                            <small className="form-text text-muted">Enter only letters and spaces (maximum 50 characters)</small>
                        </div>
                        <label htmlFor="quantity">Quantity</label>
                        <div className="form-group quantity-group">
                            <div className="quantity-inputs">
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={inputs.quantity}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter quantity"
                                />
                                <select
                                    id="quantityUnit"
                                    name="quantityUnit"
                                    value={inputs.quantityUnit}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="kg">Kilograms (kg)</option>
                                    <option value="g">Grams (g)</option>
                                    <option value="l">Liters (l)</option>
                                    <option value="ml">Milliliters (ml)</option>
                                    <option value="pcs">Pieces (pcs)</option>
                                    <option value="boxes">Boxes</option>
                                    <option value="packets">Packets</option>
                                    <option value="bottles">Bottles</option>
                                </select>
                            </div>
                            <small className="form-text text-muted">Enter the quantity and select the appropriate unit</small>
                        </div>
                        <label htmlFor="expiryDate">Expiry Date</label>
                        <div className="form-group">
                            <input
                                type="datetime-local"
                                id="expiryDate"
                                name="expiryDate"
                                value={inputs.expiryDate}
                                onChange={handleChange}
                                required
                                min={getCurrentDateTime()}
                                title="Please select a future date and time"
                            />
                            <small className="form-text text-muted">Select a future date and time for food expiry</small>
                        </div>
                        <label htmlFor="pickupLocation">Pickup Location</label>
                        <div className="form-group">
                            
                            <input
                                type="text"
                                id="pickupLocation"
                                name="pickupLocation"
                                value={inputs.pickupLocation}
                                onChange={handleChange}
                                required
                                placeholder="Enter pickup address"
                            />
                        </div>

                        <label htmlFor="contactInfo">Contact Information</label>
                        <div className="form-group">
                            <input
                                type="tel"
                                id="contactInfo"
                                name="contactInfo"
                                value={inputs.contactInfo}
                                onChange={handleChange}
                                required
                                pattern="[0-9]{10}"
                                maxLength="10"
                                placeholder="Enter 10-digit phone number"
                                title="Please enter exactly 10 digits"
                            />
                            <small className="form-text text-muted">Enter a 10-digit phone number</small>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                Add Donation
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

export default AddDonation;
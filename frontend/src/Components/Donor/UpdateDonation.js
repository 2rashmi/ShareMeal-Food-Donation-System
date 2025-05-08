import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../Nav/Nav";
import "../../App.css";

function UpdateDonation() {
    const [inputs, setInputs] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDonation = async () => {
            const res = await axios.get(`http://localhost:5001/donations/${id}`);
            setInputs(res.data.donation);
        };
        fetchDonation();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "expiryDate") {
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
            // Convert quantity to number
            const donationData = {
                ...inputs,
                quantity: parseFloat(inputs.quantity)
            };
            await axios.put(`http://localhost:5001/donations/${id}`, donationData);
            navigate("/donor");
        } catch (err) {
            console.error("Error details:", err.response?.data);
            alert("Failed to update donation: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="container">
            <Nav />
            <h1>Update Donation</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="foodType" value={inputs.foodType || ""} onChange={handleChange} required 
                    pattern="[a-zA-Z\s]+" maxLength="50" title="Please enter only letters and spaces" /><br />
                <div className="form-group quantity-group">
                    <div className="quantity-inputs">
                        <input 
                            type="number" 
                            name="quantity" 
                            value={inputs.quantity || ""} 
                            onChange={handleChange} 
                            required 
                            min="0.01" 
                            step="0.01"
                            placeholder="Enter quantity"
                        />
                        <select
                            name="quantityUnit"
                            value={inputs.quantityUnit || "kg"}
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
                <input 
                    type="datetime-local" 
                    name="expiryDate" 
                    value={inputs.expiryDate ? new Date(inputs.expiryDate).toISOString().slice(0, -8) : ""} 
                    onChange={handleChange} 
                    required
                    min={getCurrentDateTime()}
                    title="Please select a future date and time"
                />
                <small className="form-text text-muted">Select a future date and time for food expiry</small><br />
                <input type="text" name="pickupLocation" value={inputs.pickupLocation || ""} onChange={handleChange} required /><br />
                <input type="text" name="contactInfo" value={inputs.contactInfo || ""} onChange={handleChange} required /><br />
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default UpdateDonation;
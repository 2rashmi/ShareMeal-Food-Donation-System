import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import "../../App.css";

function ClaimDonation() {
    const [donations, setDonations] = useState([]);
    const [inputs, setInputs] = useState({ donationId: "", pickupDate: "", contactPerson: "" });
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await axios.get("http://localhost:5001/donations");
                setDonations(res.data.donations.filter(d => d.status === "Approved"));
            } catch (err) {
                console.error("Error fetching donations:", err);
                alert("Failed to fetch donations");
            }
        };
        fetchDonations();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "pickupDate") {
            // Get the selected donation's expiry date
            const selectedDonation = donations.find(d => d._id === inputs.donationId);
            if (selectedDonation) {
                const expiryDate = new Date(selectedDonation.expiryDate);
                const pickupDate = new Date(value);
                
                if (pickupDate > expiryDate) {
                    alert("Warning: Selected pickup date is after the food's expiration date. Please select an earlier date.");
                    return;
                }
            }
            setInputs(prev => ({ ...prev, [name]: value }));
        } else if (name === "contactPerson") {
            // Only allow letters and spaces, with a maximum of 50 characters
            const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
            setInputs(prev => ({ ...prev, [name]: lettersOnly }));
        } else {
            setInputs(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate contact person name
            if (!/^[a-zA-Z\s]+$/.test(inputs.contactPerson)) {
                alert("Contact person name can only contain letters and spaces");
                return;
            }

            // Check again before submitting
            const selectedDonation = donations.find(d => d._id === inputs.donationId);
            if (selectedDonation) {
                const expiryDate = new Date(selectedDonation.expiryDate);
                const pickupDate = new Date(inputs.pickupDate);
                
                if (pickupDate > expiryDate) {
                    alert("Cannot claim donation: Selected pickup date is after the food's expiration date.");
                    return;
                }
            }
            
            await axios.post("http://localhost:5001/claims", { ...inputs, ngoId: user.id });
            alert("Donation claimed successfully!");
            navigate("/ngo");
        } catch (err) {
            alert("Failed to claim donation: " + err.response.data.message);
        }
    };

    return (
        <div className="page-container">
            <Nav />
            <div className="content-container">
                <div className="page-header">
                    <h1>Claim a Donation</h1>
                    <p>Select an approved donation and provide pickup details</p>
                </div>

                
                <div className="form-container">
                    <form className="claim-form" onSubmit={handleSubmit}>
                    <label className="form-label">Select Donation</label>
                        <div className="form-group">
                            
                            <select 
                                className="form-select" 
                                name="donationId" 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Choose a donation...</option>
                                {donations.map(d => (
                                    <option key={d._id} value={d._id}>
                                        {d.foodType} - {d.quantity} (Expires: {new Date(d.expiryDate).toLocaleString()})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <label className="form-label">Pickup Date & Time</label>
                        <div className="form-group">
                            <input 
                                type="datetime-local" 
                                className="form-control"
                                name="pickupDate" 
                                onChange={handleChange} 
                                required
                                min={new Date().toISOString().slice(0, 16)}
                                title="Please select a future date and time for pickup"
                            />
                            <small className="form-text text-muted">Select a future date and time for pickup</small>
                        </div>

                        <label className="form-label">Contact Person</label>
                        <div className="form-group">
                            <input 
                                type="text" 
                                className="form-control"
                                name="contactPerson" 
                                placeholder="Enter contact person's name" 
                                value={inputs.contactPerson}
                                onChange={handleChange} 
                                required
                                pattern="[a-zA-Z\s]+"
                                maxLength="50"
                                title="Please enter only letters and spaces"
                            />
                            <small className="form-text text-muted">Enter only letters and spaces (maximum 50 characters)</small>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="form-submit">
                                Claim Donation
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ClaimDonation;
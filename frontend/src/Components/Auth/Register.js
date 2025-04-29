import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Register() {
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
        role: "Donor",
        email: "",
        // Donor fields
        organizationName: "",
        foodTypePreferences: [],
        availability: "",
        preferredContactMethod: "",
        // NGO fields
        ngoName: "",
        registrationNumber: "",
        website: "",
        serviceArea: "",
        ngoType: [],
        operatingHours: "",
        // Delivery Agent fields
        vehicleType: "",
        licenseNumber: "",
        workAvailability: "",
        maxDeliveryCapacity: "",
        preferredWorkLocations: []
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            const field = name;
            setInputs(prev => {
                const currentValues = prev[field] || [];
                if (checked) {
                    return { ...prev, [field]: [...currentValues, value] };
                } else {
                    return { ...prev, [field]: currentValues.filter(v => v !== value) };
                }
            });
        } else {
            setInputs(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Sending registration data:", inputs);
            
            const config = {
                method: 'post',
                url: 'http://localhost:5001/users/register',
                data: inputs,
                headers: {
                    'Content-Type': 'application/json',
                },
                validateStatus: function (status) {
                    return status >= 200 && status < 500;
                }
            };

            const response = await axios(config);
            console.log("Full response object:", response);
            
            if (response.status === 201) {
                alert("Registration successful! Awaiting admin approval.");
                navigate("/login");
            } else {
                throw new Error(response.data?.message || "Registration failed");
            }
        } catch (err) {
            console.error("Registration error details:", {
                message: err.message,
                response: err.response,
                request: err.request,
                config: err.config
            });
            
            let errorMessage = "Registration failed: ";
            if (err.response) {
                errorMessage += err.response.data?.message || err.response.statusText || "Server error";
            } else if (err.request) {
                errorMessage += "No response from server. Please check if the server is running.";
            } else {
                errorMessage += err.message || "Unknown error occurred";
            }
            
            alert(errorMessage);
        }
    };

    const renderDonorFields = () => (
        <>
            <input 
                type="text" 
                name="organizationName" 
                placeholder="Organization Name (if applicable)" 
                onChange={handleChange} 
                className="auth-input"
            />
            <div className="checkbox-group">
                <label>Food Type Preferences:</label>
                <div>
                    <input type="checkbox" name="foodTypePreferences" value="Cooked Food" onChange={handleChange} />
                    <span>Cooked Food</span>
                </div>
                <div>
                    <input type="checkbox" name="foodTypePreferences" value="Packaged Food" onChange={handleChange} />
                    <span>Packaged Food</span>
                </div>
                <div>
                    <input type="checkbox" name="foodTypePreferences" value="Raw Ingredients" onChange={handleChange} />
                    <span>Raw Ingredients</span>
                </div>
            </div>
            <select name="availability" onChange={handleChange} required className="auth-select">
                <option value="">Select Availability</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
            </select>
            <select name="preferredContactMethod" onChange={handleChange} required className="auth-select">
                <option value="">Select Preferred Contact Method</option>
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
            </select>
        </>
    );

    const renderNGOFields = () => (
        <>
            <input 
                type="text" 
                name="ngoName" 
                placeholder="NGO Name" 
                onChange={handleChange} 
                required 
                className="auth-input"
            />
            <input 
                type="text" 
                name="registrationNumber" 
                placeholder="Registration Number" 
                onChange={handleChange} 
                required 
                className="auth-input"
            />
            <input 
                type="text" 
                name="website" 
                placeholder="Website/Social Media Link" 
                onChange={handleChange} 
                className="auth-input"
            />
            <select name="serviceArea" onChange={handleChange} required className="auth-select">
                <option value="">Select Service Area</option>
                <option value="City">City</option>
                <option value="District">District</option>
            </select>
            <div className="checkbox-group">
                <label>NGO Type:</label>
                <div>
                    <input type="checkbox" name="ngoType" value="Food Distribution" onChange={handleChange} />
                    <span>Food Distribution</span>
                </div>
                <div>
                    <input type="checkbox" name="ngoType" value="Shelter" onChange={handleChange} />
                    <span>Shelter</span>
                </div>
                <div>
                    <input type="checkbox" name="ngoType" value="Child Welfare" onChange={handleChange} />
                    <span>Child Welfare</span>
                </div>
            </div>
            <input 
                type="text" 
                name="operatingHours" 
                placeholder="Operating Hours" 
                onChange={handleChange} 
                required 
                className="auth-input"
            />
        </>
    );

    const renderDeliveryAgentFields = () => (
        <>
            <select name="vehicleType" onChange={handleChange} required className="auth-select">
                <option value="">Select Vehicle Type</option>
                <option value="Bike">Bike</option>
                <option value="Car">Car</option>
                <option value="Truck">Truck</option>
            </select>
            <input 
                type="text" 
                name="licenseNumber" 
                placeholder="License Number" 
                onChange={handleChange} 
                required 
                className="auth-input"
            />
            <select name="workAvailability" onChange={handleChange} required className="auth-select">
                <option value="">Select Work Availability</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
            </select>
            <input 
                type="number" 
                name="maxDeliveryCapacity" 
                placeholder="Maximum Delivery Capacity (per day)" 
                onChange={handleChange} 
                required 
                className="auth-input"
            />
            <input 
                type="text" 
                name="preferredWorkLocations" 
                placeholder="Preferred Work Locations (comma-separated)" 
                onChange={handleChange} 
                required 
                className="auth-input"
            />
        </>
    );

    return (
        <div className="auth-container">
            <div className="auth-form-container">
                <h1 className="auth-title">Register</h1>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        onChange={handleChange} 
                        required 
                        className="auth-input"
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        onChange={handleChange} 
                        required 
                        className="auth-input"
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        onChange={handleChange} 
                        required 
                        className="auth-input"
                    />
                    <select name="role" onChange={handleChange} className="auth-select">
                        <option value="Donor">Donor</option>
                        <option value="NGO">NGO</option>
                        <option value="DeliveryAgent">Delivery Agent</option>
                    </select>
                    
                    {inputs.role === "Donor" && renderDonorFields()}
                    {inputs.role === "NGO" && renderNGOFields()}
                    {inputs.role === "DeliveryAgent" && renderDeliveryAgentFields()}
                    
                    <button type="submit" className="auth-button">Register</button>
                </form>
                <p className="auth-link">Already have an account? <a href="/login">Login here</a></p>
            </div>
        </div>
    );
}

export default Register;
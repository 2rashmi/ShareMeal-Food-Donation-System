import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import "../../App.css";

function AssignDelivery() {
    const [donations, setDonations] = useState([]);
    const [deliveryAgents, setDeliveryAgents] = useState([]);
    const [inputs, setInputs] = useState({ 
        donationId: "", 
        deliveryAgentId: "",
        pickupLocation: "",
        destinationAddress: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch donations that are claimed but not assigned
                const donationsRes = await axios.get("http://localhost:5001/donations");
                setDonations(donationsRes.data.donations.filter(d => d.status === "Claimed"));

                // Fetch all delivery agents
                const usersRes = await axios.get("http://localhost:5001/users");
                setDeliveryAgents(usersRes.data.users.filter(u => u.role === "DeliveryAgent"));
            } catch (err) {
                console.error("Error fetching data:", err);
                alert("Failed to fetch data");
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5001/deliveries", inputs);
            alert("Delivery agent assigned successfully");
            navigate("/admin/deliveries");
        } catch (err) {
            alert("Failed to assign delivery agent: " + err.response.data.message);
        }
    };

    return (
        <div className="container">
            <Nav />
            <div className="assign-delivery-container">
                <h1>Assign Delivery Agent</h1>
                <form onSubmit={handleSubmit} className="assign-delivery-form">
                <label>Select Donation</label>
                    <div className="form-group">
                        
                        <select name="donationId" onChange={handleChange} required>
                            <option value="">Select Donation</option>
                            {donations.map(d => (
                                <option key={d._id} value={d._id}>
                                    {d.foodType} - {d.quantity} (Donor: {d.donorId?.username || 'Unknown'})
                                </option>
                            ))}
                        </select>
                    </div>

                    <label>Select Delivery Agent</label>
                    
                    <div className="form-group">
                        
                        <select name="deliveryAgentId" onChange={handleChange} required>
                            <option value="">Select Delivery Agent</option>
                            {deliveryAgents.map(agent => (
                                <option key={agent._id} value={agent._id}>
                                    {agent.username}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <label>Pickup Location</label>
                    <div className="form-group">
                        
                        <input
                            type="text"
                            name="pickupLocation"
                            value={inputs.pickupLocation}
                            onChange={handleChange}
                            placeholder="Enter pickup location address"
                            required
                        />
                    </div>
                    <label>Destination Address</label>
                    <div className="form-group">
                        
                        <input
                            type="text"
                            name="destinationAddress"
                            value={inputs.destinationAddress}
                            onChange={handleChange}
                            placeholder="Enter destination address"
                            required
                        />
                    </div>

                    <button type="submit" className="submit-button">Assign Delivery Agent</button>
                </form>
            </div>
        </div>
    );
}

export default AssignDelivery; 
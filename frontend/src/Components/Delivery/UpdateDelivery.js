import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../Nav/Nav";
import "./Delivery.css";

function UpdateDelivery() {
    const [inputs, setInputs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDelivery = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/deliveries/${id}`);
                setInputs(res.data.delivery);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching delivery:", err);
                setError("Failed to fetch delivery details");
                setLoading(false);
            }
        };
        fetchDelivery();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "pickupTime" || name === "deliveryTime") {
            const selectedDate = new Date(value);
            const currentDate = new Date();
            
            if (selectedDate < currentDate) {
                alert(`${name === "pickupTime" ? "Pickup" : "Delivery"} time cannot be in the past`);
                return;
            }

            // If setting delivery time, validate it's after pickup time
            if (name === "deliveryTime" && inputs.pickupTime) {
                const pickupDate = new Date(inputs.pickupTime);
                if (selectedDate < pickupDate) {
                    alert("Delivery time must be after pickup time");
                    return;
                }
            }

            // If setting pickup time, validate delivery time is still valid
            if (name === "pickupTime" && inputs.deliveryTime) {
                const deliveryDate = new Date(inputs.deliveryTime);
                if (deliveryDate < selectedDate) {
                    alert("Delivery time must be after pickup time");
                    return;
                }
            }

            setInputs(prev => ({ ...prev, [name]: value }));
        } else {
            setInputs(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5001/deliveries/${id}`, inputs);
            navigate("/delivery");
        } catch (err) {
            setError("Failed to update delivery: " + err.response.data.message);
        }
    };

    if (loading) {
        return (
            <div className="container">
                <Nav />
                <div className="delivery-form-container loading">
                    <h1>Loading...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <Nav />
            <div className="delivery-form-container">
                <h1>Update Delivery</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label className="form-label">Update Status</label>
                    <div className="form-group">
                       
                        <select 
                            name="status" 
                            value={inputs.status || ""} 
                            onChange={handleChange} 
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Assigned">Assigned</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <label className="form-label">Pickup Time</label>
                    <div className="form-group">
                        <input 
                            type="datetime-local" 
                            name="pickupTime" 
                            value={inputs.pickupTime ? new Date(inputs.pickupTime).toISOString().slice(0, -8) : ""} 
                            onChange={handleChange}
                            min={new Date().toISOString().slice(0, 16)}
                            title="Please select a future date and time for pickup"
                        />
                        <small className="form-text text-muted">Select a future date and time for pickup</small>
                    </div>

                    <label className="form-label">Delivery Time</label>
                    <div className="form-group">
                        <input 
                            type="datetime-local" 
                            name="deliveryTime" 
                            value={inputs.deliveryTime ? new Date(inputs.deliveryTime).toISOString().slice(0, -8) : ""} 
                            onChange={handleChange}
                            min={inputs.pickupTime ? new Date(inputs.pickupTime).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
                            title="Please select a future date and time for delivery"
                        />
                        <small className="form-text text-muted">Select a future date and time for delivery (must be after pickup time)</small>
                    </div>

                    <button type="submit">Update Delivery</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateDelivery;
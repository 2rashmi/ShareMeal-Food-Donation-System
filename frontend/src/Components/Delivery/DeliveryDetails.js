import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import Delivery from "./Delivery";
import "../../App.css";
import { Link, useNavigate } from "react-router-dom";

function DeliveryDetails() {
    const [deliveries, setDeliveries] = useState([]);
    const [filteredDeliveries, setFilteredDeliveries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [foodTypeFilter, setFoodTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                console.log("Fetching deliveries for user:", user.id);
                const res = await axios.get("http://localhost:5001/deliveries");
                console.log("Received deliveries data:", res.data);
                
                if (!res.data.deliveries) {
                    console.error("No deliveries data received");
                    setDeliveries([]);
                    setFilteredDeliveries([]);
                    return;
                }

                const userDeliveries = res.data.deliveries.filter(d => 
                    d.deliveryAgentId && d.deliveryAgentId._id === user.id
                );
                console.log("Filtered user deliveries:", userDeliveries);
                
                setDeliveries(userDeliveries);
                setFilteredDeliveries(userDeliveries);
            } catch (err) {
                console.error("Error fetching deliveries:", err);
                alert("Failed to fetch deliveries: " + (err.response?.data?.message || err.message));
                setDeliveries([]);
                setFilteredDeliveries([]);
            }
        };
        fetchDeliveries();
    }, [user.id]);

    useEffect(() => {
        let filtered = [...deliveries];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(delivery => {
                const foodType = delivery.donationId?.foodType || "";
                const donor = delivery.donationId?.donorId?.username || "";
                return (
                    foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    donor.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
        }

        // Apply food type filter
        if (foodTypeFilter !== "all") {
            filtered = filtered.filter(delivery => delivery.donationId?.foodType === foodTypeFilter);
        }

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(delivery => delivery.status === statusFilter);
        }

        setFilteredDeliveries(filtered);
    }, [searchTerm, foodTypeFilter, statusFilter, deliveries]);

    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure you want to delete this delivery?")) {
            try {
                await axios.delete(`http://localhost:5001/deliveries/${id}`);
                setDeliveries(deliveries.filter(d => d._id !== id));
                navigate("/delivery");
            } catch (err) {
                alert("Failed to delete delivery: " + err.response.data.message);
            }
        }
    };

    // Get unique food types for filter
    const foodTypes = [...new Set(deliveries.map(d => d.donationId?.foodType))].filter(Boolean);

    return (
        <div className="deliveries-container">
            <Nav />
            <div className="deliveries-header">
                <h1>Your Deliveries</h1>
                <p>Manage and track your food deliveries</p>
            </div>

            {/* Search and Filter Section */}
            <div className="deliveries-search-section">
                <div className="deliveries-search-box">
                    <input
                        type="text"
                        placeholder="Search by food type or donor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="deliveries-search-input"
                    />
                </div>
                <div className="deliveries-filter-box">
                    <select 
                        value={foodTypeFilter} 
                        onChange={(e) => setFoodTypeFilter(e.target.value)}
                        className="deliveries-filter-select"
                    >
                        <option value="all">All Food Types</option>
                        {foodTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="deliveries-filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="Assigned">Assigned</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Deliveries Grid */}
            <div className="deliveries-grid">
                {filteredDeliveries.length > 0 ? (
                    filteredDeliveries.map((delivery, i) => (
                        <div key={i} className="delivery-card">
                            <div className="delivery-title">
                                <div className="delivery-icon">🚚</div>
                                <h3>{delivery.donationId?.foodType || 'N/A'}</h3>
                            </div>
                            <div className="delivery-details">
                                <div className="delivery-item">
                                    <span className="delivery-label">Quantity</span>
                                    <span className="delivery-value">{delivery.donationId?.quantity || 'N/A'}</span>
                                </div>
                                <div className="delivery-item">
                                    <span className="delivery-label">Donor</span>
                                    <span className="delivery-value">{delivery.donationId?.donorId?.username || 'N/A'}</span>
                                </div>
                                <div className="delivery-item">
                                    <span className="delivery-label">Pickup Time</span>
                                    <span className="delivery-value">
                                        {delivery.pickupTime ? new Date(delivery.pickupTime).toLocaleString() : "Not yet picked up"}
                                    </span>
                                </div>
                                <div className="delivery-item">
                                    <span className="delivery-label">Delivery Time</span>
                                    <span className="delivery-value">
                                        {delivery.deliveryTime ? new Date(delivery.deliveryTime).toLocaleString() : "Not yet delivered"}
                                    </span>
                                </div>
                                <div className="delivery-item">
                                    <span className="delivery-label">Status</span>
                                    <span className={`status-badge ${delivery.status?.toLowerCase() || 'unknown'}`}>
                                        {delivery.status || 'N/A'}
                                    </span>
                                </div>
                            </div>
                            {delivery.status !== "Delivered" && (
                                <div className="delivery-actions">
                                    <Link to={`/delivery/update/${delivery._id}`} className="btn btn-primary">
                                        Update
                                    </Link>
                                    <button onClick={() => deleteHandler(delivery._id)} className="btn btn-danger">
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="deliveries-no-results">
                        <div className="deliveries-no-results-icon">🔍</div>
                        <h3>No Deliveries Found</h3>
                        <p>No deliveries found matching your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DeliveryDetails;
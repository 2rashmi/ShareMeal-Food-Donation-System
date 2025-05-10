import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import "./AdminDeliveries.css";

function AdminDeliveries() {
    const [deliveries, setDeliveries] = useState([]);
    const [filteredDeliveries, setFilteredDeliveries] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [counts, setCounts] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const res = await axios.get("http://localhost:5001/deliveries");
                setDeliveries(res.data.deliveries);
                setFilteredDeliveries(res.data.deliveries);
                
                // Calculate counts
                const statusCounts = res.data.deliveries.reduce((acc, delivery) => {
                    acc[delivery.status] = (acc[delivery.status] || 0) + 1;
                    return acc;
                }, {});
                setCounts(statusCounts);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching deliveries:", err);
                setError("Failed to fetch deliveries: " + (err.response?.data?.message || err.message));
                setLoading(false);
            }
        };
        fetchDeliveries();
    }, []);

    useEffect(() => {
        if (statusFilter === "All") {
            setFilteredDeliveries(deliveries);
        } else {
            setFilteredDeliveries(deliveries.filter(d => d.status === statusFilter));
        }
    }, [statusFilter, deliveries]);

    const getStatusBadge = (status) => {
        switch (status) {
            case "Assigned":
                return <span className="status-badge assigned">Assigned</span>;
            case "InProgress":
                return <span className="status-badge in-progress">In Progress</span>;
            case "Delivered":
                return <span className="status-badge delivered">Delivered</span>;
            case "Cancelled":
                return <span className="status-badge cancelled">Cancelled</span>;
            default:
                return <span className="status-badge unknown">Unknown</span>;
        }
    };

    if (loading) return <div className="container loading">Loading...</div>;

    return (
        <div className="container">
            <Nav />
            <h1>All Deliveries</h1>

            {/* Status Counts */}
            <div className="status-counts">
                <div className="count-box total">
                    <h3>Total</h3>
                    <p>{deliveries.length}</p>
                </div>
                {Object.entries(counts).map(([status, count]) => (
                    <div key={status} className={`count-box ${status.toLowerCase()}`}>
                        <h3>{status}</h3>
                        <p>{count}</p>
                    </div>
                ))}
            </div>

            {/* Filter Section */}
            <div className="filter-section">
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="status-filter"
                >
                    <option value="All">All Status</option>
                    <option value="Assigned">Assigned</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            {filteredDeliveries.length === 0 ? (
                <p className="no-data">No deliveries found.</p>
            ) : (
                <div className="delivery-grid">
                    {filteredDeliveries.map((delivery, i) => (
                        <div key={i} className="delivery-card">
                            <div className="delivery-header">
                                <h3>Delivery #{i + 1}</h3>
                                {getStatusBadge(delivery.status)}
                            </div>
                            <div className="delivery-details">
                                <div className="detail-group">
                                    <h4>Donation Details</h4>
                                    <p><strong>Food Type:</strong> {delivery.donationId?.foodType || 'N/A'}</p>
                                    <p><strong>Quantity:</strong> {delivery.donationId?.quantity || 'N/A'}</p>
                                    <p><strong>Donor:</strong> {delivery.donationId?.donorId?.username || 'N/A'}</p>
                                </div>
                                <div className="detail-group">
                                    <h4>Delivery Information</h4>
                                    <p><strong>Delivery Agent:</strong> {delivery.deliveryAgentId?.username || 'N/A'}</p>
                                    <p><strong>Pickup Location:</strong> {delivery.pickupLocation || 'N/A'}</p>
                                    <p><strong>Destination Address:</strong> {delivery.destinationAddress || 'N/A'}</p>
                                    <p><strong>Pickup Time:</strong> {delivery.pickupTime ? new Date(delivery.pickupTime).toLocaleString() : "Not yet picked up"}</p>
                                    <p><strong>Delivery Time:</strong> {delivery.deliveryTime ? new Date(delivery.deliveryTime).toLocaleString() : "Not yet delivered"}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminDeliveries; 
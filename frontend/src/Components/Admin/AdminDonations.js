import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import './AdminDonations.css';

function AdminDonations() {
    const [donations, setDonations] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [counts, setCounts] = useState({});

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await axios.get("http://localhost:5001/donations");
                setDonations(res.data.donations);
                setFilteredDonations(res.data.donations);
                
                // Calculate counts
                const statusCounts = res.data.donations.reduce((acc, donation) => {
                    acc[donation.status] = (acc[donation.status] || 0) + 1;
                    return acc;
                }, {});
                setCounts(statusCounts);
            } catch (err) {
                console.error("Error fetching donations:", err);
                alert("Failed to fetch donations");
            }
        };
        fetchDonations();
    }, []);

    useEffect(() => {
        if (statusFilter === "All") {
            setFilteredDonations(donations);
        } else {
            setFilteredDonations(donations.filter(d => d.status === statusFilter));
        }
    }, [statusFilter, donations]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`http://localhost:5001/donations/${id}`, { status });
            const updatedDonations = donations.map(d => 
                d._id === id ? { ...d, status } : d
            );
            setDonations(updatedDonations);
            
            // Update counts
            const newCounts = updatedDonations.reduce((acc, donation) => {
                acc[donation.status] = (acc[donation.status] || 0) + 1;
                return acc;
            }, {});
            setCounts(newCounts);
            
            alert(`Donation ${status.toLowerCase()} successfully`);
        } catch (err) {
            alert("Failed to update donation status: " + err.response?.data?.message);
        }
    };

    return (
        <div className="container">
            <Nav />
            <h1>All Donations</h1>
            
            {/* Status counts */}
            <div className="status-counts">
                <div className="count-box">
                    <h3>Total</h3>
                    <p>{donations.length}</p>
                </div>
                {Object.entries(counts).map(([status, count]) => (
                    <div key={status} className="count-box">
                        <h3>{status}</h3>
                        <p>{count}</p>
                    </div>
                ))}
            </div>

            {/* Filter dropdown */}
            <div className="filter-section">
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="status-filter"
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Claimed">Claimed</option>
                    <option value="Assigned">Assigned</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Delivered">Delivered</option>
                </select>
            </div>

            {/* Donations list */}
            {filteredDonations.map((donation, i) => (
                <div key={i} className="card">
                    <h3>Food Type: {donation.foodType}</h3>
                    <p>Quantity: {donation.quantity}</p>
                    <p>Expiry Date: {new Date(donation.expiryDate).toLocaleString()}</p>
                    <p>Pickup Location: {donation.pickupLocation}</p>
                    <p>Contact Info: {donation.contactInfo}</p>
                    <p>Status: <span className={`status ${donation.status}`}>{donation.status}</span></p>
                    <p>Donor: {donation.donorId?.username || 'N/A'}</p>
                    {donation.status === "Pending" && (
                        <div className="action-buttons">
                            <button 
                                onClick={() => handleStatusUpdate(donation._id, "Approved")} 
                                className="btn btn-success"
                            >
                                Approve
                            </button>
                            <button 
                                onClick={() => handleStatusUpdate(donation._id, "Rejected")} 
                                className="btn btn-danger"
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default AdminDonations; 


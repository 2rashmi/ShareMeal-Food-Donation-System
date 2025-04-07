import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import "../../App.css";

function AdminDonations() {
    const [donations, setDonations] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [foodTypeFilter, setFoodTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await axios.get("http://localhost:5001/donations");
                setDonations(res.data.donations);
                setFilteredDonations(res.data.donations);
            } catch (err) {
                console.error("Error fetching donations:", err);
                alert("Failed to fetch donations");
            }
        };
        fetchDonations();
    }, []);

    useEffect(() => {
        let filtered = [...donations];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(donation => {
                const foodType = donation.foodType || "";
                const donor = donation.donorId?.username || "";
                const location = donation.pickupLocation || "";
                return (
                    foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    location.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
        }

        // Apply food type filter
        if (foodTypeFilter !== "all") {
            filtered = filtered.filter(donation => donation.foodType === foodTypeFilter);
        }

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(donation => donation.status === statusFilter);
        }

        setFilteredDonations(filtered);
    }, [searchTerm, foodTypeFilter, statusFilter, donations]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`http://localhost:5001/donations/${id}`, { status });
            setDonations(donations.map(d => 
                d._id === id ? { ...d, status } : d
            ));
            alert(`Donation ${status.toLowerCase()} successfully`);
        } catch (err) {
            alert("Failed to update donation status: " + err.response.data.message);
        }
    };

    // Get unique food types for filter
    const foodTypes = [...new Set(donations.map(d => d.foodType))].filter(Boolean);

    return (
        <div className="container">
            <Nav />
            <h1>All Donations</h1>

            {/* Search and Filter Section */}
            <div className="search-filter-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by food type, donor, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-box">
                    <select 
                        value={foodTypeFilter} 
                        onChange={(e) => setFoodTypeFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Food Types</option>
                        {foodTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Claimed">Claimed</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>
            </div>

            {/* Donations Grid */}
            <div className="donations-grid">
                {filteredDonations.map((donation, i) => (
                    <div key={i} className="donation-card">
                        <div className="donation-info">
                            <h3>{donation.foodType || 'N/A'}</h3>
                            <p className="donation-quantity">Quantity: {donation.quantity || 'N/A'}</p>
                            <p className="donation-expiry">Expiry: {new Date(donation.expiryDate).toLocaleDateString() || 'N/A'}</p>
                            <p className="donation-location">Location: {donation.pickupLocation || 'N/A'}</p>
                            <p className="donation-contact">Contact: {donation.contactInfo || 'N/A'}</p>
                            <p className={`donation-status ${donation.status.toLowerCase()}`}>
                                Status: {donation.status || 'N/A'}
                            </p>
                            <p className="donation-donor">Donor: {donation.donorId?.username || 'N/A'}</p>
                        </div>
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

            {filteredDonations.length === 0 && (
                <div className="no-results">
                    No donations found matching your search criteria.
                </div>
            )}
        </div>
    );
}

export default AdminDonations; 
import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import Donation from "./Donation";
import "../../App.css";

function DonationDetails() {
    const [donations, setDonations] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [foodTypeFilter, setFoodTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await axios.get("http://localhost:5001/donations");
                console.log("Raw donation data:", res.data);
                const userDonations = res.data.donations.filter(d => 
                    d.donorId && d.donorId._id === user.id
                );
                console.log("User donations with units:", userDonations);
                setDonations(userDonations);
                setFilteredDonations(userDonations);
            } catch (err) {
                console.error("Error fetching donations:", err);
                alert("Failed to fetch donations: " + (err.response?.data?.message || err.message));
            }
        };
        fetchDonations();
    }, [user.id]);

    useEffect(() => {
        let filtered = [...donations];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(donation => {
                const foodType = donation.foodType || "";
                const location = donation.pickupLocation || "";
                return (
                    foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    // Get unique food types for filter
    const foodTypes = [...new Set(donations.map(d => d.foodType))].filter(Boolean);

    return (
        <div className="page-container">
            <Nav />
            <div className="content-container">
                <div className="page-header">
                    <h1>Your Donations</h1>
                    <p>Manage and track your food donations</p>
                </div>

                {/* Search and Filter Section */}
                <div className="search-filter-section">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by food type or location..."
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
                    {filteredDonations.length > 0 ? (
                        filteredDonations.map((donation, i) => {
                            console.log("Donation being rendered:", donation); // Debug log
                            return (
                                <Donation 
                                    key={i} 
                                    donation={donation}
                                />
                            );
                        })
                    ) : (
                        <div className="no-results">
                            <div className="no-results-icon">📦</div>
                            <h3>No Donations Found</h3>
                            <p>No donations match your search criteria.</p>
                            <a href="/donor/add" className="btn btn-primary">Add New Donation</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DonationDetails;
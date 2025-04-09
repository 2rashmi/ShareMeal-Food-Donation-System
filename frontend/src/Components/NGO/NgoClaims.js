import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import "../../App.css";

function NgoClaims() {
    const [claims, setClaims] = useState([]);
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [foodTypeFilter, setFoodTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                console.log("Fetching claims for user:", user.id);
                const res = await axios.get("http://localhost:5001/claims");
                console.log("Received claims data:", res.data);
                
                if (!res.data.claims) {
                    console.error("No claims data received");
                    setClaims([]);
                    setFilteredClaims([]);
                    return;
                }

                const userClaims = res.data.claims.filter(c => 
                    c.ngoId && c.ngoId._id === user.id
                );
                console.log("Filtered user claims:", userClaims);
                
                setClaims(userClaims);
                setFilteredClaims(userClaims);
            } catch (err) {
                console.error("Error fetching claims:", err);
                alert("Failed to fetch claims: " + (err.response?.data?.message || err.message));
                setClaims([]);
                setFilteredClaims([]);
            }
        };
        fetchClaims();
    }, [user.id]);

    useEffect(() => {
        let filtered = [...claims];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(claim => {
                const foodType = claim.donationId.foodType || "";
                const contactPerson = claim.contactPerson || "";
                return (
                    foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
        }

        // Apply food type filter
        if (foodTypeFilter !== "all") {
            filtered = filtered.filter(claim => claim.donationId.foodType === foodTypeFilter);
        }

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(claim => claim.status === statusFilter);
        }

        setFilteredClaims(filtered);
    }, [searchTerm, foodTypeFilter, statusFilter, claims]);

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5001/claims/${id}`, { status });
            setClaims(claims.map(c => c._id === id ? { ...c, status } : c));
        } catch (err) {
            alert("Failed to update claim: " + err.response.data.message);
        }
    };

    const deleteClaim = async (id) => {
        if (window.confirm("Are you sure you want to cancel this claim?")) {
            try {
                await axios.delete(`http://localhost:5001/claims/${id}`);
                setClaims(claims.filter(c => c._id !== id));
                alert("Claim cancelled successfully");
            } catch (err) {
                alert("Failed to cancel claim: " + err.response.data.message);
            }
        }
    };

    // Get unique food types for filter
    const foodTypes = [...new Set(claims.map(c => c.donationId.foodType))].filter(Boolean);

    return (
        <div className="claims-container">
            <Nav />
            <div className="claims-header">
                <h1>Your Claims</h1>
                <p>Manage and track your food donation claims</p>
            </div>

            {/* Search and Filter Section */}
            <div className="claims-search-section">
                <div className="claims-search-box">
                    <input
                        type="text"
                        placeholder="Search by food type or contact person..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="claims-search-input"
                    />
                </div>
                <div className="claims-filter-box">
                    <select 
                        value={foodTypeFilter} 
                        onChange={(e) => setFoodTypeFilter(e.target.value)}
                        className="claims-filter-select"
                    >
                        <option value="all">All Food Types</option>
                        {foodTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="claims-filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Collected">Collected</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Claims Grid */}
            <div className="claims-grid">
                {filteredClaims.length > 0 ? (
                    filteredClaims.map((claim, i) => (
                        <div key={i} className="claim-card">
                            <div className="claim-title">
                                <div className="claim-icon">🍽️</div>
                                <h3>{claim.donationId.foodType}</h3>
                            </div>
                            <div className="claim-details">
                                <div className="claim-item">
                                    <span className="claim-label">Pickup Date</span>
                                    <span className="claim-value">{new Date(claim.pickupDate).toLocaleString()}</span>
                                </div>
                                <div className="claim-item">
                                    <span className="claim-label">Contact Person</span>
                                    <span className="claim-value">{claim.contactPerson}</span>
                                </div>
                                <div className="claim-item">
                                    <span className="claim-label">Status</span>
                                    <span className={`status-badge ${claim.status.toLowerCase()}`}>
                                        {claim.status}
                                    </span>
                                </div>
                            </div>
                            {claim.status === "Pending" && (
                                <div className="claim-actions">
                                    <button 
                                        onClick={() => updateStatus(claim._id, "Collected")} 
                                        className="btn btn-primary"
                                    >
                                        Mark Collected
                                    </button>
                                    <button 
                                        onClick={() => deleteClaim(claim._id)} 
                                        className="btn btn-danger"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="claims-no-results">
                        <div className="claims-no-results-icon">🔍</div>
                        <h3>No Claims Found</h3>
                        <p>No claims found matching your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NgoClaims;
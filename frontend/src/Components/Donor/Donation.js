import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../App.css";

function Donation({ donation }) {
    const navigate = useNavigate();

    // Debug log
    console.log("Donation data in component:", donation);

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "status-pending";
            case "Approved":
                return "status-approved";
            case "Rejected":
                return "status-rejected";
            case "Claimed":
                return "status-claimed";
            case "Delivered":
                return "status-delivered";
            default:
                return "status-pending";
        }
    };

    const getFoodIcon = (foodType) => {
        const type = foodType.toLowerCase();
        if (type.includes("rice")) return "🍚";
        if (type.includes("vegetable")) return "🥬";
        if (type.includes("fruit")) return "🍎";
        if (type.includes("meat")) return "🥩";
        if (type.includes("bread")) return "🍞";
        return "🍽️";
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this donation?")) {
            try {
                await axios.delete(`http://localhost:5001/donations/${donation._id}`);
                window.location.reload(); // Refresh the page to show updated list
            } catch (error) {
                console.error("Error deleting donation:", error);
                alert("Failed to delete donation");
            }
        }
    };

    return (
        <div className="donation-card">
            <div className="donation-header">
                <div className="donation-title">
                    <span className="food-icon">{getFoodIcon(donation.foodType)}</span>
                    <h3>{donation.foodType}</h3>
                </div>
                <span className={`status-badge ${getStatusColor(donation.status)}`}>
                    {donation.status}
                </span>
            </div>
            <div className="donation-details">
                <div className="detail-item">
                    <span className="detail-label">Quantity</span>
                    <span className="detail-value">
                        {donation.quantity} {donation.quantityUnit || 'kg'}
                    </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{donation.pickupLocation}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Date</span>
                    <span className="detail-value">
                        {new Date(donation.expiryDate).toLocaleDateString()}
                    </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Contact</span>
                    <span className="detail-value">{donation.contactInfo}</span>
                </div>
            </div>
            <div className="donation-actions">
                {donation.status === "Pending" && (
                    <>
                        <Link to={`/donor/update/${donation._id}`} className="btn btn-primary">
                            <span className="btn-icon">✏️</span>
                            Update
                        </Link>
                        <button onClick={handleDelete} className="btn btn-danger">
                            <span className="btn-icon">🗑️</span>
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Donation;
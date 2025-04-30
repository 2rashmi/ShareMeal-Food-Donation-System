import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import "./Admin.css";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:5001/users");
                const nonAdminUsers = res.data.users.filter(u => u.role !== "Admin");
                setUsers(nonAdminUsers);
                setFilteredUsers(nonAdminUsers);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch users: " + (err.response?.data?.message || err.message));
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        let filtered = [...users];
        if (statusFilter !== "all") {
            filtered = users.filter(user => {
                switch (statusFilter) {
                    case "approved":
                        return user.approved && !user.rejected;
                    case "rejected":
                        return user.rejected;
                    case "pending":
                        return !user.approved && !user.rejected;
                    default:
                        return true;
                }
            });
        }
        setFilteredUsers(filtered);
    }, [statusFilter, users]);

    const approveUser = async (id) => {
        try {
            await axios.put(`http://localhost:5001/users/approve/${id}`);
            setUsers(users.map(u => u._id === id ? { ...u, approved: true } : u));
        } catch (err) {
            setError("Failed to approve user: " + (err.response?.data?.message || err.message));
        }
    };

    const handleRejectClick = (user) => {
        setSelectedUser(user);
        setShowRejectModal(true);
    };

    const handleRejectSubmit = async () => {
        if (!rejectionReason.trim()) {
            setError("Please provide a rejection reason");
            return;
        }

        try {
            await axios.post(`http://localhost:5001/users/reject/${selectedUser._id}`, {
                rejectionReason: rejectionReason
            });
            setUsers(users.map(u => 
                u._id === selectedUser._id 
                    ? { ...u, rejected: true, rejectionReason: rejectionReason } 
                    : u
            ));
            setShowRejectModal(false);
            setRejectionReason("");
            setSelectedUser(null);
        } catch (err) {
            setError("Failed to reject user: " + (err.response?.data?.message || err.message));
        }
    };

    const renderRoleSpecificFields = (user) => {
        switch (user.role) {
            case "Donor":
                return (
                    <>
                        <p>Organization Name: {user.organizationName || "N/A"}</p>
                        <p>Food Type Preferences: {user.foodTypePreferences?.join(", ") || "N/A"}</p>
                        <p>Availability: {user.availability || "N/A"}</p>
                        <p>Preferred Contact: {user.preferredContactMethod || "N/A"}</p>
                    </>
                );
            case "NGO":
                return (
                    <>
                        <p>NGO Name: {user.ngoName || "N/A"}</p>
                        <p>Registration Number: {user.registrationNumber || "N/A"}</p>
                        <p>Website: {user.website || "N/A"}</p>
                        <p>Service Area: {user.serviceArea || "N/A"}</p>
                        <p>NGO Type: {user.ngoType?.join(", ") || "N/A"}</p>
                        <p>Operating Hours: {user.operatingHours || "N/A"}</p>
                    </>
                );
            case "DeliveryAgent":
                return (
                    <>
                        <p>Vehicle Type: {user.vehicleType || "N/A"}</p>
                        <p>License Number: {user.licenseNumber || "N/A"}</p>
                        <p>Work Availability: {user.workAvailability || "N/A"}</p>
                        <p>Max Delivery Capacity: {user.maxDeliveryCapacity || "N/A"}</p>
                        <p>Preferred Locations: {user.preferredWorkLocations?.join(", ") || "N/A"}</p>
                    </>
                );
            default:
                return null;
        }
    };

    const getStatusBadge = (user) => {
        if (user.approved) return <span className="status-badge approved">Approved</span>;
        if (user.rejected) return <span className="status-badge rejected">Rejected</span>;
        return <span className="status-badge pending">Pending</span>;
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <Nav />
            <h1>Admin Dashboard</h1>
            <h2>Manage Users</h2>
            
            <div className="filter-section">
                <label htmlFor="statusFilter">Filter by Status:</label>
                <select 
                    id="statusFilter" 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Users</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            {filteredUsers.length === 0 ? (
                <p>No users found with the selected filter.</p>
            ) : (
                filteredUsers.map((user, i) => (
                    <div key={i} className="card">
                        <h3>{user.role} Registration</h3>
                        <p>Username: {user.username}</p>
                        <p>Email: {user.email}</p>
                        <p>Status: {getStatusBadge(user)}</p>
                        {user.rejected && (
                            <div className="rejection-info">
                                <p><strong>Rejection Reason:</strong> {user.rejectionReason}</p>
                                <p><strong>Rejected On:</strong> {new Date(user.rejectionDate).toLocaleString()}</p>
                            </div>
                        )}
                        {renderRoleSpecificFields(user)}
                        {!user.approved && !user.rejected && (
                            <div className="action-buttons">
                                <button onClick={() => approveUser(user._id)} className="btn approve">
                                    Approve
                                </button>
                                <button onClick={() => handleRejectClick(user)} className="btn reject">
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Reject User Registration</h2>
                        <p>Please provide a reason for rejecting this registration:</p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            rows="4"
                            required
                        />
                        <div className="modal-buttons">
                            <button onClick={handleRejectSubmit} className="btn reject">
                                Confirm Rejection
                            </button>
                            <button onClick={() => {
                                setShowRejectModal(false);
                                setRejectionReason("");
                                setSelectedUser(null);
                            }} className="btn cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
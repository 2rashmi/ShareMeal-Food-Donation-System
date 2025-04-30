import React from "react";
import { Link } from "react-router-dom";
import "../../App.css";

function Nav() {
    const user = JSON.parse(localStorage.getItem("user"));
    const logout = () => {
        localStorage.removeItem("user");
    };

    return (
        <nav className="nav">
            <ul>
                {user.role === "Admin" && (
                    <>
                        <li><Link to="/admin">Dashboard</Link></li>
                        <li><Link to="/admin/donations">Donations</Link></li>
                        <li><Link to="/admin/deliveries">Deliveries</Link></li>
                        <li><Link to="/admin/assign-delivery">Assign Delivery</Link></li>
                        <li><Link to="/admin/reports">Reports</Link></li>
                    </>
                )}
                {user.role === "Donor" && (
                    <>
                        <li><Link to="/donor">Donations</Link></li>
                        <li><Link to="/donor/add">Add Donation</Link></li>
                    </>
                )}
                {user.role === "NGO" && (
                    <>
                        <li><Link to="/ngo">Claims</Link></li>
                        <li><Link to="/ngo/claim">Claim Donation</Link></li>
                    </>
                )}
                {user.role === "DeliveryAgent" && (
                    <li><Link to="/delivery">Deliveries</Link></li>
                )}
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/login" onClick={logout}>Logout</Link></li>
            </ul>
        </nav>
    );
}

export default Nav;
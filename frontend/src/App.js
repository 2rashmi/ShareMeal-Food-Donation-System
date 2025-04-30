import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import AddDonation from "./Components/Donor/AddDonation";
import DonationDetails from "./Components/Donor/DonationDetails";
import UpdateDonation from "./Components/Donor/UpdateDonation";
import ClaimDonation from "./Components/NGO/ClaimDonation";
import NgoClaims from "./Components/NGO/NgoClaims";
import DeliveryDetails from "./Components/Delivery/DeliveryDetails";
import UpdateDelivery from "./Components/Delivery/UpdateDelivery";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminDonations from "./Components/Admin/AdminDonations";
import AdminDeliveries from "./Components/Admin/AdminDeliveries";
import AssignDelivery from "./Components/Admin/AssignDelivery";
import AdminReports from "./Components/Admin/AdminReports";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";
import "./App.css";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/donor" element={<DonationDetails />} />
                <Route path="/donor/add" element={<AddDonation />} />
                <Route path="/donor/update/:id" element={<UpdateDonation />} />
                <Route path="/ngo" element={<NgoClaims />} />
                <Route path="/ngo/claim" element={<ClaimDonation />} />
                <Route path="/delivery" element={<DeliveryDetails />} />
                <Route path="/delivery/update/:id" element={<UpdateDelivery />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/donations" element={<AdminDonations />} />
                <Route path="/admin/deliveries" element={<AdminDeliveries />} />
                <Route path="/admin/assign-delivery" element={<AssignDelivery />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </div>
    );
}

export default App;
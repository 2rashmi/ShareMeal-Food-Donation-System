import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../App.css";

function Delivery({ delivery }) {
    const { _id, donationId, pickupLocation, destinationAddress, pickupTime, deliveryTime, status } = delivery;
    const navigate = useNavigate();

    const deleteHandler = async () => {
        try {
            await axios.delete(`http://localhost:5001/deliveries/${_id}`);
            navigate("/delivery");
        } catch (err) {
            alert("Failed to delete delivery: " + err.response.data.message);
        }
    };

    return (
        <div className="delivery-card">
            <div className="delivery-info">
                <h3>{donationId.foodType}</h3>
                <p className="delivery-quantity">Quantity: {donationId.quantity}</p>
                <p className="delivery-donor">Donor: {donationId.donorId.username}</p>
                <div className="delivery-locations">
                    <div className="location-group">
                        <h4>Pickup Location</h4>
                        <p>{pickupLocation}</p>
                    </div>
                    <div className="location-group">
                        <h4>Destination</h4>
                        <p>{destinationAddress}</p>
                    </div>
                </div>
                <p className="delivery-pickup">
                    Pickup: {pickupTime ? new Date(pickupTime).toLocaleString() : "Not yet picked up"}
                </p>
                <p className="delivery-time">
                    Delivery: {deliveryTime ? new Date(deliveryTime).toLocaleString() : "Not yet delivered"}
                </p>
                <p className={`delivery-status ${status.toLowerCase()}`}>
                    Status: {status}
                </p>
            </div>
            {status !== "Delivered" && (
                <div className="action-buttons">
                    <Link to={`/delivery/update/${_id}`} className="btn btn-success">
                        Update
                    </Link>
                    <button onClick={deleteHandler} className="btn btn-danger">
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default Delivery;
const express = require("express");
const router = express.Router();
const ngoController = require("../Controllers/ngoController");

// Donation Routes
router.post("/donations", ngoController.createDonation);
router.get("/donations", ngoController.getAllDonations);
router.put("/donations/:id", ngoController.updateDonationStatus);

// Request Routes
router.post("/requests", ngoController.createRequest);
router.get("/requests", ngoController.getAllRequests);
router.put("/requests/:id", ngoController.updateRequestStatus);

// Delivery Routes
router.post("/deliveries", ngoController.createDelivery);
router.get("/deliveries", ngoController.getAllDeliveries);
router.put("/deliveries/:id", ngoController.updateDeliveryStatus);

// User Routes
router.post("/users", ngoController.registerUser);
router.get("/users", ngoController.getAllUsers);

module.exports = router;

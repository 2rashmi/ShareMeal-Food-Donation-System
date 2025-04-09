const express = require("express");
const router = express.Router();
const ReportController = require("../Controllers/ReportController");

// Report routes
router.get("/donations", ReportController.generateDonationReport);
//delivery route
router.get("/deliveries", ReportController.generateDeliveryReport);

module.exports = router;
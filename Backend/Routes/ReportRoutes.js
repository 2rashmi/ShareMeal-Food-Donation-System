const express = require("express");
const router = express.Router();
const ReportController = require("../Controllers/ReportController");

// Report routes
router.get("/donations", ReportController.generateDonationReport);

module.exports = router;
const express = require("express");
const router = express.Router();
const DonationController = require("../Controllers/DonationController");

router.post("/", DonationController.addDonation);
router.get("/", DonationController.getAllDonations);
router.get("/:id", DonationController.getDonationById);
router.put("/:id", DonationController.updateDonation);
router.delete("/:id", DonationController.deleteDonation);

module.exports = router;
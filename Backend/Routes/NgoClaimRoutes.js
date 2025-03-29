const express = require("express");
const router = express.Router();
const NgoClaimController = require("../Controllers/NgoClaimController");

router.post("/", NgoClaimController.claimDonation);
router.get("/", NgoClaimController.getAllClaims);
router.put("/:id", NgoClaimController.updateClaim);
router.delete("/:id", NgoClaimController.deleteClaim);

module.exports = router;
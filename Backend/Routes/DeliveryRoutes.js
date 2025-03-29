const express = require("express");
const router = express.Router();
const DeliveryController = require("../Controllers/DeliveryController");

router.post("/", DeliveryController.assignDelivery);
router.get("/", DeliveryController.getAllDeliveries);
router.get("/:id", DeliveryController.getDeliveryById);
router.put("/:id", DeliveryController.updateDelivery);
router.delete("/:id", DeliveryController.deleteDelivery);

module.exports = router;
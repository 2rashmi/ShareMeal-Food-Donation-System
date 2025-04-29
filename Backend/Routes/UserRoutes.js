const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/UserController");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/", UserController.getAllUsers);
router.put("/approve/:id", UserController.approveUser);
router.post("/reject/:id", UserController.rejectUser);

// Profile routes
router.get("/profile/:id", UserController.getUserProfile);
router.put("/profile/:id", UserController.updateUserProfile);
router.delete("/profile/:id", UserController.deleteUserProfile);

module.exports = router;
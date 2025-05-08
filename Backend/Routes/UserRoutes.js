const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/UserController");
const sendEmail = require('../utils/email');

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/", UserController.getAllUsers);
router.put("/approve/:id", UserController.approveUser);
router.post("/reject/:id", UserController.rejectUser);

// Profile routes
router.get("/profile/:id", UserController.getUserProfile);
router.put("/profile/:id", UserController.updateUserProfile);
router.delete("/profile/:id", UserController.deleteUserProfile);

router.get('/test-email', async (req, res) => {
  try {
    await sendEmail('your_email@gmail.com', 'Test Email', 'This is a test email from your app!');
    res.send('Test email sent!');
  } catch (err) {
    res.status(500).send('Failed to send test email: ' + err.message);
  }
});

module.exports = router;
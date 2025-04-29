const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
const userRoutes = require("./Routes/UserRoutes");
const donationRoutes = require("./Routes/DonationRoutes");
const ngoClaimRoutes = require("./Routes/NgoClaimRoutes");
const deliveryRoutes = require("./Routes/DeliveryRoutes");
const reportRoutes = require("./Routes/ReportRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use("/users", userRoutes);
app.use("/donations", donationRoutes);
app.use("/claims", ngoClaimRoutes);
app.use("/deliveries", deliveryRoutes);
app.use("/reports", reportRoutes);

// Fix Mongoose Deprecation Warning
mongoose.set("strictQuery", false);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB successfully");
    // Start the server only after successful database connection
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
      console.log("Database connection established");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if database connection fails
  });

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./Models/UserModel');

// Admin user details
const adminUser = {
    username: 'admin123',
    password: 'Admin@123', // This will be hashed
    role: 'Admin',
    email: 'admin123@example.com',
    approved: true
};

async function createAdminUser() {
    try {
        // Delete any existing admin users first
        await User.deleteMany({ role: 'Admin' });
        console.log('Cleaned up existing admin users');

        // Create new admin user
        const hashedPassword = await bcrypt.hash(adminUser.password, 10);
        const admin = new User({
            ...adminUser,
            password: hashedPassword
        });
        
        await admin.save();
        console.log('New admin user created successfully');
        console.log('=== Admin Credentials ===');
        console.log('Username:', adminUser.username);
        console.log('Password:', adminUser.password);
        console.log('========================');
        
        // Verify the admin user was created
        const verifyAdmin = await User.findOne({ username: adminUser.username });
        if (verifyAdmin) {
            console.log('Admin user verified in database');
            console.log('Admin ID:', verifyAdmin._id);
        } else {
            console.log('Warning: Admin user not found after creation');
        }
        
    } catch (error) {
        console.error('Error managing admin user:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        process.exit(0);
    }
}

// Connect to MongoDB
mongoose.connect("mongodb+srv://Harshaka:SesQI6dFFxTuPQfA@cluster0.eyq7l8k.mongodb.net/foodDonationDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    createAdminUser();
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
}); 
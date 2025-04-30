const bcrypt = require("bcryptjs");

const password = "admin123"; // Change this to your desired password
bcrypt.hash(password, 10, (err, hash) => {
    if (err) console.error(err);
    console.log("Hashed Password:", hash);
});
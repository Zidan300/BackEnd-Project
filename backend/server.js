const bcrypt = require("bcryptjs");
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();

app.use(express.json());


// ===============================
// MongoDB Connection
// ===============================

mongoose.connect("mongodb://127.0.0.1:27017/login_app")
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });


// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "Backend is working!"
    });
});


// ===============================
// Register
// ===============================

app.post("/api/register", async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });

    }

});


// ===============================
// Login
// ===============================

app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare entered password with hashed password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Login successful
        res.json({
            message: "Login successful",
            user: {
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });

    }

});


// ===============================
// Start Server
// ===============================

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});

const cors = require("cors");
const bcrypt = require("bcryptjs");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const app = express();

const JWT_SECRET = "my_super_secret_key";
// ===============================
// JWT Authentication Middleware
// ===============================

function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access token required"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Invalid authorization format"
        });
    }

    try {

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }
}

app.use(cors());
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

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
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

        console.error("Registration error:", error);

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

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password with bcrypt hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // ===============================
        // Create JWT
        // ===============================

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // ===============================
        // Login Response
        // ===============================

        res.json({
            message: "Login successful",
            token,
            user: {
                email: user.email
            }
        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });

    }

});


// ===============================
// Start Server
// ===============================
// ===============================
// Protected Profile Route
// ===============================

app.get("/api/profile", authenticateToken, async (req, res) => {

    try {

        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Protected data accessed successfully",
            user: {
                id: user._id,
                email: user.email
            }
        });

    } catch (error) {

        console.error("Profile error:", error);

        res.status(500).json({
            message: "Failed to retrieve profile"
        });

    }

});

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});

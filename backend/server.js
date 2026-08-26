require("dotenv").config();
const { humanizeText } = require("./humanizer/humanizerEngine");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("./models/User");

const app = express();


// ===============================
// Environment Variables
// ===============================

const JWT_SECRET = process.env.JWT_SECRET;

const GOOGLE_CLIENT_ID =
    process.env.GOOGLE_CLIENT_ID;

const GOOGLE_CLIENT_SECRET =
    process.env.GOOGLE_CLIENT_SECRET;

const GOOGLE_CALLBACK_URL =
    process.env.GOOGLE_CALLBACK_URL;


// ===============================
// Check Environment Variables
// ===============================

console.log(
    "JWT Secret:",
    JWT_SECRET ? "Loaded" : "Missing"
);

console.log(
    "Google Client ID:",
    GOOGLE_CLIENT_ID ? "Loaded" : "Missing"
);

console.log(
    "Google Client Secret:",
    GOOGLE_CLIENT_SECRET ? "Loaded" : "Missing"
);

console.log(
    "Google Callback:",
    GOOGLE_CALLBACK_URL || "Missing"
);


// ===============================
// Middleware
// ===============================

app.use(cors());

app.use(express.json());

app.use(passport.initialize());


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

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }
}


// ===============================
// MongoDB Connection
// ===============================

mongoose.connect(
    "mongodb://127.0.0.1:27017/login_app"
)
    .then(() => {

        console.log("MongoDB connected!");

    })
    .catch((error) => {

        console.error(
            "MongoDB connection failed:",
            error
        );

    });


// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => {

    res.json({
        message: "Backend is working!"
    });

});


// =====================================================
// REGISTER WITH EMAIL + PASSWORD
// =====================================================

app.post("/api/register", async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check required fields

        if (!email || !password) {

            return res.status(400).json({
                message:
                    "Email and password are required"
            });

        }

        // Check existing user

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });

        }

        // Hash password

        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Create user

        const user = await User.create({

            email,

            password: hashedPassword

        });

        res.status(201).json({

            message:
                "User created successfully",

            user: {
                email: user.email
            }

        });

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({

            message:
                "Registration failed",

            error: error.message

        });

    }

});


// =====================================================
// LOGIN WITH EMAIL + PASSWORD
// =====================================================

app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check required fields

        if (!email || !password) {

            return res.status(400).json({
                message:
                    "Email and password are required"
            });

        }

        // Find user

        const user =
            await User.findOne({ email });

        if (!user) {

            return res.status(401).json({
                message:
                    "Invalid email or password"
            });

        }

        // Google-only account

        if (!user.password) {

            return res.status(401).json({

                message:
                    "This account uses Google login. Please sign in with Google."

            });

        }

        // Compare password

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {

            return res.status(401).json({
                message:
                    "Invalid email or password"
            });

        }

        // Create JWT

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

        // Response

        res.json({

            message:
                "Login successful",

            token,

            user: {
                id: user._id,
                email: user.email
            }

        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({

            message:
                "Login failed",

            error: error.message

        });

    }

});


// =====================================================
// GOOGLE OAUTH STRATEGY
// =====================================================

passport.use(

    new GoogleStrategy(

        {

            clientID:
                GOOGLE_CLIENT_ID,

            clientSecret:
                GOOGLE_CLIENT_SECRET,

            callbackURL:
                GOOGLE_CALLBACK_URL

        },

        async (
            accessToken,
            refreshToken,
            profile,
            done
        ) => {

            try {

                console.log(
                    "Google user:",
                    profile.displayName
                );

                // Get Google information

                const googleId =
                    profile.id;

                const email =
                    profile.emails?.[0]?.value;


                // Make sure Google provided email

                if (!email) {

                    return done(
                        new Error(
                            "Google account email not available"
                        ),
                        null
                    );

                }


                // ---------------------------------
                // Find user using Google ID
                // ---------------------------------

                let user =
                    await User.findOne({
                        googleId
                    });


                if (user) {

                    return done(
                        null,
                        user
                    );

                }


                // ---------------------------------
                // Check email
                // ---------------------------------

                user =
                    await User.findOne({
                        email
                    });


                // ---------------------------------
                // Existing email account
                // ---------------------------------

                if (user) {

                    user.googleId =
                        googleId;

                    await user.save();

                    return done(
                        null,
                        user
                    );

                }


                // ---------------------------------
                // Create new Google user
                // ---------------------------------

                user =
                    await User.create({

                        email,

                        googleId

                    });


                return done(
                    null,
                    user
                );

            } catch (error) {

                console.error(
                    "Google authentication error:",
                    error
                );

                return done(
                    error,
                    null
                );

            }

        }

    )

);


// =====================================================
// START GOOGLE LOGIN
// =====================================================

app.get(
    "/auth/google",

    passport.authenticate(
        "google",
        {
            scope: [
                "profile",
                "email"
            ]
        }
    )

);


// =====================================================
// GOOGLE CALLBACK
// =====================================================

app.get(

    "/auth/google/callback",

    passport.authenticate(
        "google",
        {
            session: false,

            failureRedirect:
                "http://localhost:5173/login"
        }
    ),

    (req, res) => {

        try {

            // Create YOUR JWT

            const token =
                jwt.sign(

                    {
                        userId:
                            req.user._id,

                        email:
                            req.user.email
                    },

                    JWT_SECRET,

                    {
                        expiresIn: "1h"
                    }

                );


            // Send user back to React

            res.redirect(

                `http://localhost:5173/dashboard?token=${token}`

            );

        } catch (error) {

            console.error(
                "Google JWT error:",
                error
            );

            res.redirect(
                "http://localhost:5173/login"
            );

        }

    }

);


// =====================================================
// PROTECTED PROFILE ROUTE
// =====================================================

app.get(
    "/api/profile",
    authenticateToken,
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.user.userId
                )
                    .select("-password");


            if (!user) {

                return res.status(404).json({

                    message:
                        "User not found"

                });

            }


            res.json({

                message:
                    "Protected data accessed successfully",

                user: {

                    id: user._id,

                    email: user.email

                }

            });

        } catch (error) {

            console.error(
                "Profile error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to retrieve profile"

            });

        }

    }
);
// ==========================================
// HUMANIZER
// ==========================================

app.post("/api/humanize", async (req, res) => {

    try {

        const { text, mode } = req.body;

        if (!text || !text.trim()) {

            return res.status(400).json({
                message: "Text is required."
            });

        }


        const humanizedText = await humanizeText(
            text,
            mode || "natural"
        );


        res.json({

            success: true,

            original: text,

            humanized: humanizedText,

            mode: mode || "natural"

        });

    } catch (error) {

        console.error(
            "Humanizer error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to humanize text.",

            error:
                error.message

        });

    }

});


// =====================================================
// START SERVER
// =====================================================

app.listen(
    4000,
    () => {

        console.log(
            "Server running on http://localhost:4000"
        );

    }
);

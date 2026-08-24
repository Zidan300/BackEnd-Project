const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/login_app")
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });

app.get("/", (req, res) => {
    res.json({
        message: "Backend is working!"
    });
});

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});

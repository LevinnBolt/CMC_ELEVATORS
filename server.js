// --- Imports ---
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// --- App Initialization ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI, {
    // These options are no longer needed for Mongoose v6+ but are kept for compatibility
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully."))
.catch((err) => console.error("MongoDB connection error:", err));

// --- Mongoose Schemas & Models ---

// Example Schema (can be removed if not used)
const DataSchema = new mongoose.Schema({ name: String });
const Data = mongoose.model("Data", DataSchema);

// Contact Form Submission Schema
const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
const Contact = mongoose.model("Contact", ContactSchema);

// --- API Routes ---

// Example GET route (can be removed if not used)
app.get("/api/data", async (req, res) => {
    try {
        const allData = await Data.find();
        res.status(200).json(allData);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching data." });
    }
});

// POST route for handling contact form submissions
app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newEntry = new Contact({ name, email, message, phone });
        await newEntry.save();
        res.status(201).json({ message: "Message received! We'll get back to you soon." });
    } catch (err) {
        console.error("Error saving contact form entry:", err);
        res.status(500).json({ message: "Server error, please try again." });
    }
});

// --- Start Server ---
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
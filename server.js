const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

// === Middlewares ===
app.use(cors());
app.use(express.json());

// Static folder for profile images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === Routes ===
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Base routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Test route for root
app.get("/", (req, res) => {
  res.send("✅ MERN Auth Backend is running successfully!");
});

// === Database Connection ===
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// === Global Error Handler (Optional but helpful) ===
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

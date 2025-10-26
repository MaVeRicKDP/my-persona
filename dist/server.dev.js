"use strict";

var express = require("express");

var mongoose = require("mongoose");

var dotenv = require("dotenv");

var cors = require("cors");

var path = require("path");

dotenv.config();
var app = express(); // === Middlewares ===

app.use(cors());
app.use(express.json()); // Static folder for profile images

app.use("/uploads", express["static"](path.join(__dirname, "uploads"))); // === Routes ===

var authRoutes = require("./routes/authRoutes");

var profileRoutes = require("./routes/profileRoutes"); // Base routes


app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes); // Test route for root

app.get("/", function (req, res) {
  res.send("✅ MERN Auth Backend is running successfully!");
}); // === Database Connection ===

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log("✅ MongoDB connected successfully");
})["catch"](function (err) {
  return console.error("❌ MongoDB connection failed:", err);
}); // === Global Error Handler (Optional but helpful) ===

app.use(function (err, req, res, next) {
  console.error("Global error:", err);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message
  });
}); // === Start Server ===

var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  return console.log("\uD83D\uDE80 Server running on port ".concat(PORT));
});
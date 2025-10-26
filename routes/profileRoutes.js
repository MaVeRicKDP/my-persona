const express = require("express");
const router = express.Router();
const multer = require("multer");
const protect = require("../middleware/authMiddleware");
const User = require("../models/user");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Get Profile
router.get("/", protect, (req, res) => {
  const user = req.user;
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    dob: user.dob,
    address: user.address,
    profileImage: user.profileImage,
  });
});

// Update Profile Info
router.put("/update", protect, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    );
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload Profile Image
router.post("/upload", protect, upload.single("profileImage"), async (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "No image uploaded" });

  const imagePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  await User.findByIdAndUpdate(req.user._id, { profileImage: imagePath });
  res.json({ message: "Profile image updated successfully", profileImage: imagePath });
});

// Delete Account
router.delete("/delete", protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

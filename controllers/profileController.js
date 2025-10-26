const User = require("../models/user");
const multer = require("multer");

// Setup multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, "uploads/"); },
  filename: function (req, file, cb) { cb(null, Date.now() + "-" + file.originalname); },
});
const upload = multer({ storage });

exports.uploadImage = [
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });
      req.user.profileImage = `/uploads/${req.file.filename}`;
      await req.user.save();
      res.status(200).json({ profileImage: req.user.profileImage });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
];

exports.getProfile = async (req, res) => {
  const user = req.user.toObject();
  res.status(200).json(user);
};

exports.editProfile = async (req, res) => {
  try {
    const { firstName, lastName, dob, address } = req.body;
    if (firstName) req.user.firstName = firstName;
    if (lastName) req.user.lastName = lastName;
    if (dob) req.user.dob = dob;
    if (address) req.user.address = address;
    await req.user.save();
    res.status(200).json(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

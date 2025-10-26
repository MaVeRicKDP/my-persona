const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  verified: { type: Boolean, default: false },
  otp: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

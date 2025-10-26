"use strict";

var express = require("express");

var router = express.Router();

var multer = require("multer");

var protect = require("../middleware/authMiddleware");

var User = require("../models/user"); // Multer setup


var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    return cb(null, "uploads/");
  },
  filename: function filename(req, file, cb) {
    return cb(null, Date.now() + "-" + file.originalname);
  }
});
var upload = multer({
  storage: storage
}); // Get Profile

router.get("/", protect, function (req, res) {
  var user = req.user;
  if (!user) return res.status(404).json({
    message: "User not found"
  });
  res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    dob: user.dob,
    address: user.address,
    profileImage: user.profileImage
  });
}); // Update Profile Info

router.put("/update", protect, function _callee(req, res) {
  var updatedUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user._id, req.body, {
            "new": true
          }));

        case 3:
          updatedUser = _context.sent;
          res.json({
            message: "Profile updated successfully",
            user: updatedUser
          });
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Upload Profile Image

router.post("/upload", protect, upload.single("profileImage"), function _callee2(req, res) {
  var imagePath;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (req.file) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "No image uploaded"
          }));

        case 2:
          imagePath = "".concat(req.protocol, "://").concat(req.get("host"), "/uploads/").concat(req.file.filename);
          _context2.next = 5;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user._id, {
            profileImage: imagePath
          }));

        case 5:
          res.json({
            message: "Profile image updated successfully",
            profileImage: imagePath
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // Delete Account

router["delete"]("/delete", protect, function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findByIdAndDelete(req.user._id));

        case 3:
          res.json({
            message: "Account deleted successfully"
          });
          _context3.next = 10;
          break;

        case 6:
          _context3.prev = 6;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 6]]);
});
module.exports = router;
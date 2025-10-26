"use strict";

var User = require("../models/user");

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var nodemailer = require("nodemailer"); // ✅ Email Transporter (Gmail)


var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}); // ✅ Generate JWT Token

var generateToken = function generateToken(id) {
  return jwt.sign({
    id: id
  }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
}; // ✅ REGISTER USER & SEND OTP


exports.register = function _callee(req, res) {
  var _req$body, firstName, lastName, email, password, dob, address, user, hashedPassword, otp;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, firstName = _req$body.firstName, lastName = _req$body.lastName, email = _req$body.email, password = _req$body.password, dob = _req$body.dob, address = _req$body.address;

          if (!(!email || !password || !firstName || !lastName)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "All fields are required"
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          user = _context.sent;

          if (!user) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Email already exists"
          }));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 11:
          hashedPassword = _context.sent;
          otp = Math.floor(100000 + Math.random() * 900000).toString();
          _context.next = 15;
          return regeneratorRuntime.awrap(User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            dob: dob,
            address: address,
            otp: otp,
            verified: false,
            profileImage: "https://api.dicebear.com/8.x/initials/svg?seed=".concat(firstName, "%20").concat(lastName)
          }));

        case 15:
          user = _context.sent;
          _context.next = 18;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your Email - OTP Code",
            text: "Your OTP code is ".concat(otp)
          }));

        case 18:
          res.status(200).json({
            message: "OTP sent to your email"
          });
          _context.next = 25;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](0);
          console.error("Register error:", _context.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 21]]);
}; // ✅ VERIFY OTP


exports.verifyOtp = function _callee2(req, res) {
  var _req$body2, email, otp, user, token;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, email = _req$body2.email, otp = _req$body2.otp;

          if (!(!email || !otp)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Email and OTP required"
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          user = _context2.sent;

          if (user) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 9:
          if (!(String(user.otp).trim() !== String(otp).trim())) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Invalid OTP"
          }));

        case 11:
          user.verified = true;
          user.otp = null;
          _context2.next = 15;
          return regeneratorRuntime.awrap(user.save());

        case 15:
          token = generateToken(user._id);
          res.status(200).json({
            success: true,
            message: "Email verified successfully!",
            token: token,
            user: user
          });
          _context2.next = 23;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](0);
          console.error("OTP Verification error:", _context2.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 19]]);
}; // ✅ LOGIN


exports.login = function _callee3(req, res) {
  var _req$body3, email, password, user, isMatch, token;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body3 = req.body, email = _req$body3.email, password = _req$body3.password;
          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context3.sent;

          if (user) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "Invalid email or password"
          }));

        case 7:
          _context3.next = 9;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 9:
          isMatch = _context3.sent;

          if (isMatch) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", res.status(401).json({
            message: "Invalid email or password"
          }));

        case 12:
          if (user.verified) {
            _context3.next = 14;
            break;
          }

          return _context3.abrupt("return", res.status(403).json({
            message: "Please verify your email before login"
          }));

        case 14:
          token = generateToken(user._id);
          res.status(200).json({
            message: "Login successful",
            token: token,
            user: user
          });
          _context3.next = 22;
          break;

        case 18:
          _context3.prev = 18;
          _context3.t0 = _context3["catch"](0);
          console.error("Login error:", _context3.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 22:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 18]]);
}; // ✅ FORGOT PASSWORD


exports.forgotPassword = function _callee4(req, res) {
  var email, user, otp;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          email = req.body.email;
          _context4.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context4.sent;

          if (user) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 7:
          otp = Math.floor(100000 + Math.random() * 900000).toString();
          user.otp = otp;
          _context4.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          _context4.next = 13;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: "Your OTP for password reset is ".concat(otp)
          }));

        case 13:
          res.status(200).json({
            message: "Password reset OTP sent to email"
          });
          _context4.next = 20;
          break;

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](0);
          console.error("Forgot password error:", _context4.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 20:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 16]]);
}; // ✅ RESET PASSWORD


exports.resetPassword = function _callee5(req, res) {
  var _req$body4, email, otp, newPassword, user;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _req$body4 = req.body, email = _req$body4.email, otp = _req$body4.otp, newPassword = _req$body4.newPassword;
          _context5.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context5.sent;

          if (user) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 7:
          if (!(String(user.otp).trim() !== String(otp).trim())) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            message: "Invalid OTP"
          }));

        case 9:
          _context5.next = 11;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword, 10));

        case 11:
          user.password = _context5.sent;
          user.otp = null;
          _context5.next = 15;
          return regeneratorRuntime.awrap(user.save());

        case 15:
          res.status(200).json({
            message: "Password reset successful"
          });
          _context5.next = 22;
          break;

        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](0);
          console.error("Reset password error:", _context5.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 22:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 18]]);
};
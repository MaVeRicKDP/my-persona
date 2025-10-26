const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  if (token.startsWith("Bearer ")) token = token.slice(7, token.length);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token invalid" });
  }
};

module.exports = protect;

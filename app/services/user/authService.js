const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config({ silent: true });

// Hash Password
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the generated salt
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

// Compare Passwords
const comparePassword = (inputPassword, storedPassword, callback) => {
  bcrypt.compare(inputPassword, storedPassword, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};
// Generate JWT Token
const generateJWT = (userId, expirationDate, callback) => {
  const payload = { id: userId };
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: expirationDate },
    (err, token) => {
      if (err) return callback(err);
      callback(null, token);
    }
  );
};

// Verify JWT Token (shared with middleware for validation)
const verifyJWT = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // Check if the token has expired
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTimestamp) {
      throw new Error("Token has expired");
    }
    return decodedToken; // Return decoded token if valid and not expired
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  generateJWT,
  verifyJWT,
};

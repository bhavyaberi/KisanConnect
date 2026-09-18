const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT for the given user.
 * @param {Object} user - Mongoose user document
 * @returns {string} signed JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateToken;

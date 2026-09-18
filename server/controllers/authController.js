const bcrypt = require("bcryptjs");
const User = require("../models/mongodb/User");
const generateToken = require("../utils/generateToken");

// ---------------------------------------------------------------------------
// Helper: build safe user object (never expose password)
// ---------------------------------------------------------------------------
const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  language: user.language,
});

// ---------------------------------------------------------------------------
// Helper: validate email format
// ---------------------------------------------------------------------------
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------
const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, language } = req.body;

    // --- Field validation ---
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Name is required." });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format." });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: "Phone number is required." });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 6 characters." });
    }

    // --- Role validation ---
    // Public registration only allows farmer / buyer
    // Admin accounts must be created through a protected admin-only route
    const allowedPublicRoles = ["farmer", "buyer"];
    if (!role || !allowedPublicRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either 'farmer' or 'buyer'. Admin accounts cannot be publicly registered.",
      });
    }

    // --- Duplicate email check ---
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email is already registered." });
    }

    // --- Hash password ---
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // --- Create user ---
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      role,
      language: language || "en",
    });

    // --- Generate token ---
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: safeUser(user),
      token,
    });
  } catch (error) {
    // Mongoose duplicate key error (race condition)
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Email is already registered." });
    }
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required." });
    }

    // Find user (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Generic error — do NOT reveal whether email or password was wrong
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: safeUser(user),
      token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ---------------------------------------------------------------------------
// GET /api/auth/me   (protected)
// ---------------------------------------------------------------------------
const getMe = async (req, res) => {
  try {
    // req.user is already attached by the protect middleware (no password field)
    return res.status(200).json({
      success: true,
      user: safeUser(req.user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

module.exports = { register, login, getMe };

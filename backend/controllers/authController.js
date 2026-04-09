const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Format user profile for response (matches frontend Profile type)
const formatProfile = (user) => ({
  id: user._id.toString(),
  user_id: user._id.toString(),
  full_name: user.fullName,
  email: user.email,
  role: user.role,
  phone: user.phone || null,
  address: user.address || null,
  created_at: user.createdAt?.toISOString() || new Date().toISOString(),
  updated_at: user.updatedAt?.toISOString() || new Date().toISOString(),
});

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      fullName,
      role: 'customer',
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      user: { id: user._id.toString(), email: user.email },
      profile: formatProfile(user),
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message || 'Registration failed.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      user: { id: user._id.toString(), email: user.email },
      profile: formatProfile(user),
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Login failed.' });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      user: { id: user._id.toString(), email: user.email },
      profile: formatProfile(user),
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
};

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { logActivity } = require('../middleware/activityLogger');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Only admin can create admins or project managers
    const allowedRole =
      req.user && req.user.role === 'admin' ? role || 'employee' : 'employee';

    const user = await User.create({ name, email, password, role: allowedRole });
    const token = signToken(user.id);

    await logActivity(user.id, 'REGISTER', 'User', user.id, { email });

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: { user, token },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    await user.update({ lastLoginAt: new Date() });
    const token = signToken(user.id);

    await logActivity(user.id, 'LOGIN', 'User', user.id, { email }, req.ip);

    res.json({
      success: true,
      message: 'Login successful.',
      data: { user, token },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};

// PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }
    user.password = newPassword;
    await user.save();
    await logActivity(user.id, 'CHANGE_PASSWORD', 'User', user.id, null, req.ip);
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getMe, changePassword };

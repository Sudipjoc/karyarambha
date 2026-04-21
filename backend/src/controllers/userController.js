const { User, Task, ActivityLog } = require('../models');
const { logActivity } = require('../middleware/activityLogger');

// GET /api/users  (admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: { users } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: { user } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/users/:id  (admin only)
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const { name, email, role, isActive } = req.body;
    await user.update({ name, email, role, isActive });

    await logActivity(req.user.id, 'UPDATE', 'User', user.id, { updatedFields: Object.keys(req.body) }, req.ip);

    res.json({ success: true, message: 'User updated.', data: { user } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/users/:id  (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (user.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account.' });
    }

    await user.update({ isActive: false });
    await logActivity(req.user.id, 'DELETE', 'User', user.id, { email: user.email }, req.ip);

    res.json({ success: true, message: 'User deactivated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/:id/activities  (admin only)
const getUserActivities = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      where: { userId: req.params.id },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    res.json({ success: true, data: { logs } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser, getUserActivities };

const { ActivityLog, User, Task } = require('../models');

// GET /api/admin/audit-trail
const getAuditTrail = async (req, res) => {
  try {
    const { page = 1, limit = 50, entityType, userId } = req.query;
    const where = {};
    if (entityType) where.entityType = entityType;
    if (userId) where.userId = userId;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: logs } = await ActivityLog.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'role'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      data: { logs, total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/dashboard-stats
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalTasks, tasksByStatus, recentLogs] = await Promise.all([
      User.count({ where: { isActive: true } }),
      Task.count(),
      Task.findAll({
        attributes: [
          'status',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
        ],
        group: ['status'],
      }),
      ActivityLog.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      }),
    ]);

    res.json({
      success: true,
      data: { totalUsers, totalTasks, tasksByStatus, recentLogs },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAuditTrail, getDashboardStats };

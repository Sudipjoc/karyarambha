const { ActivityLog } = require('../models');

/**
 * Creates an audit trail entry.
 * @param {number|null} userId
 * @param {string} action  - e.g. 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
 * @param {string} entityType - e.g. 'Task', 'Blog', 'User'
 * @param {number|null} entityId
 * @param {object|null} details
 * @param {string|null} ipAddress
 */
const logActivity = async (userId, action, entityType, entityId, details = null, ipAddress = null) => {
  try {
    await ActivityLog.create({ userId, action, entityType, entityId, details, ipAddress });
  } catch (err) {
    console.error('Activity log error:', err.message);
  }
};

/**
 * Express middleware factory – call after a successful operation.
 * Example:  router.post('/tasks', protect, createTask, activityMiddleware('CREATE', 'Task'))
 * It reads req.user and res.locals.entityId set by the controller.
 */
const activityMiddleware = (action, entityType) => {
  return async (req, res, next) => {
    const userId = req.user ? req.user.id : null;
    const entityId = res.locals.entityId || null;
    const ip = req.ip || req.connection.remoteAddress;
    await logActivity(userId, action, entityType, entityId, null, ip);
    next();
  };
};

module.exports = { logActivity, activityMiddleware };

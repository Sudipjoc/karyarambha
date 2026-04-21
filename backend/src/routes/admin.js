const router = require('express').Router();
const { getAuditTrail, getDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.use(protect, authorize('admin'));
router.get('/audit-trail', getAuditTrail);
router.get('/dashboard-stats', getDashboardStats);

module.exports = router;

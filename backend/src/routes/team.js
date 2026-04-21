const router = require('express').Router();
const {
  getActiveTeam, getAllTeam, createMember, updateMember, deleteMember,
} = require('../controllers/teamController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.get('/', getActiveTeam);
router.get('/admin', protect, authorize('admin', 'project_manager'), getAllTeam);
router.post('/', protect, authorize('admin', 'project_manager'), createMember);
router.put('/:id', protect, authorize('admin', 'project_manager'), updateMember);
router.delete('/:id', protect, authorize('admin', 'project_manager'), deleteMember);

module.exports = router;

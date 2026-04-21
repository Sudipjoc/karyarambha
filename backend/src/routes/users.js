const router = require('express').Router();
const { getUsers, getUserById, updateUser, deleteUser, getUserActivities } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.use(protect);
router.get('/', authorize('admin'), getUsers);
router.get('/:id', authorize('admin', 'project_manager'), getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.get('/:id/activities', authorize('admin'), getUserActivities);

module.exports = router;

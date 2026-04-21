const router = require('express').Router();
const {
  getActiveServices, getAllServices, createService, updateService, deleteService,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.get('/', getActiveServices);
router.get('/admin', protect, authorize('admin', 'project_manager'), getAllServices);
router.post('/', protect, authorize('admin', 'project_manager'), createService);
router.put('/:id', protect, authorize('admin', 'project_manager'), updateService);
router.delete('/:id', protect, authorize('admin', 'project_manager'), deleteService);

module.exports = router;

const router = require('express').Router();
const {
  getBlocks, getAllBlocks, createBlock, updateBlock, deleteBlock, reorderBlocks,
} = require('../controllers/contentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// Public
router.get('/', getBlocks);

// Admin/PM
router.get('/admin', protect, authorize('admin', 'project_manager'), getAllBlocks);
router.post('/', protect, authorize('admin', 'project_manager'), createBlock);
router.put('/reorder', protect, authorize('admin', 'project_manager'), reorderBlocks);
router.put('/:id', protect, authorize('admin', 'project_manager'), updateBlock);
router.delete('/:id', protect, authorize('admin', 'project_manager'), deleteBlock);

module.exports = router;

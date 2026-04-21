const router = require('express').Router();
const {
  getActiveTestimonials, getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.get('/', getActiveTestimonials);
router.get('/admin', protect, authorize('admin', 'project_manager'), getAllTestimonials);
router.post('/', protect, authorize('admin', 'project_manager'), createTestimonial);
router.put('/:id', protect, authorize('admin', 'project_manager'), updateTestimonial);
router.delete('/:id', protect, authorize('admin', 'project_manager'), deleteTestimonial);

module.exports = router;

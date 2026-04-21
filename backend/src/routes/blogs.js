const router = require('express').Router();
const {
  getPublishedBlogs, getBlogBySlug, getAllBlogs, createBlog, updateBlog, deleteBlog,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

// Public
router.get('/', getPublishedBlogs);
router.get('/post/:slug', getBlogBySlug);

// Admin/PM
router.get('/admin', protect, authorize('admin', 'project_manager'), getAllBlogs);
router.post('/', protect, authorize('admin', 'project_manager'), createBlog);
router.put('/:id', protect, authorize('admin', 'project_manager'), updateBlog);
router.delete('/:id', protect, authorize('admin', 'project_manager'), deleteBlog);

module.exports = router;

const router = require('express').Router();
const { getTasks, getTaskById, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.use(protect);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', authorize('admin', 'project_manager'), createTask);
router.put('/:id', updateTask);  // employees can update status of their own tasks
router.delete('/:id', authorize('admin', 'project_manager'), deleteTask);

module.exports = router;

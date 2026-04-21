const { Task, User } = require('../models');
const { logActivity } = require('../middleware/activityLogger');
const { Op } = require('sequelize');

const includeOptions = [
  { model: User, as: 'assignee', attributes: ['id', 'name', 'email', 'role'] },
  { model: User, as: 'creator', attributes: ['id', 'name', 'email', 'role'] },
];

// GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo, page = 1, limit = 20 } = req.query;
    const where = {};

    // Employees only see their own tasks
    if (req.user.role === 'employee') {
      where.assignedTo = req.user.id;
    } else if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      include: includeOptions,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      data: { tasks, total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, { include: includeOptions });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    // Employees can only view their own tasks
    if (req.user.role === 'employee' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, data: { task } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, deadline, assignedTo } = req.body;

    // Validate assignee exists
    if (assignedTo) {
      const assignee = await User.findByPk(assignedTo);
      if (!assignee) return res.status(400).json({ success: false, message: 'Assignee not found.' });
    }

    const task = await Task.create({
      title, description, status, priority, deadline, assignedTo,
      createdBy: req.user.id,
    });

    const taskWithUsers = await Task.findByPk(task.id, { include: includeOptions });
    await logActivity(req.user.id, 'CREATE', 'Task', task.id, { title }, req.ip);

    res.status(201).json({ success: true, message: 'Task created.', data: { task: taskWithUsers } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    // Employees can only update status of their own tasks
    if (req.user.role === 'employee') {
      if (task.assignedTo !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }
      const { status } = req.body;
      await task.update({ status });
    } else {
      const { title, description, status, priority, deadline, assignedTo } = req.body;
      await task.update({ title, description, status, priority, deadline, assignedTo });
    }

    const updated = await Task.findByPk(task.id, { include: includeOptions });
    await logActivity(req.user.id, 'UPDATE', 'Task', task.id, { updatedFields: Object.keys(req.body) }, req.ip);

    res.json({ success: true, message: 'Task updated.', data: { task: updated } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/tasks/:id  (admin / project_manager only)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    await logActivity(req.user.id, 'DELETE', 'Task', task.id, { title: task.title }, req.ip);
    await task.destroy();

    res.json({ success: true, message: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };

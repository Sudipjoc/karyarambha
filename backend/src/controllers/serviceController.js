const { Service } = require('../models');
const { logActivity } = require('../middleware/activityLogger');

// GET /api/services  (public)
const getActiveServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { isActive: true },
      order: [['order', 'ASC'], ['title', 'ASC']],
    });
    res.json({ success: true, data: { services } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/services/admin
const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({ order: [['order', 'ASC']] });
    res.json({ success: true, data: { services } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/services
const createService = async (req, res) => {
  try {
    const { title, description, icon, order, metaTitle, metaDescription } = req.body;
    const service = await Service.create({
      title, description, icon, order,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || description.substring(0, 160),
    });
    await logActivity(req.user.id, 'CREATE', 'Service', service.id, { title }, req.ip);
    res.status(201).json({ success: true, message: 'Service created.', data: { service } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/services/:id
const updateService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    const { title, description, icon, order, isActive, metaTitle, metaDescription } = req.body;
    await service.update({ title, description, icon, order, isActive, metaTitle, metaDescription });
    await logActivity(req.user.id, 'UPDATE', 'Service', service.id, { title: service.title }, req.ip);
    res.json({ success: true, message: 'Service updated.', data: { service } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/services/:id
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    await logActivity(req.user.id, 'DELETE', 'Service', service.id, { title: service.title }, req.ip);
    await service.destroy();
    res.json({ success: true, message: 'Service deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getActiveServices, getAllServices, createService, updateService, deleteService };

const { Testimonial } = require('../models');
const { logActivity } = require('../middleware/activityLogger');

// GET /api/testimonials  (public)
const getActiveTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: { testimonials } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/testimonials/admin
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: { testimonials } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/testimonials
const createTestimonial = async (req, res) => {
  try {
    const { clientName, company, content, rating, photoUrl } = req.body;
    const testimonial = await Testimonial.create({ clientName, company, content, rating, photoUrl });
    await logActivity(req.user.id, 'CREATE', 'Testimonial', testimonial.id, { clientName }, req.ip);
    res.status(201).json({ success: true, message: 'Testimonial created.', data: { testimonial } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/testimonials/:id
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    const { clientName, company, content, rating, photoUrl, isActive } = req.body;
    await testimonial.update({ clientName, company, content, rating, photoUrl, isActive });
    await logActivity(req.user.id, 'UPDATE', 'Testimonial', testimonial.id, { clientName: testimonial.clientName }, req.ip);
    res.json({ success: true, message: 'Testimonial updated.', data: { testimonial } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/testimonials/:id
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    await logActivity(req.user.id, 'DELETE', 'Testimonial', testimonial.id, { clientName: testimonial.clientName }, req.ip);
    await testimonial.destroy();
    res.json({ success: true, message: 'Testimonial deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getActiveTestimonials, getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };

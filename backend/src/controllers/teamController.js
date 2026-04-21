const { TeamMember } = require('../models');
const { logActivity } = require('../middleware/activityLogger');

// GET /api/team  (public)
const getActiveTeam = async (req, res) => {
  try {
    const members = await TeamMember.findAll({
      where: { isActive: true },
      order: [['order', 'ASC'], ['name', 'ASC']],
    });
    res.json({ success: true, data: { members } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/team/admin  (admin/pm – all)
const getAllTeam = async (req, res) => {
  try {
    const members = await TeamMember.findAll({ order: [['order', 'ASC']] });
    res.json({ success: true, data: { members } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/team
const createMember = async (req, res) => {
  try {
    const { name, designation, bio, photoUrl, linkedinUrl, order } = req.body;
    const member = await TeamMember.create({ name, designation, bio, photoUrl, linkedinUrl, order });
    await logActivity(req.user.id, 'CREATE', 'TeamMember', member.id, { name }, req.ip);
    res.status(201).json({ success: true, message: 'Team member created.', data: { member } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/team/:id
const updateMember = async (req, res) => {
  try {
    const member = await TeamMember.findByPk(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found.' });
    const { name, designation, bio, photoUrl, linkedinUrl, order, isActive } = req.body;
    await member.update({ name, designation, bio, photoUrl, linkedinUrl, order, isActive });
    await logActivity(req.user.id, 'UPDATE', 'TeamMember', member.id, { name: member.name }, req.ip);
    res.json({ success: true, message: 'Team member updated.', data: { member } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/team/:id
const deleteMember = async (req, res) => {
  try {
    const member = await TeamMember.findByPk(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found.' });
    await logActivity(req.user.id, 'DELETE', 'TeamMember', member.id, { name: member.name }, req.ip);
    await member.destroy();
    res.json({ success: true, message: 'Team member deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getActiveTeam, getAllTeam, createMember, updateMember, deleteMember };

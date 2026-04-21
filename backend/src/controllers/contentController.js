const { ContentBlock, User } = require('../models');
const { logActivity } = require('../middleware/activityLogger');

// GET /api/content  (public)
const getBlocks = async (req, res) => {
  try {
    const { section } = req.query;
    const where = { isActive: true };
    if (section) where.section = section;

    const blocks = await ContentBlock.findAll({
      where,
      order: [
        ['section', 'ASC'],
        ['order', 'ASC'],
      ],
    });
    res.json({ success: true, data: { blocks } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/content/admin  (admin/pm only – includes inactive)
const getAllBlocks = async (req, res) => {
  try {
    const blocks = await ContentBlock.findAll({
      include: [
        { model: User, as: 'createdByUser', attributes: ['id', 'name'] },
        { model: User, as: 'updatedByUser', attributes: ['id', 'name'] },
      ],
      order: [
        ['section', 'ASC'],
        ['order', 'ASC'],
      ],
    });
    res.json({ success: true, data: { blocks } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/content
const createBlock = async (req, res) => {
  try {
    const { section, blockType, title, content, metadata, order } = req.body;
    const block = await ContentBlock.create({
      section, blockType, title, content, metadata, order,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });
    await logActivity(req.user.id, 'CREATE', 'ContentBlock', block.id, { section, blockType }, req.ip);
    res.status(201).json({ success: true, message: 'Content block created.', data: { block } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/content/:id
const updateBlock = async (req, res) => {
  try {
    const block = await ContentBlock.findByPk(req.params.id);
    if (!block) return res.status(404).json({ success: false, message: 'Block not found.' });

    const { section, blockType, title, content, metadata, order, isActive } = req.body;
    await block.update({ section, blockType, title, content, metadata, order, isActive, updatedBy: req.user.id });

    await logActivity(req.user.id, 'UPDATE', 'ContentBlock', block.id, { updatedFields: Object.keys(req.body) }, req.ip);
    res.json({ success: true, message: 'Block updated.', data: { block } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/content/:id
const deleteBlock = async (req, res) => {
  try {
    const block = await ContentBlock.findByPk(req.params.id);
    if (!block) return res.status(404).json({ success: false, message: 'Block not found.' });

    await logActivity(req.user.id, 'DELETE', 'ContentBlock', block.id, { section: block.section }, req.ip);
    await block.destroy();
    res.json({ success: true, message: 'Block deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/content/reorder  – bulk reorder
const reorderBlocks = async (req, res) => {
  try {
    const { blocks } = req.body; // [{ id, order }]
    if (!Array.isArray(blocks)) {
      return res.status(400).json({ success: false, message: 'blocks array required.' });
    }
    await Promise.all(
      blocks.map(({ id, order }) => ContentBlock.update({ order }, { where: { id } }))
    );
    await logActivity(req.user.id, 'REORDER', 'ContentBlock', null, { count: blocks.length }, req.ip);
    res.json({ success: true, message: 'Blocks reordered.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getBlocks, getAllBlocks, createBlock, updateBlock, deleteBlock, reorderBlocks };

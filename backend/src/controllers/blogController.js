const { Blog, User } = require('../models');
const { logActivity } = require('../middleware/activityLogger');
const slugify = require('slugify');

// GET /api/blogs  (public – published only)
const getPublishedBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: blogs } = await Blog.findAndCountAll({
      where: { status: 'published' },
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }],
      order: [['publishedAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      attributes: { exclude: [] },
    });

    res.json({
      success: true,
      data: { blogs, total: count, page: parseInt(page), pages: Math.ceil(count / parseInt(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/blogs/:slug  (public)
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      where: { slug: req.params.slug, status: 'published' },
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }],
    });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found.' });
    res.json({ success: true, data: { blog } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/blogs/admin  (admin/pm – all statuses)
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: { blogs } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/blogs
const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, featuredImage, status, metaTitle, metaDescription, tags } = req.body;

    let slug = slugify(title, { lower: true, strict: true });
    // Ensure unique slug
    const existing = await Blog.findOne({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const blog = await Blog.create({
      title, slug, content, excerpt, featuredImage, status,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || (excerpt ? excerpt.substring(0, 160) : ''),
      tags,
      authorId: req.user.id,
    });

    await logActivity(req.user.id, 'CREATE', 'Blog', blog.id, { title, status }, req.ip);
    res.status(201).json({ success: true, message: 'Blog created.', data: { blog } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/blogs/:id
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found.' });

    const { title, content, excerpt, featuredImage, status, metaTitle, metaDescription, tags } = req.body;

    // Regenerate slug if title changed
    let updatedSlug = blog.slug;
    if (title && title !== blog.title) {
      updatedSlug = slugify(title, { lower: true, strict: true });
      const existing = await Blog.findOne({ where: { slug: updatedSlug } });
      if (existing && existing.id !== blog.id) updatedSlug = `${updatedSlug}-${Date.now()}`;
    }

    await blog.update({ title, slug: updatedSlug, content, excerpt, featuredImage, status, metaTitle, metaDescription, tags });
    await logActivity(req.user.id, 'UPDATE', 'Blog', blog.id, { title: blog.title, status }, req.ip);

    res.json({ success: true, message: 'Blog updated.', data: { blog } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/blogs/:id
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found.' });

    await logActivity(req.user.id, 'DELETE', 'Blog', blog.id, { title: blog.title }, req.ip);
    await blog.destroy();
    res.json({ success: true, message: 'Blog deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getPublishedBlogs, getBlogBySlug, getAllBlogs, createBlog, updateBlog, deleteBlog };

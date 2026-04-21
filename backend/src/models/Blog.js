const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const slugify = require('slugify');

const Blog = sequelize.define(
  'Blog',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(250),
      allowNull: false,
      validate: { notEmpty: true, len: [5, 250] },
    },
    slug: {
      type: DataTypes.STRING(300),
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    featuredImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft',
    },
    metaTitle: {
      type: DataTypes.STRING(160),
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.STRING(320),
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'blogs',
    timestamps: true,
    hooks: {
      beforeCreate: (blog) => {
        if (!blog.slug && blog.title) {
          blog.slug = slugify(blog.title, { lower: true, strict: true });
        }
        if (!blog.metaTitle && blog.title) {
          blog.metaTitle = blog.title;
        }
        if (!blog.metaDescription && blog.excerpt) {
          blog.metaDescription = blog.excerpt.substring(0, 160);
        }
        if (blog.status === 'published' && !blog.publishedAt) {
          blog.publishedAt = new Date();
        }
      },
      beforeUpdate: (blog) => {
        if (blog.changed('status') && blog.status === 'published' && !blog.publishedAt) {
          blog.publishedAt = new Date();
        }
      },
    },
  }
);

module.exports = Blog;

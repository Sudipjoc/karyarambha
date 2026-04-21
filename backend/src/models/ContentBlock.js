const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContentBlock = sequelize.define(
  'ContentBlock',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    section: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'hero, about, services, portfolio, contact, footer',
    },
    blockType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'heading, paragraph, image, button, card, list',
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue('metadata');
        try {
          return raw ? JSON.parse(raw) : {};
        } catch {
          return {};
        }
      },
      set(value) {
        this.setDataValue(
          'metadata',
          value ? JSON.stringify(value) : null
        );
      },
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    tableName: 'content_blocks',
    timestamps: true,
  }
);

module.exports = ContentBlock;

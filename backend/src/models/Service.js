const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define(
  'Service',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notEmpty: true },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Icon class name or image URL',
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    metaTitle: {
      type: DataTypes.STRING(160),
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.STRING(320),
      allowNull: true,
    },
  },
  {
    tableName: 'services',
    timestamps: true,
  }
);

module.exports = Service;

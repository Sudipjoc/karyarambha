const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ActivityLog = sequelize.define(
  'ActivityLog',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    entityType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue('details');
        try {
          return raw ? JSON.parse(raw) : null;
        } catch {
          return raw;
        }
      },
      set(value) {
        this.setDataValue(
          'details',
          value ? JSON.stringify(value) : null
        );
      },
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
  },
  {
    tableName: 'activity_logs',
    timestamps: true,
    updatedAt: false,
  }
);

module.exports = ActivityLog;

const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');
const ActivityLog = require('./ActivityLog');
const ContentBlock = require('./ContentBlock');
const Blog = require('./Blog');
const TeamMember = require('./TeamMember');
const Testimonial = require('./Testimonial');
const Service = require('./Service');

// User <-> Task associations
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });
Task.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
User.hasMany(Task, { as: 'assignedTasks', foreignKey: 'assignedTo' });
User.hasMany(Task, { as: 'createdTasks', foreignKey: 'createdBy' });

// ActivityLog associations
ActivityLog.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(ActivityLog, { as: 'activities', foreignKey: 'userId' });

// Blog associations
Blog.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
User.hasMany(Blog, { as: 'blogs', foreignKey: 'authorId' });

// ContentBlock associations
ContentBlock.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });
ContentBlock.belongsTo(User, { as: 'updatedByUser', foreignKey: 'updatedBy' });

module.exports = {
  sequelize,
  User,
  Task,
  ActivityLog,
  ContentBlock,
  Blog,
  TeamMember,
  Testimonial,
  Service,
};

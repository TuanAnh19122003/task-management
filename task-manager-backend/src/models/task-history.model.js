const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const Task = require('./task.model');

const TaskHistory = sequelize.define('TaskHistory', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    taskId: { type: DataTypes.INTEGER, allowNull: false },
    oldStatus: { type: DataTypes.ENUM('todo', 'doing', 'done') },
    newStatus: { type: DataTypes.ENUM('todo', 'doing', 'done') },
    changedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'task_histories',
    timestamps: false
});

TaskHistory.belongsTo(Task, { foreignKey: 'taskId', onDelete: 'CASCADE', as: 'task' });
Task.hasMany(TaskHistory, { foreignKey: 'taskId', as: 'histories' });

module.exports = TaskHistory;
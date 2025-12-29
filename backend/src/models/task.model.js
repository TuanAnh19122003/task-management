const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./user.model');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    title: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { type: DataTypes.TEXT },
    status: { 
        type: DataTypes.ENUM('todo', 'doing', 'done'), 
        defaultValue: 'todo' 
    },
    deadline: { type: DataTypes.DATE }
}, {
    tableName: 'tasks',
    timestamps: true
});

Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });

module.exports = Task;
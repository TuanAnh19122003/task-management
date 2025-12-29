const sequelize = require('../config/database');
const User = require('./user.model');
const Task = require('./task.model');
const TaskHistory = require('./task-history.model');

const db = {
    User,
    Task,
    TaskHistory,
    sequelize
}

sequelize.sync({ force: false })
    .then(() => {
        console.log('Connection successful');
    })
    .catch((error) => {
        console.error('Connection error:', error);
        throw error;
    });

module.exports = db;
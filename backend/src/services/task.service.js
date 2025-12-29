const Task = require('../models/task.model');

class TaskService {
    static async getAllTask() {
        const tasks = await Task.findAll();
        return tasks;
    }

    static async createTask(taskData) {
        const task = await Task.create(taskData);
        return task;
    }

    static async getTaskById(taskId) {
        const task = await Task.findByPk(taskId);
        return task;
    }

    static async updateTask(taskId, updateData) {
        const task = await Task.findByPk(taskId);
        if (!task) {
            throw new Error('Task not found');
        }
        await task.update(updateData);
        return task;
    }

    static async deleteTask(taskId) {
        const task = await Task.findByPk(taskId);
        if (!task) {
            throw new Error('Task not found');
        }
        await task.destroy();
        return;
    }
}

module.exports = TaskService;
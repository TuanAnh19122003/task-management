const TaskService = require('../services/task.service');

class TaskController {
    async getAllTask(req, res) {
        try {
            const tasks = await TaskService.getAllTask();
            res.status(200).json({
                message: 'Tasks retrieved successfully',
                success: true,
                data: tasks
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving tasks',
                success: false,
                error: error.message
            });
        }
    }

    async createTask(req, res) {
        try {
            const data = { ...req.body, userId: req.user.id };
            const task = await TaskService.createTask(data);
            res.status(201).json({
                message: 'Task created successfully',
                success: true,
                data: task
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error creating task',
                success: false,
                error: error.message
            });
        }
    }

    async getTaskById(req, res) {
        try {
            const task = await TaskService.getTaskById(req.params.id);
            res.status(200).json({
                message: 'Task retrieved successfully',
                success: true,
                data: task
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving task',
                success: false,
                error: error.message
            });
        }
    }

    async updateTask(req, res) {
        try {
            const id = req.params.id;
            const data = { ...req.body, userId: req.user.id }; // chỉ body + userId
            const task = await TaskService.updateTask(id, data);
            res.status(200).json({
                message: 'Task updated successfully',
                success: true,
                data: task
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error updating task',
                success: false,
                error: error.message
            });
        }
    }

    async deleteTask(req, res) {
        try {
            const id = req.params.id;
            await TaskService.deleteTask(id);
            res.status(200).json({
                message: 'Task deleted successfully',
                success: true
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error deleting task',
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new TaskController();
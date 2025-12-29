const TaskService = require('../services/task.service');

class TaskController {
    async getAllTask(req, res) {
        try {
            const tasks = await TaskService.getAllTask(req.user.id);
            res.status(200).json({ success: true, data: tasks });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async createTask(req, res) {
        try {
            const data = { ...req.body, userId: req.user.id };
            const task = await TaskService.createTask(data);
            res.status(201).json({ success: true, data: task });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async getTaskById(req, res) {
        try {
            const task = await TaskService.getTaskById(req.params.id, req.user.id);
            res.status(200).json({ success: true, data: task });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async updateTask(req, res) {
        try {
            const id = req.params.id;
            const userId = req.user.id; // đã là number
            const data = { ...req.body }; // không include userId trong data
            const task = await TaskService.updateTask(id, data, userId);
            res.status(200).json({ success: true, data: task });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }


    async deleteTask(req, res) {
        try {
            await TaskService.deleteTask(req.params.id, req.user.id);
            res.status(200).json({ success: true, message: 'Task deleted successfully' });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async getTaskHistory(req, res) {
        try {
            const histories = await TaskService.getTaskHistory(req.params.id, req.user.id);
            res.status(200).json({ success: true, data: histories });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}

module.exports = new TaskController();

const Task = require('../models/task.model');
const TaskHistory = require('../models/task-history.model');

class TaskService {
    static async getAllTask(userId) {
        return await Task.findAll({ where: { userId } });
    }

    static async createTask(taskData) {
        const task = await Task.create(taskData);
        // Không cần lưu history khi create
        return task;
    }

    static async getTaskById(id, userId) {
        const task = await Task.findByPk(id);
        if (!task) throw new Error('Task not found');
        if (task.userId !== userId) throw new Error('Không có quyền xem task');
        return task;
    }

    static async updateTask(id, data, userId) {
        const task = await Task.findByPk(id);
        if (!task) throw new Error('Task not found');
        if (task.userId !== userId) throw new Error('Không có quyền chỉnh sửa task');

        // lưu history nếu status thay đổi
        if (data.status && data.status !== task.status) {
            await TaskHistory.create({
                taskId: id,
                oldStatus: task.status,
                newStatus: data.status
            });
        }

        Object.assign(task, data);
        return await task.save();
    }


    static async deleteTask(id, userId) {
        const task = await Task.findByPk(id);
        if (!task) throw new Error('Task not found');
        if (task.userId !== userId) throw new Error('Không có quyền xóa task');

        await task.destroy();
        return;
    }

    static async getTaskHistory(id, userId) {
        const task = await Task.findByPk(id);
        if (!task) throw new Error('Task not found');
        if (task.userId !== userId) throw new Error('Không có quyền xem task');

        const histories = await TaskHistory.findAll({
            where: { taskId: id },
            order: [['changedAt', 'ASC']]
        });
        return histories;
    }
}

module.exports = TaskService;

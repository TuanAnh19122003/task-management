const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const TaskController = require('../controllers/task.controller');

router.get('/', authMiddleware, TaskController.getAllTask);
router.get('/:id', authMiddleware, TaskController.getTaskById);
router.post('/', authMiddleware, TaskController.createTask);
router.put('/:id', authMiddleware, TaskController.updateTask);
router.delete('/:id', authMiddleware, TaskController.deleteTask);

module.exports = router;
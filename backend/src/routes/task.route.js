const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const TaskController = require('../controllers/task.controller');

router.use(authMiddleware);

router.get('/', TaskController.getAllTask);
router.post('/', TaskController.createTask);
router.get('/:id', TaskController.getTaskById);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);
router.get('/:id/history', TaskController.getTaskHistory);

module.exports = router;

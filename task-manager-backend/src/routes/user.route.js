const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const UserController = require('../controllers/user.controller');

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', upload.single('avatar'), UserController.createUser);
router.put('/:id', upload.single('avatar'), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;
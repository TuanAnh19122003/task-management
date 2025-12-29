const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const AuthController = require('../controllers/auth.controller');
const upload = require('../middlewares/multer.middleware');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.get('/me', authMiddleware, AuthController.getMe);
router.put('/me', authMiddleware, upload.single('avatar'), AuthController.updateMe);

module.exports = router;

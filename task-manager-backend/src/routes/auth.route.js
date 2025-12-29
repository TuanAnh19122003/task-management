const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const AuthController = require('../controllers/auth.controller');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.get('/me', authMiddleware, AuthController.getMe);

module.exports = router;

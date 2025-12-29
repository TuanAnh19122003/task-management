const AuthService = require('../services/auth.service');

class AuthController {
    static async register(req, res) {
        try {
            const user = await AuthService.register(req.body);
            res.status(201).json({ message: 'Đăng ký thành công', success: true, user });
        } catch (err) {
            res.status(400).json({ message: err.message, success: false });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            res.json({ message: 'Đăng nhập thành công', success: true, ...result });
        } catch (err) {
            res.status(400).json({ message: err.message, success: false });
        }
    }
}

module.exports = AuthController;

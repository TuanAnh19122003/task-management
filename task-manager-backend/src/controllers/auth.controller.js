const AuthService = require('../services/auth.service');
const User = require('../models/user.model');
const UserService = require('../services/user.service');
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

    static async getMe(req, res) {
        try {
            res.status(200).json({
                success: true,
                data: req.user
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Lỗi server khi lấy thông tin người dùng"
            });
        }
    }

}

module.exports = AuthController;

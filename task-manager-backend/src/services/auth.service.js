const User = require('../models/user.model');
const { hashPass, comparePass } = require('../utils/hashPass');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const fs = require('fs');   // THÊM DÒNG NÀY
const path = require('path'); // THÊM DÒNG NÀY

class AuthService {
    static async register(data) {
        const existing = await User.findOne({ where: { email: data.email } });
        if (existing) throw new Error('Email đã tồn tại');

        const hashedPassword = await hashPass(data.password);
        data.password = hashedPassword;

        const user = await User.create(data);
        return user;
    }

    static async login(email, password) {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error('User không tồn tại');

        const isMatch = await comparePass(password, user.password);
        if (!isMatch) throw new Error('Mật khẩu sai');

        const token = jwt.sign(
            { id: user.id, email: user.email },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        return { user, token };
    }

    static async updateMe(userId, data, file) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User không tồn tại');

        // Xử lý avatar nếu có file mới
        if (file) {
            // Xóa ảnh cũ nếu có
            if (user.avatar) {
                const oldImagePath = path.join(__dirname, '../../', user.avatar);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            data.avatar = `uploads/${file.filename}`;
        }

        // Cập nhật thông tin
        Object.assign(user, data);
        await user.save();

        // Trả về user sạch (không mật khẩu)
        const updatedUser = user.get({ plain: true });
        delete updatedUser.password;
        return updatedUser;
    }
}

module.exports = AuthService;

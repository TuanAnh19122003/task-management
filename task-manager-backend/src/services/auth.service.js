const User = require('../models/user.model');
const { hashPass, comparePass } = require('../utils/hashPass');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

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
}

module.exports = AuthService;

// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const User = require('../models/user.model'); 

module.exports = async (req, res, next) => { // Thêm async
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Không có token' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token không hợp lệ' });

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        
        // Truy vấn database để lấy thông tin đầy đủ (firstname, lastname...)
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] } // Không gửi mật khẩu về client
        });

        if (!user) {
            return res.status(401).json({ message: 'Người dùng không tồn tại' });
        }

        req.user = user; 
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token hết hạn hoặc không hợp lệ' });
    }
};
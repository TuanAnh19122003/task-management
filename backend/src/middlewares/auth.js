const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Không có token' });

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: 'Token không hợp lệ' });

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.user = decoded; // lưu thông tin user
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token hết hạn hoặc không hợp lệ' });
    }
};

const User = require('../models/user.model');
const { hashPass } = require('../utils/hashPass');
const path = require('path');
const fs = require('fs');

class UserService {
    static async getAllUsers(data) {
        const users = await User.findAll();
        return users;
    }

    static async getUserById(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    static async createUser(data, file) {
        const hashedPassword = await hashPass(data.password);
        data.password = hashedPassword;

        if (file) {
            data.avatar = `uploads/${file.filename}`;
        }

        try {
            const user = await User.create(data);
            return user;
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Email đã tồn tại');
            }
            throw err;
        }
    }


    static async updateUser(id, data, file) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }

        if (data.password) {
            const hashedPassword = await hashPass(data.password);
            data.password = hashedPassword;
        }
        if (file) {
            if (user.avatar) {
                const oldImagePath = path.join(__dirname, '..', user.avatar);

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            data.avatar = `uploads/${file.filename}`;
        }
        Object.assign(user, data);
        return await user.save();

    }

    static async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.avatar) {
            const imagePath = path.join(__dirname, '..', user.avatar);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        await user.destroy();
        return true;
    }

}

module.exports = UserService;
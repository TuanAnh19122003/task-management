const User = require('../models/user.model');
const hashPass = require('../utils/hashPass');

class UserService {
    static async getAllUsers(data) {
        const users = await User.findAll();
        return users;
    }

    static async getUserById(id) {
        const user = await User.findByPk(id);
        return user;
    }

    static async createUser(data) {
        const hashedPassword = await hashPass(data.password);
        data.password = hashedPassword;

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


    static async updateUser(id, data) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }

        if (data.password) {
            const hashedPassword = await hashPass(data.password);
            data.password = hashedPassword;
        }
        Object.assign(user, data);
        return await user.save();

    }

    static async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        await user.destroy();
        return true;
    }

}

module.exports = UserService;
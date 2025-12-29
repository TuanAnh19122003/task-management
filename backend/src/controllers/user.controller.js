const UserService = require('../services/user.service');

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json({
                message: 'Users retrieved successfully',
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving users',
                success: false,
                error: error.message
            });
        }
    }

    async getUserById(req, res) {
        try {
            const user = await UserService.getUserById(req.params.id);
            res.status(200).json({
                message: 'User retrieved successfully',
                success: true,
                data: user
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error retrieving user',
                success: false,
                error: error.message
            });
        }
    }

    async createUser(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            res.status(201).json({
                message: 'User created successfully',
                success: true,
                data: user
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error creating user',
                success: false,
                error: error.message
            });
        }
    }

    async updateUser(req, res) {
        try {
            const user = await UserService.updateUser(req.params.id, req.body);
            res.status(200).json({
                message: 'User updated successfully',
                success: true,
                data: user
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error updating user',
                success: false,
                error: error.message
            });
        }
    }

    async deleteUser(req, res) {
        try {
            await UserService.deleteUser(req.params.id);
            res.status(200).json({
                message: 'User deleted successfully',
                success: true
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error deleting user',
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new UserController();
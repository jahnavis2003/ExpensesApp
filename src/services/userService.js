// services/userService.js
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

const getAllUsersAsync = async () => {
    const users = await User.find();
    return users;
};

const createUserAsync = async (data) => {
    //Check if email exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        const error = new Error('Email already in use');
        error.statusCode = 409;
        throw error;
    }
    const user = new User(data);
    // you can modify `user` here if needed
    return await user.save();
};


const updateUserByIdAsync = async (userId, updateData, currentUser) => {
    // Find user by ID
    const existingUser = await User.findById(userId).select('+password');
    if (!existingUser) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
        // return false;
    }

    // Check if username is being updated and if it's unique
    if (updateData.username && updateData.username.trim() !== existingUser.username.trim()) {
        const userWithSameUsername = await User.findOne({ username: updateData.username.trim() });
        if (userWithSameUsername) {
            const error = new Error('Username already in use');
            error.statusCode = 409;
            throw error;    
        }
    }
    
    const passwordBeingUpdated = updateData.password && await bcrypt.compare(updateData.password, existingUser.password);

    // Check if they are updating password, email, or role without proper permissions
    if ((updateData.email && updateData.email !== existingUser.email) || (updateData.password && !passwordBeingUpdated)) {
        const error = new Error('Cannot update email or password through this endpoint');
        error.statusCode = 400;
        throw error;
        // return false;
    }
    if (updateData.role && updateData.role !== existingUser.role && currentUser.role !== 'admin') {
        const error = new Error('Only admins can update roles');
        error.statusCode = 403;
        throw error;
    }

    // Define fields that can be updated
    const allowedFields = ['username', 'firstName', 'lastName'];

    // If current user is admin, allow updating the role too
    if (currentUser.role === 'admin') {
        allowedFields.push('role');
    }
    const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([key]) => allowedFields.includes(key))
    );

    Object.assign(existingUser, filteredData);
    await existingUser.save(); // Runs middleware

    return existingUser;
};

const getUserByIdAsync = (id) => {
    const user = User.findById(id);
    return user;
};

const deleteUserByIdAsync = async (id) => {
    const user = await  User.findById(id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    const deleteUser = User.findByIdAndDelete(id);
    return deleteUser;
};

const updateUserPasswordAsync = async (userId, newPassword, currentPassword, isAdmin) => {
    const user = await User.findById(userId).select('+password');
    if (!user) {
        const error = new Error('User not found - Password update failed!');
        error.statusCode = 404;
        throw error;
    }
    // If not admin, verify current password
    if (!isAdmin) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            const error = new Error('Current password is incorrect');
            error.statusCode = 401;
            throw error;
        }
    }
    user.password = newPassword;
    await user.save();  
    return user;
};



export default { getAllUsersAsync, createUserAsync, updateUserByIdAsync, deleteUserByIdAsync, getUserByIdAsync, updateUserPasswordAsync };

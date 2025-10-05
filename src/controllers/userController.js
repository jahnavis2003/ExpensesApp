import userService from "../services/userService.js";
import sendResponse from "../utils/response.js";
import asyncHandler from "../utils/asyncHandler.js";
import hashPassword from "../utils/hashPassword.js";
import passwordValidator from "../utils/passwordValidator.js";
import validator from "validator";


const { getAllUsersAsync, createUserAsync, updateUserByIdAsync, deleteUserByIdAsync, getUserByIdAsync, updateUserPasswordAsync } = userService;

// Helper to detect if input has unsafe characters (like < > & " etc.)
const hasUnsafeChars = (str) => str !== validator.escape(str);

// Helper to detect spaces anywhere in the string
const hasSpaces = (str) => /\s/.test(str);

// Fetch all users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await getAllUsersAsync();
    if(!users || users.length === 0) {
        return sendResponse(res, 404, false, null, "No users found");
    }
    sendResponse(res, 200, true, users, "Users fetched successfully");
});

// Create a new user
const createUser = asyncHandler (async (req, res) => {
    const { email, password, username, firstName, lastName, role } = req.body;

    //Ensure all fields are strings
    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        typeof username !== 'string' ||
        typeof firstName !== 'string' ||
        typeof lastName !== 'string' ||
        (role && typeof role !== 'string')
    ) {
        return sendResponse(res, 400, false, null, 'All fields must be strings.');
    }

    // Check for unsanitized input or spaces
    if (
        hasUnsafeChars(email) ||
        hasUnsafeChars(password) ||
        hasUnsafeChars(username) ||
        hasUnsafeChars(firstName) ||
        hasUnsafeChars(lastName) ||
        (role && hasUnsafeChars(role)) ||
        hasSpaces(username) ||
        hasSpaces(firstName) ||
        hasSpaces(lastName) ||
        hasSpaces(email) ||
        hasSpaces(password) ||
        (role && hasSpaces(role))
    ) {
        return sendResponse(res, 400, false, null, 'Input must not contain unsafe characters or spaces. Please correct and try again.');
    }
    
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    //Required fields
    if (!username || !firstName || !lastName || !email || !password) {
        return sendResponse(res, 400, false, null, "All fields are required");
    }

    //Password length check
    if (!passwordValidator(password)) {
        return sendResponse(res, 400, false, null, "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character!");
    }

    //Role validation
    if (role && !['user', 'admin'].includes(role)) {
        return sendResponse(res, 400, false, null, "Invalid role specified");
    }

    //Only admins can create admin users
    if (role === 'admin' && req.user.role !== 'admin') {
        return sendResponse(res, 403, false, null, "Only admins can create another admin user");
    }

    //Hash the password
    const hashedPassword = await hashPassword(req.body.password);
    const userData = { ...req.body, email: normalizedEmail, password: hashedPassword };

    //Create the user
    const user = await createUserAsync(userData);

    //Remove password before sending response
    const userObject = user.toObject();
    delete userObject.password;

    sendResponse(res, 201, true, userObject, "User created successfully");
});

// Update an user
const updateUserById = asyncHandler (async (req, res) => {
    const { _id, username, firstName, lastName, role } = req.body;

    if (!_id) {
        return sendResponse(res, 400, false, null, "User ID is required");
    }

    // Ensure all fields are strings
    if (
        typeof _id !== 'string' ||
        typeof username !== 'string' ||
        typeof firstName !== 'string' ||
        typeof lastName !== 'string' ||
        (role && typeof role !== 'string')
    ) {
        return sendResponse(res, 400, false, null, 'All fields must be strings.');
    }

    // Check for unsanitized input or spaces
    if (
        hasUnsafeChars(_id) ||
        hasUnsafeChars(username) ||
        hasUnsafeChars(firstName) ||
        hasUnsafeChars(lastName) ||
        (role && hasUnsafeChars(role)) ||
        hasSpaces(username) ||
        hasSpaces(firstName) ||
        hasSpaces(lastName) ||
        hasSpaces(_id) ||
        (role && hasSpaces(role))
    ) {
        return sendResponse(res, 400, false, null, 'Input must not contain unsafe characters or spaces. Please correct and try again.');
    }

    // Only admins or the user themselves can update the user
    if (req.user.role !== 'admin' && req.user._id !== _id) {
        return sendResponse(res, 403, false, null, "You do not have permission to update this user");
    }

    const updatedUser = await updateUserByIdAsync(_id, req.body, req.user);

    if (!updatedUser) {
      return sendResponse(res, 404, false, null, "User not found");
    }
    const userObject = updatedUser.toObject();
    delete userObject.password;
    sendResponse(res, 200, true, userObject, "User updated successfully");
});

// Get single user by ID
const getUserById = asyncHandler (async (req, res) => {
    const { id } = req.params;
    if (req.user.role !== 'admin' && req.user.id !== id) {
        return sendResponse(res, 403, false, null, "You do not have permission to view this user");
    }
    const user = await getUserByIdAsync(id);
    if (!user) {
      return sendResponse(res, 404, false, null, "User not found");
    }
    sendResponse(res, 200, true, user, "User fetched successfully");
});

// Delete an user
const deleteUserById = asyncHandler (async (req, res) => {
    const { id } = req.params;
    const deletedUser = await deleteUserByIdAsync(id);
    if (!deletedUser) {
      return sendResponse(res, 404, false, null, "User not found - Deletion failed!");
    }
    sendResponse(res, 200, true, null, "User deleted successfully");
});

const updateUserPassword = asyncHandler (async (req, res) => {
    const { _id, newPassword, currentPassword } = req.body;

    if (!_id || !newPassword || (req.user.role !== 'admin' && !currentPassword)) {
        return sendResponse(res, 400, false, null, "User ID, currentPassword, and new password are required");
    }

    if (typeof _id !== 'string' || typeof newPassword !== 'string' || (currentPassword && typeof currentPassword !== 'string')) {
        return sendResponse(res, 400, false, null, 'All fields must be strings.');
    }
    if (hasUnsafeChars(_id) || hasUnsafeChars(newPassword) || (currentPassword && hasUnsafeChars(currentPassword)) || hasSpaces(_id) || hasSpaces(newPassword) || (currentPassword && hasSpaces(currentPassword))) {
        return sendResponse(res, 400, false, null, 'Input must not contain unsafe characters or spaces. Please correct and try again.');
    }

    // Only admins or the user themselves can update the password
    if (req.user.role !== 'admin' && req.user._id.toString() !== _id.toString()) {
        return sendResponse(res, 403, false, null, "You do not have permission to update this user's password");
    }
    // Password length check
    if (!passwordValidator(newPassword)) {
        return sendResponse(res, 400, false, null, "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character!");
    }   
    const hashedPassword = await hashPassword(newPassword);
    const updatedUser = await updateUserPasswordAsync(_id, hashedPassword, currentPassword, req.user.role === 'admin');
    if (!updatedUser) {
        return sendResponse(res, 404, false, null, "User not found - Password update failed!");
    }
    sendResponse(res, 200, true, null, "Password updated successfully");
});

export default { getAllUsers, createUser, updateUserById, deleteUserById, getUserById, updateUserPassword };

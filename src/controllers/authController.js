import asyncHandler from "../utils/asyncHandler.js";
import authService from "../services/authService.js";
import bcrypt from "bcryptjs";
import generateJWT from "../utils/generateJWT.js";
import sendResponse from "../utils/response.js";

const { getUserByEmailAsync } = authService;

const login = asyncHandler( async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await getUserByEmailAsync(email.toLowerCase());
    if (!existingUser) {
        return sendResponse(res, 401, false, null, "Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        return sendResponse(res, 401, false, null, "Invalid email or password");
    }

    const userObject = existingUser.toObject();
    delete userObject.password; // Remove password from response
    const token = generateJWT(userObject);
    sendResponse(res, 200, true, { user: userObject, token }, "Login successful");
});

export default { login };
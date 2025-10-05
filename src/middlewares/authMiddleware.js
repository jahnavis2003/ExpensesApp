import jwt from "jsonwebtoken";
import sendResponse from "../utils/response.js";

const protect = (roles=[]) => {
    return function validateToken (req, res, next) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);  
                req.user = decoded.user; // Attach user info to request object
                if(roles.length > 0 && !roles.includes(req.user.role)) {
                    return sendResponse(res, 403, false, null, "You do not have permission to perform this action");
                }
                next();
            } catch (error) {
                return sendResponse(res, 401, false, null, "Invalid or expired token");
            }
        } else {
            return sendResponse(res, 401, false, null, "No token provided");
        }
    };
};

export default protect;
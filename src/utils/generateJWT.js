import jwt from "jsonwebtoken";

const generateJWT = (user) => {
    try {
        return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_VALIDITY || '1h' });
    } catch (error) {
        console.error("Error generating JWT:", error);
        throw error;  
    }
};
export default generateJWT;
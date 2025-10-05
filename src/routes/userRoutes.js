import { Router } from "express";
const router = Router();
import userController from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";

const { getAllUsers, createUser, updateUserById, deleteUserById, getUserById, updateUserPassword } = userController;

// GET /api/users
router.get("/getAllUsers", protect(["admin"]), getAllUsers);

router.post("/createUser", createUser);

router.post("/updateUser", protect(["admin", "user"]), updateUserById);

router.post("/deleteUser/:id", protect(["admin"]), deleteUserById);

router.post("/getUserById/:id", protect(["admin", "user"]), getUserById);

router.post("/updateUserPassword", protect(["admin", "user"]), updateUserPassword);

export default router;
import { Router } from "express";
const router = Router();
import authController from "../controllers/authController.js";

const { login } = authController;

router.post("/login", login);

export default router;
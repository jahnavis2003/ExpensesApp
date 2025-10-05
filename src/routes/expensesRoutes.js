import { Router } from "express";
const router = Router();
import protect from "../middlewares/authMiddleware.js";
import expensesController from "../controllers/expensesController.js";
const { getAllExpenses, createExpense, updateExpenseById, deleteExpenseById, getExpenseById, getExpensesByUserId } = expensesController;
// GET /api/expenses
router.get("/getAllExpenses", protect(["admin", "user"]), getAllExpenses);

router.post("/createExpense", protect(["admin", "user"]), createExpense);

router.post("/updateExpense", protect(["admin", "user"]), updateExpenseById);

router.post("/deleteExpense/:id", protect(["admin", "user"]), deleteExpenseById);

router.post("/getExpenseById/:id", protect(["admin", "user"]), getExpenseById);

router.post("/getExpensesByUserId", protect(["admin", "user"]), getExpensesByUserId);

export default router;
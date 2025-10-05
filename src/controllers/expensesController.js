// controllers/expensesController.js
// expensesController.js
import expensesService from "../services/expensesService.js";
import sendResponse from "../utils/response.js";
import asyncHandler from "../utils/asyncHandler.js";

const { getAllExpensesAsync, createExpenseAsync, updateExpenseByIdAsync, deleteExpenseByIdAsync, getExpenseByIdAsync, getExpensesByUserIdAsync } = expensesService;


// Fetch all expenses (using asyncHandler middleware)
const getAllExpenses = asyncHandler(async (req, res) => {
  const expenses = await getAllExpensesAsync();
  sendResponse(res, 200, true, expenses, "Expenses fetched successfully");
});

const createExpense = asyncHandler(async (req, res) => {
  const expense = await createExpenseAsync(req.body);
  sendResponse(res, 201, true, expense, "Expense created successfully");
});

const updateExpenseById = asyncHandler(async (req, res) => {
  const expense = await updateExpenseByIdAsync(req.body.id, req.body);
  if (!expense) return sendResponse(res, 404, false, null, "Expense not found");
  sendResponse(res, 200, true, expense, "Expense updated successfully");
});

const deleteExpenseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const expense = await deleteExpenseByIdAsync(id);
  if (!expense) return sendResponse(res, 404, false, null, "Expense not found");
  sendResponse(res, 200, true, null, "Expense deleted successfully");
});

const getExpenseById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const expense = await getExpenseByIdAsync(id);
    if (!expense) return sendResponse(res, 404, false, null, "Expense not found");
    sendResponse(res, 200, true, expense, "Expense fetched successfully");
});

const getExpensesByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return sendResponse(res, 400, false, null, "userId query parameter is required");
  }
  const expenses = await getExpensesByUserIdAsync(userId);    
  sendResponse(res, 200, true, expenses, "Expenses fetched successfully");
});

export default { getAllExpenses, createExpense, updateExpenseById, deleteExpenseById, getExpenseById, getExpensesByUserId };

// controllers/expensesController.js
// expensesController.js
import expensesService from "../services/expensesService.js";
import sendResponse from "../utils/response.js";
import asyncHandler from "../utils/asyncHandler.js";
import sanitizeInput from "../utils/sanitizeInput.js";

const { hasUnsafeChars, hasSpaces } = sanitizeInput;
const { getAllExpensesAsync, createExpenseAsync, updateExpenseByIdAsync, deleteExpenseByIdAsync, getExpenseByIdAsync, getExpensesByUserIdAsync } = expensesService;


// Fetch all expenses (using asyncHandler middleware)
const getAllExpenses = asyncHandler(async (req, res) => {
  const expenses = await getAllExpensesAsync();
  if(!expenses || expenses.length === 0) {
      return sendResponse(res, 404, false, null, "No expenses found");
  }
  sendResponse(res, 200, true, expenses, "Expenses fetched successfully");
});

const createExpense = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return sendResponse(res, 400, false, null, "Request body is required");
  }
  if (!req.body.amount || !req.body.description || !req.body.userId || !req.body.category) {
    return sendResponse(res, 400, false, null, "amount, description, userId, and category are required fields.");
  }
  //Ensure all fields are strings (except amount which should be a number)
  if (
    typeof req.body.amount !== 'number' ||
    typeof req.body.description !== 'string' ||
    typeof req.body.userId !== 'string' ||
    typeof req.body.category !== 'string' ||
    (req.body.date && typeof req.body.date !== 'string')
  ) {
    return sendResponse(res, 400, false, null, 'Invalid data types for one or more fields.');
  }
  // Check for unsanitized input or spaces
  if (
    hasUnsafeChars(req.body.description) || 
    hasUnsafeChars(req.body.userId) ||
    hasUnsafeChars(req.body.category) ||
    (req.body.date && hasUnsafeChars(req.body.date)) || 
    hasSpaces(req.body.userId) ||
    hasSpaces(req.body.category) ||
    (req.body.date && hasSpaces(req.body.date))
  ) {
    return sendResponse(res, 400, false, null, 'Input must not contain unsafe characters or spaces. Please correct and try again.');
  }
  if(req.user.role !== 'admin' && req.user.id !== req.body.userId) {
    return sendResponse(res, 403, false, null, "You are not authorized to create an expense for this user");
  }
  const expense = await createExpenseAsync(req.body);
  if (!expense) {
    return sendResponse(res, 500, false, null, "Expense creation failed");
  }
  sendResponse(res, 201, true, expense, "Expense created successfully");
});

const updateExpenseById = asyncHandler(async (req, res) => {
   if (!req.body || Object.keys(req.body).length === 0) {
    return sendResponse(res, 400, false, null, "Request body is required");
  }
  if (!req.body.id) {
    return sendResponse(res, 400, false, null, "Expense ID is required");
  }
  if (!req.body.amount && !req.body.description && !req.body.category && !req.body.date) {
    return sendResponse(res, 400, false, null, "At least one field (amount, description, category, date) must be provided for update");
  }
  if(req.user.role !== 'admin' && req.user.id !== req.body.userId) {
    return sendResponse(res, 403, false, null, "You are not authorized to update this expense");
  }
  //Ensure all fields are strings (except amount which should be a number)
  if (
    (req.body.amount && typeof req.body.amount !== 'number') ||
    (req.body.description && typeof req.body.description !== 'string') ||
    (req.body.userId && typeof req.body.userId !== 'string') ||
    (req.body.category && typeof req.body.category !== 'string') ||
    (req.body.date && typeof req.body.date !== 'string')
  ) {
    return sendResponse(res, 400, false, null, 'Invalid data types for one or more fields.');
  }
  // Check for unsanitized input or spaces
  if (
    (req.body.description && hasUnsafeChars(req.body.description)) ||
    (req.body.userId && hasUnsafeChars(req.body.userId)) ||
    (req.body.category && hasUnsafeChars(req.body.category)) ||
    (req.body.date && hasUnsafeChars(req.body.date)) ||
    (req.body.userId && hasSpaces(req.body.userId)) ||
    (req.body.category && hasSpaces(req.body.category)) ||
    (req.body.date && hasSpaces(req.body.date))
  ) {
    return sendResponse(res, 400, false, null, 'Input must not contain unsafe characters or spaces. Please correct and try again.');
  }
  const expense = await updateExpenseByIdAsync(req.body.id, req.body);
  if (!expense) return sendResponse(res, 404, false, null, "Expense not found");
  sendResponse(res, 200, true, expense, "Expense updated successfully");
});

const deleteExpenseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendResponse(res, 400, false, null, "Expense ID is required");
  }
  if(req.user.role !== 'admin' && req.user.id !== req.body.userId) {
    return sendResponse(res, 403, false, null, "You are not authorized to delete this expense");
  }
  const expense = await deleteExpenseByIdAsync(id);
  if (!expense) return sendResponse(res, 404, false, null, "Expense not found");
  sendResponse(res, 200, true, null, "Expense deleted successfully");
});

const getExpenseById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, 400, false, null, "Expense ID is required");
    }
    if(req.user.role !== 'admin' && req.user.id !== req.body.userId) {
      return sendResponse(res, 403, false, null, "You are not authorized to view this expense");
    }
    const expense = await getExpenseByIdAsync(id);
    if (!expense) return sendResponse(res, 404, false, null, "Expense not found");
    sendResponse(res, 200, true, expense, "Expense fetched successfully");
});

const getExpensesByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return sendResponse(res, 400, false, null, "userId query parameter is required");
  }
  if(req.user.role !== 'admin' && req.user.id !== userId) {
    return sendResponse(res, 403, false, null, "You are not authorized to view expenses for this user");
  }
  const expenses = await getExpensesByUserIdAsync(userId);    
  if(!expenses || expenses.length === 0) {
      return sendResponse(res, 404, false, null, "No expenses found for this user");
  }
  sendResponse(res, 200, true, expenses, "Expenses fetched successfully");
});

export default { getAllExpenses, createExpense, updateExpenseById, deleteExpenseById, getExpenseById, getExpensesByUserId };

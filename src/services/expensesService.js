// services/expensesService.js
import Expense from "../models/expensesModel.js";

const getAllExpensesAsync = () => Expense.find();
const createExpenseAsync = (data) => new Expense(data).save();
const updateExpenseByIdAsync = (id, data) => Expense.findByIdAndUpdate(id, data, { new: true });
const deleteExpenseByIdAsync = (id) => Expense.findByIdAndDelete(id);
const getExpenseByIdAsync = (id) => Expense.findById(id);
const getExpensesByUserIdAsync = (userId) => Expense.find({ userId });

export default { getAllExpensesAsync, createExpenseAsync, updateExpenseByIdAsync, deleteExpenseByIdAsync, getExpenseByIdAsync, getExpensesByUserIdAsync };

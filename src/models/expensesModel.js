import { Schema, model } from 'mongoose';

const expensesSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true }, 
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Expense =  model('Expense', expensesSchema);

export default Expense;
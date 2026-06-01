import connectDB from "../lib/mongodb";
import Expense from "../models/Expense";

export default async function handler(req, res) {
  await connectDB();

  try {
    const expenses = await Expense.find({});
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

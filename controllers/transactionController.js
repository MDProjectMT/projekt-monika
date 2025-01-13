import { incomeCategories, expenseCategories } from "../config/categories.js";
import Transaction from "../models/Transaction.js";

export const postIncome = async (req, res, next) => {
  const { amound, category, description, date } = req.body;

  if (!incomeCategories.includes(category)) {
    return res.status(400).json({
      message: "error",
    });
  }

  if (!amound || !category || !description || !date) {
    return res.status(400).json({
      message: "error",
    });
  }

  try {
    const userId = req.user._id;
    const newIncome = new Transaction({
      userId,
      amound,
      category,
      description,
      date,
      type: "income",
    });

    await newIncome.save();
    return res.status(200).json({
      status: "Created 201",
      code: 201,
      message: "New Income - add",
      transaction: newIncome,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server feld",
    });
  }
};

export const postExpense = async (req, res, next) => {
  const { amound, category, description, date } = req.body;

  if (expenseCategories.includes(category)) {
    return res.status(400).json({
      message: "error",
    });
  }

  if (!amound || !category || !description || !date) {
    return res.status(400).json({
      message: "error",
    });
  }

  try {
    const userId = req.user._id;
    const newExpense = new Transaction({
      userId,
      amound,
      category,
      description,
      date,
      type: "expense",
    });

    await newExpense.save();
    return res.status(200).json({
      status: "Created 201",
      code: 201,
      message: "New Expense is successfully",
      transaction: newExpense,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server feld",
    });
  }
};

export const getIncome = async (req, res, next) => {
  try {
    const incomes = await Transaction.find({
      userId: req.user._id,
      type: "income",
    });

    const totalIncome = incomes.reduce((sum, income) => sum + income.amound, 0);

    return res.status(200).json({
      status: "200 OK",
      code: 200,
      totalIncome,
      transaction: incomes,
    });
  } catch (error) {
    console.error(`Error fetching income stats: ${error.message}`);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Server error",
    });
  }
};
export const getExpense = async (req, res, _next) => {
  try {
    const expenses = await Transaction.find({
      userId: req.user._id,
      type: "expense",
    });

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amound,
      0
    );

    return res.status(200).json({
      status: "200 OK",
      code: 200,
      totalExpense,
      transaction: expenses,
    });
  } catch {
    console.error(`Error fetching income stats: ${error.message}`);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Server error",
    });
  }
};

export const getTransaction = async (req, res, _next) => {
  try {
    const transaction = await Transaction.find({
      userId: req.user._id,
    });

    return res.status(200).json({
      status: "200 OK",
      code: 200,
      transaction,
    });
  } catch (error) {
    console.error(`Error fetching transactions: ${error.message}`);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Server error",
    });
  }
};

export const deleteTransaction = async (req, res, next) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findOne({
      id,
      userId: req.user._id,
    });

    await Transaction.findByIdAndDelete(transaction);
  } catch (error) {
    console.error(`Error deleting transaction: ${error.message}`);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Server error",
    });
  }
};

import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Expense from "../expense/expense.model.js";
import Income from "../income/income.model.js";
import Investment from "../investment/investment.model.js";
import Goal from "../goal/goal.model.js";
import Transaction from "../transaction/transaction.model.js";

const router = Router();
router.use(requireAuth);

router.get("/summary", async (req, res) => {
  try {
    const userId = req.user.id;
    const [expenses, income, investments, goals, transactions] = await Promise.all([
      Expense.find({ userId }),
      Income.find({ userId }),
      Investment.find({ userId }),
      Goal.find({ userId }),
      Transaction.find({ userId }),
    ]);

    // Consolidate expenses from Expense model + Transaction model (withdrawals)
    let totalExpenses = expenses.reduce((s, x) => s + Number(x.amount || 0), 0);
    const byCategory = {};

    expenses.forEach((x) => {
      const cat = x.category || "General";
      byCategory[cat] = (byCategory[cat] || 0) + Number(x.amount || 0);
    });

    // Consolidate income from Income model + Transaction model (deposits)
    let totalIncome = income.reduce((s, x) => s + Number(x.amount || 0), 0);

    // Merge transactions
    transactions.forEach((tx) => {
      const amt = Number(tx.amount || 0);
      if (tx.type === "deposit") {
        totalIncome += amt;
      } else if (tx.type === "withdraw") {
        totalExpenses += amt;
        const cat = tx.purpose && tx.purpose !== "-" ? tx.purpose : "General Expenses";
        byCategory[cat] = (byCategory[cat] || 0) + amt;
      }
    });

    const portfolio = investments.reduce((s, x) => s + Number(x.currentValue || 0), 0);
    const invested = investments.reduce(
      (s, x) => s + Number(x.purchasePrice || 0) * (Number(x.quantity) || 1),
      0
    );

    const categoryData = Object.entries(byCategory)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    // Monthly breakdown
    const monthly = {};
    const allDebits = [
      ...expenses.map((x) => ({ date: x.date || x.createdAt, amount: x.amount })),
      ...transactions
        .filter((t) => t.type === "withdraw")
        .map((t) => ({ date: t.date || t.createdAt, amount: t.amount })),
    ];

    allDebits.forEach((x) => {
      try {
        const k = new Date(x.date).toISOString().slice(0, 7);
        monthly[k] = (monthly[k] || 0) + Number(x.amount || 0);
      } catch {}
    });

    const monthlyExpenses = Object.entries(monthly)
      .sort()
      .slice(-6)
      .map(([month, amount]) => ({ month, amount }));

    const savings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((savings) / totalIncome) * 100 : 0;

    res.json({
      summary: {
        totalExpenses,
        totalIncome,
        savings,
        savingsRate: Math.max(0, savingsRate),
        portfolio,
        invested,
        investmentGain: portfolio - invested,
        goalCount: goals.length,
        transactionCount: transactions.length + expenses.length,
      },
      categoryData,
      monthlyExpenses,
      recentExpenses: expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8),
    });
  } catch (err) {
    console.error("analytics summary error:", err);
    res.status(500).json({ message: err.message || "Failed to calculate analytics summary" });
  }
});

export default router;

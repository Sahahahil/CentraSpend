// Filter expenses for the current month and categorize them
import { Expense } from "../types"; // Assume a shared Expense type exists

export const filterCurrentMonthExpenses = (expenses: Expense[]): Expense[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  return expenses.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
};

export const categorizeExpenses = (expenses: Expense[]) => {
  const categories: Record<string, number> = {};
  expenses.forEach(e => {
    const cat = e.category || "other";
    categories[cat] = (categories[cat] || 0) + e.amount;
  });
  return categories;
};

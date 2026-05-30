import React from "react";
import { useBudget } from "../hooks/useBudget";
import { useExpenses } from "../hooks/useExpenses"; // Assume hook exists

export const BudgetSummaryCard: React.FC = () => {
  const { budget, remaining } = useBudget();
  const { expenses } = useExpenses();

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingAmount = remaining(totalExpenses);

  return (
    <div className="budget-summary-card">
      <h2>Monthly Budget</h2>
      <p>Budget: ${budget.toFixed(2)}</p>
      <p>Spent: ${totalExpenses.toFixed(2)}</p>
      <p>Remaining: ${remainingAmount.toFixed(2)}</p>
    </div>
  );
};

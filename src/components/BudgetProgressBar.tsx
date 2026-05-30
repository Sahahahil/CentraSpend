import React from "react";
import { useBudget } from "../hooks/useBudget";
import { useExpenses } from "../hooks/useExpenses"; // Assume hook exists

export const BudgetProgressBar: React.FC = () => {
  const { budget } = useBudget();
  const { expenses } = useExpenses();
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const percent = budget > 0 ? Math.min((totalExpenses / budget) * 100, 100) : 0;

  return (
    <div className="budget-progress-bar" style={{ border: "1px solid #ccc", padding: "2px" }}>
      <div
        style={{
          width: `${percent}%`,
          backgroundColor: "#4caf50",
          height: "10px",
        }}
      />
      <span>{percent.toFixed(1)}% used</span>
    </div>
  );
};

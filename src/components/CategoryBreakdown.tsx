import React from "react";
import { useExpenses } from "../hooks/useExpenses"; // Assume hook exists
import { categorizeExpenses } from "../lib/expenseFilter";

export const CategoryBreakdown: React.FC = () => {
  const { expenses } = useExpenses();
  const categories = categorizeExpenses(expenses);

  return (
    <div className="category-breakdown">
      <h3>Spending by Category</h3>
      <ul>
        {Object.entries(categories).map(([cat, amt]) => (
          <li key={cat}>
            {cat}: ${amt.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

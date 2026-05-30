import React from "react";
import { BudgetSummaryCard } from "../components/BudgetSummaryCard";
import { BudgetProgressBar } from "../components/BudgetProgressBar";
import { CategoryBreakdown } from "../components/CategoryBreakdown";
import { useExpenses } from "../hooks/useExpenses"; // Assume hook exists

const BudgetPage: React.FC = () => {
  // Assume expenses are loaded via a hook or context
  const { expenses } = useExpenses();

  return (
    <div className="budget-page">
      <h1>Monthly Budget Dashboard</h1>
      <BudgetSummaryCard />
      <BudgetProgressBar />
      <CategoryBreakdown />
    </div>
  );
};

export default BudgetPage;

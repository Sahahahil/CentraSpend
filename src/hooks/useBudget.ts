import { useState, useEffect } from "react";
import { getCurrentMonth, calculateRemaining } from "../lib/budgetUtils";
import { loadBudget, saveBudget } from "../lib/budgetPersistence";

/**
 * Hook to manage monthly budget state.
 * Persists budget in localStorage keyed by month.
 */
export const useBudget = () => {
  const month = getCurrentMonth();
  const [budget, setBudget] = useState<number>(0);

  // Load saved budget on mount
  useEffect(() => {
    const saved = loadBudget(month);
    if (saved !== null) {
      setBudget(saved);
    }
  }, [month]);

  const updateBudget = (newAmount: number) => {
    setBudget(newAmount);
    saveBudget(month, newAmount);
  };

  const remaining = (expenses: number) => calculateRemaining(budget, expenses);

  return { budget, updateBudget, remaining };
};

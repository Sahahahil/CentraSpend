// Budget utility functions
export interface Budget {
  month: string; // YYYY-MM
  amount: number;
}

/**
 * Returns the current month string in YYYY-MM format.
 */
export const getCurrentMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

/**
 * Calculates the remaining budget based on total expenses.
 */
export const calculateRemaining = (budget: number, expenses: number): number => {
  return Math.max(budget - expenses, 0);
};

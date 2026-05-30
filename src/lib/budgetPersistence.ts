// Simple localStorage persistence for monthly budget

export const loadBudget = (month: string): number | null => {
  if (typeof window === "undefined") return null;
  const key = `budget-${month}`;
  const val = window.localStorage.getItem(key);
  return val !== null ? Number(val) : null;
};

export const saveBudget = (month: string, amount: number): void => {
  if (typeof window === "undefined") return;
  const key = `budget-${month}`;
  window.localStorage.setItem(key, String(amount));
};

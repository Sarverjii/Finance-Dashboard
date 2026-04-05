import { createSlice } from "@reduxjs/toolkit";

/* ================= LOCAL STORAGE ================= */
const loadBudgets = () => {
  try {
    const data = localStorage.getItem("budgets");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const saveBudgets = (budgets) => {
  localStorage.setItem("budgets", JSON.stringify(budgets));
};

/* ================= DEFAULT ================= */
const defaultBudgets = {
  Food: 500,
  Transport: 150,
  Shopping: 500,
  Entertainment: 200,
  Utilities: 250,
};

/* ================= SLICE ================= */
const budgetSlice = createSlice({
  name: "budget",
  initialState: {
    budgets: loadBudgets() || defaultBudgets,
  },
  reducers: {
    setBudget: (state, action) => {
      const { category, amount } = action.payload;
      state.budgets[category] = amount;
      saveBudgets(state.budgets);
    },
  },
});

export const { setBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
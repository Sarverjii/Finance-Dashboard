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
  Food:          { weekly: 5050,  monthly: 22000,  yearly: 263000 },
  Transport:     { weekly: 1850,  monthly: 8000,   yearly: 95000  },
  Shopping:      { weekly: 3050,  monthly: 13500,  yearly: 158000 },
  Entertainment: { weekly: 1700,  monthly: 7500,   yearly: 87000  },
  Utilities:     { weekly: 800,   monthly: 3500,   yearly: 40000  },
  Groceries:     { weekly: 2300,  monthly: 10000,  yearly: 118000 },
  Rent:          { weekly: 3700,  monthly: 16000,  yearly: 192000 },
  Health:        { weekly: 1000,  monthly: 4500,   yearly: 51000  },
  Subscriptions: { weekly: 350,   monthly: 1500,   yearly: 18000  },
  Education:     { weekly: 650,   monthly: 3000,   yearly: 33000  },
};

/* ================= SLICE ================= */
const budgetSlice = createSlice({
  name: "budget",
  initialState: {
    budgets: loadBudgets() || defaultBudgets,
  },
  reducers: {
    setBudget: (state, action) => {
      const { category, type, amount } = action.payload;

      if (!state.budgets[category]) {
        state.budgets[category] = {
          weekly: 0,
          monthly: 0,
          yearly: 0,
        };
      }

      state.budgets[category][type] = amount;
      saveBudgets(state.budgets);
    },

    createCategoryBudget: (state, action) => {
      const category = action.payload;

      if (!state.budgets[category]) {
        state.budgets[category] = {
          weekly: 0,
          monthly: 0,
          yearly: 0,
        };
        saveBudgets(state.budgets);
      }
    },
  },
});

export const { setBudget, createCategoryBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
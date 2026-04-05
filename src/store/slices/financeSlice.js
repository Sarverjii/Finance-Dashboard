import { createSlice } from "@reduxjs/toolkit";

/* ========================= */
/* LOAD FROM LOCAL STORAGE */
/* ========================= */
const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("transactions");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/* ========================= */
/* SAVE TO LOCAL STORAGE */
/* ========================= */
const saveToLocalStorage = (transactions) => {
  try {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

/* ========================= */
/* DEFAULT DATA */
/* ========================= */
const defaultTransactions = [
  {
    id: 1,
    date: "2026-04-01",
    category: "Salary",
    description: "Monthly salary",
    type: "income",
    amount: 5000,
  },
  {
    id: 2,
    date: "2026-04-02",
    category: "Food",
    description: "Lunch at cafe",
    type: "expense",
    amount: 200,
  },
  {
    id: 3,
    date: "2026-04-03",
    category: "Shopping",
    description: "Clothes purchase",
    type: "expense",
    amount: 800,
  },
];

/* ========================= */
/* INITIAL STATE */
/* ========================= */
const initialState = {
  transactions: loadFromLocalStorage() || defaultTransactions,
};

/* ========================= */
/* SLICE */
/* ========================= */
const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    /* ADD TRANSACTION */
    addTransaction: (state, action) => {
      state.transactions.unshift({
        ...action.payload,
        id: Date.now(), // ensure unique id
      });
      saveToLocalStorage(state.transactions);
    },

    /* UPDATE TRANSACTION */
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex(
        (t) => t.id === action.payload.id
      );

      if (index !== -1) {
        state.transactions[index] = action.payload;
        saveToLocalStorage(state.transactions);
      }
    },

    /* DELETE TRANSACTION */
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload
      );
      saveToLocalStorage(state.transactions);
    },
  },
});

/* ========================= */
/* EXPORTS */
/* ========================= */
export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = financeSlice.actions;

export default financeSlice.reducer;
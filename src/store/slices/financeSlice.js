import { createSlice } from "@reduxjs/toolkit";
import defaultTransactions from "../../data/defaultTransactions";

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
    addTransaction: (state, action) => {
      state.transactions.unshift({
        ...action.payload,
        id: Date.now(),
      });
      saveToLocalStorage(state.transactions);
    },

    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex(
        (t) => t.id === action.payload.id
      );

      if (index !== -1) {
        state.transactions[index] = action.payload;
        saveToLocalStorage(state.transactions);
      }
    },

    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload
      );
      saveToLocalStorage(state.transactions);
    },
  },
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = financeSlice.actions;

export default financeSlice.reducer;
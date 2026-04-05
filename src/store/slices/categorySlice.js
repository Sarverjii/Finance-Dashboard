import { createSlice } from "@reduxjs/toolkit";

/* ================= LOCAL STORAGE ================= */
const loadCategories = () => {
  try {
    const data = localStorage.getItem("categories");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const saveCategories = (categories) => {
  localStorage.setItem("categories", JSON.stringify(categories));
};

/* ================= DEFAULT ================= */
const defaultCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Utilities",
];

/* ================= SLICE ================= */
const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: loadCategories() || defaultCategories,
  },
  reducers: {
    addCategory: (state, action) => {
      state.categories.push(action.payload);
      saveCategories(state.categories);
    },

    removeCategory: (state, action) => {
      state.categories = state.categories.filter(
        (c) => c !== action.payload
      );
      saveCategories(state.categories);
    },
  },
});

export const { addCategory, removeCategory } = categorySlice.actions;
export default categorySlice.reducer;
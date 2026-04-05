import { configureStore } from "@reduxjs/toolkit";
import financeReducer from "./slices/financeSlice";
import uiReducer from "./slices/uiSlice";
import categoryReducer from "./slices/categorySlice";
import budgetReducer from "./slices/budgetSlice";

export const store = configureStore({
  reducer: {
    finance: financeReducer,
    ui: uiReducer,
    category: categoryReducer,
    budget: budgetReducer,
  },
});
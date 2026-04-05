import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: "Employee",
  currentUser: {
    name: "Shashank Sarth Verma",
    role: "Employee",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },

    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.role = action.payload.role;
    },
  },
});

export const { setRole, setUser } = uiSlice.actions;
export default uiSlice.reducer;
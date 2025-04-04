// src/store/themeSlice.ts
import { createSlice } from "@reduxjs/toolkit";

// Example state for theme (light/dark)
const initialState = {
  mode: "light", // Can be "light" or "dark"
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;

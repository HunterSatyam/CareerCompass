import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        mode: localStorage.getItem("theme") || "light",
    },
    reducers: {
        setTheme: (state, action) => {
            state.mode = action.payload;
            localStorage.setItem("theme", action.payload);
        },
        toggleTheme: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
            localStorage.setItem("theme", state.mode);
        },
    },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

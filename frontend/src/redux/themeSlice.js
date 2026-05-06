import { createSlice } from "@reduxjs/toolkit";

const THEME_STORAGE_KEY = "careerCompass-theme";
const LEGACY_THEME_STORAGE_KEY = "theme";
const THEMES = ["light", "dark", "system"];

const getInitialTheme = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);

    return THEMES.includes(savedTheme) ? savedTheme : "system";
};

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        mode: getInitialTheme(),
    },
    reducers: {
        setTheme: (state, action) => {
            if (!THEMES.includes(action.payload)) return;

            state.mode = action.payload;
            localStorage.setItem(THEME_STORAGE_KEY, action.payload);
            localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
        },
        toggleTheme: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
            localStorage.setItem(THEME_STORAGE_KEY, state.mode);
            localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
        },
    },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

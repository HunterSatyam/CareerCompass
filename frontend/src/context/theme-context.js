import { createContext } from 'react';

export const THEME_STORAGE_KEY = 'careerCompass-theme';
export const LEGACY_THEME_STORAGE_KEY = 'theme';
export const THEMES = ['light', 'dark', 'system'];

export const ThemeContext = createContext(null);

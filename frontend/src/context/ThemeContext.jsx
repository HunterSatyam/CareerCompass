import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { USER_API_END_POINT } from '@/utils/constant';
import { LEGACY_THEME_STORAGE_KEY, ThemeContext, THEME_STORAGE_KEY, THEMES } from './theme-context';

const getStoredTheme = () => {
    if (typeof window === 'undefined') return 'system';

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    return THEMES.includes(savedTheme) ? savedTheme : 'system';
};

const getSystemTheme = () => {
    if (typeof window === 'undefined') return 'light';

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }) => {
    const { user } = useSelector(store => store.auth);
    const [theme, setTheme] = useState(getStoredTheme);
    const [systemTheme, setSystemTheme] = useState(getSystemTheme);

    const resolvedTheme = theme === 'system' ? systemTheme : theme;

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');
        root.classList.add(resolvedTheme);
        root.dataset.theme = resolvedTheme;
        root.style.colorScheme = resolvedTheme;
    }, [resolvedTheme]);

    const changeTheme = async (newTheme) => {
        if (!THEMES.includes(newTheme)) return;

        setTheme(newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);

        if (!user) return;

        try {
            await axios.post(`${USER_API_END_POINT}/theme`, { theme: newTheme }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
        } catch (error) {
            console.error("Failed to sync theme preference to server:", error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, systemTheme, setTheme: changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

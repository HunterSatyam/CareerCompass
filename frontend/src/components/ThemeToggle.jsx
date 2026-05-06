import React from 'react';
import { useTheme } from '../context/useTheme';
import { Moon, Sun, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;

const ThemeToggle = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();

    const themes = [
        { name: 'light', label: 'Light', icon: Sun },
        { name: 'dark', label: 'Dark', icon: Moon },
        { name: 'system', label: 'System', icon: Monitor }
    ];

    return (
        <div
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-elevated/90 p-1 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-surface-elevated/75"
            role="radiogroup"
            aria-label="Theme preference"
            title={`Current theme: ${theme === 'system' ? `System (${resolvedTheme})` : theme}`}
        >
            {themes.map((t) => {
                const Icon = t.icon;
                const isActive = theme === t.name;

                return (
                    <button
                        key={t.name}
                        type="button"
                        onClick={() => setTheme(t.name)}
                        className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 ${
                            isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        }`}
                        aria-label={`Use ${t.label.toLowerCase()} theme`}
                        aria-checked={isActive}
                        role="radio"
                        title={`Use ${t.label.toLowerCase()} theme`}
                    >
                        {isActive && (
                            <MotionDiv
                                layoutId="theme-active-pill"
                                className="absolute inset-0 rounded-full bg-primary shadow-md shadow-primary/20"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center justify-center transition-transform duration-300">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default ThemeToggle;

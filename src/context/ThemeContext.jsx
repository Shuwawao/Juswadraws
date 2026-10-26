import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('juswa_theme');
      return stored === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('juswa_theme', theme);
    } catch (e) {
      console.warn('Could not save theme preference to localStorage', e);
    }

    // Dynamically update browser tab favicon depending on theme
    const faviconUrl = theme === 'light' ? '/favicon-light.png?v=4' : '/favicon-dark.png?v=4';
    const linkIcon = document.querySelector("link[rel='icon']");
    const linkShortcut = document.querySelector("link[rel='shortcut icon']");
    const linkApple = document.querySelector("link[rel='apple-touch-icon']");

    if (linkIcon) linkIcon.href = faviconUrl;
    if (linkShortcut) linkShortcut.href = faviconUrl;
    if (linkApple) linkApple.href = faviconUrl;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

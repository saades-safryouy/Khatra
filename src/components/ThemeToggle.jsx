import React from 'react';
import { Sun, Moon } from './Icons';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle({ light = false }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`theme-toggle${light ? ' theme-toggle--light' : ''}${theme === 'dark' ? ' is-dark' : ''}`}
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {theme === 'dark' ? <Sun s={16} /> : <Moon s={16} />}
    </button>
  );
}

export default ThemeToggle;

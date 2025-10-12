import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const GlobalDarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-300/50 dark:border-purple-600/50 hover:scale-110"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-amber-500" />
      ) : (
        <Moon className="w-5 h-5 text-purple-600" />
      )}
    </button>
  );
};

export default GlobalDarkModeToggle;
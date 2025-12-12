import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '@/store/darkmodeSlice';

const GlobalDarkModeToggle = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);

  return (
    <button
      onClick={() => dispatch(toggleDarkMode())}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-300/50 dark:border-purple-600/50 hover:scale-110"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-amber-500" />
      ) : (
        <Moon className="w-5 h-5 text-purple-600" />
      )}
    </button>
  );
};

export default GlobalDarkModeToggle;
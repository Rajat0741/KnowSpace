import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

export const CategorySelect = ({ onCategoryChange, selectedCategory = 'all' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  const categories = [
    { id: 'all', label: 'All Categories', icon: '🌐' },
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'programming', label: 'Programming', icon: '👨‍💻' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'tutorials', label: 'Tutorials', icon: '📚' },
    { id: 'news', label: 'News', icon: '📰' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'other', label: 'Other', icon: '📂' }
  ];

  const filteredCategories = categories.filter(category =>
    category.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory) || categories[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleCategorySelect = (categoryId) => {
    onCategoryChange(categoryId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="w-full max-w-xs sm:max-w-sm mx-auto relative" ref={selectRef}>
      {/* Selected Value Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between gap-3 px-4 py-3
          bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700
          rounded-lg shadow-sm
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          hover:border-gray-300 dark:hover:border-gray-600
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-base flex-shrink-0">{selectedCategoryData.icon}</span>
          <span className="font-medium text-gray-700 dark:text-gray-200 truncate">
            {selectedCategoryData.label}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`
          absolute z-50 mt-2 
          w-full sm:w-full md:min-w-[320px]
          left-0 sm:left-0
          bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700
          rounded-lg shadow-lg 
          max-h-80 overflow-hidden
        `}>
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2
                  bg-gray-50 dark:bg-gray-700
                  border border-gray-200 dark:border-gray-600
                  rounded-md text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  placeholder-gray-400 dark:placeholder-gray-500
                  text-gray-700 dark:text-gray-200
                `}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`
                    w-full flex items-center justify-between gap-3 px-4 py-3 sm:py-4
                    text-left transition-colors duration-150
                    hover:bg-gray-50 dark:hover:bg-gray-700
                    focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700
                    active:bg-gray-100 dark:active:bg-gray-600
                    min-h-[48px] touch-manipulation
                    ${selectedCategory === category.id 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-200'
                    }
                  `}
                  role="option"
                  aria-selected={selectedCategory === category.id}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-base flex-shrink-0">{category.icon}</span>
                    <span className="font-medium text-sm sm:text-base truncate">{category.label}</span>
                  </div>
                  {selectedCategory === category.id && (
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm text-center">
                No categories found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// components/web/home/bhajan/BhajanCategoryTabs.jsx
'use client';

import { motion } from 'framer-motion';

export default function BhajanCategoryTabs({ categories, activeCategory, onCategoryChange }) {
  // If no categories, show default
  const displayCategories = categories.length > 0 ? categories : ['All'];
  
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {displayCategories.map((category) => {
        const isActive = activeCategory === category || (activeCategory === 'all' && category === 'All');
        const categoryId = category.toLowerCase();
        
        return (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(categoryId)}
            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive
                ? 'text-white bg-gradient-to-r from-saffron to-gold shadow-lg'
                : 'text-brown-700 dark:text-cream-50/70 bg-white/50 dark:bg-brown-800/50 hover:bg-gold/10 dark:hover:bg-gold/20 border border-gold/20 dark:border-gold/10'
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>{category === 'All' ? '🕉️' : getCategoryEmoji(category)}</span>
              <span>{category}</span>
            </span>
            
            {/* Active Indicator */}
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gold rounded-full"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// Helper to get category emoji
const getCategoryEmoji = (category) => {
  const emojis = {
    krishna: '🪈',
    shiva: '🔱',
    hanuman: '🙏',
    durga: '⚔️',
    sai: '🕊️',
    jagannath: '🛕',
  };
  return emojis[category?.toLowerCase()] || '🕉️';
};
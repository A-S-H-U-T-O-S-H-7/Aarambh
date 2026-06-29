// components/home/StoryCategoryTabs.jsx
'use client';

import { motion } from 'framer-motion';

export default function StoryCategoryTabs({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        
        return (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category.id)}
            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive
                ? 'text-white bg-gradient-to-r from-saffron to-gold shadow-lg'
                : 'text-brown-700 dark:text-cream-50/70 bg-white/50 dark:bg-brown-800/50 hover:bg-gold/10 dark:hover:bg-gold/20 border border-gold/20 dark:border-gold/10'
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </span>
            
            {/* Active Indicator */}
            {isActive && (
              <motion.div
                layoutId="activeStoryCategory"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gold rounded-full"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaTimes,
  FaArrowLeft,
  FaBookOpen,
  FaFire,
  FaHeart,
} from 'react-icons/fa';
import { GiLotus } from 'react-icons/gi';
import StoryCard from '@/components/web/home/story/StoryCard';
import {
  storyCategories,
  getCategoryStories,
  getFeaturedStories,
  stories,
} from '@/lib/mockStoryData';

// ─── CategoryTabs ──────────────────────────────────────────────────────────────

function CategoryTabs({ categories, activeCategory, onCategoryChange, counts }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        const count = counts[cat.id] ?? 0;
        return (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onCategoryChange(cat.id)}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-saffron to-gold text-white shadow-md shadow-gold/30'
                : 'bg-white dark:bg-brown-800/60 border border-gold/20 dark:border-gold/10 text-brown-700 dark:text-cream-50/70 hover:border-gold/40 hover:bg-gold/5 dark:hover:bg-gold/10'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
              isActive ? 'bg-white/20 text-white' : 'bg-gold/10 text-gold'
            }`}>
              {count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}



// ─── Page ──────────────────────────────────────────────────────────────────────

export default function StoriesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedStories, setLikedStories] = useState([]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: stories.length };
    stories.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered list
  const filteredStories = useMemo(() => {
    let results = getCategoryStories(activeCategory);
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q) ||
          s.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    
    return results;
  }, [activeCategory, searchQuery]);

  const featuredStories = useMemo(() => getFeaturedStories(), []);

  const handleLike = useCallback((id) => {
    setLikedStories(prev => {
      if (prev.includes(id)) {
        return prev.filter(s => s !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const isLiked = (id) => likedStories.includes(id);

  // Deduplicate categories
  const allCategories = useMemo(() => {
    const seen = new Set();
    return [{ id: 'all', name: 'All', icon: '📖' }, ...storyCategories].filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, []);

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Page background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-amber-50 via-orange-50/40 to-yellow-50 dark:from-brown-950 dark:via-brown-900 dark:to-brown-950">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-radial from-amber-200/40 to-transparent rounded-full blur-3xl dark:from-gold/5" />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-gradient-radial from-orange-200/30 to-transparent rounded-full blur-3xl dark:from-saffron/5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* ── Back Button ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <button
            onClick={handleBack}
            className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-brown-800/80 backdrop-blur-sm rounded-full border border-gold/20 dark:border-gold/10 shadow-sm hover:shadow-md hover:border-gold/40 dark:hover:border-gold/30 transition-all duration-300"
          >
            <FaArrowLeft className="w-4 h-4 text-brown-600 dark:text-cream-50/60 group-hover:text-saffron dark:group-hover:text-gold transition-colors" />
            <span className="text-sm font-medium text-brown-700 dark:text-cream-50/80 group-hover:text-brown-900 dark:group-hover:text-cream-50 transition-colors">
              Back
            </span>
          </button>
        </motion.div>

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-brown-800/80 backdrop-blur-sm rounded-full border border-gold/20 shadow-sm mb-3">
            <GiLotus className="w-4 h-4 text-saffron" />
            <span className="text-xs font-semibold tracking-wide text-brown-600 dark:text-cream-50/70 uppercase">
              Inspiring Tales
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brown-900 dark:text-cream-50">
            Spiritual{' '}
            <span className="bg-gradient-to-r from-saffron via-gold to-amber-400 bg-clip-text text-transparent">
              Stories
            </span>
          </h1>
          <p className="mt-3 text-brown-500 dark:text-cream-50/50 max-w-xl mx-auto">
            Explore inspiring tales from ancient scriptures, saints, and spiritual traditions.
          </p>
        </motion.div>

        {/* ── Search ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto mb-6"
        >
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400 dark:text-cream-50/30" />
            <input
              type="text"
              placeholder="Search stories by title, author, or tags…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white/90 dark:bg-brown-800/80 backdrop-blur-sm border border-gold/20 dark:border-gold/10 rounded-full text-sm text-brown-900 dark:text-cream-50 placeholder:text-brown-400 dark:placeholder:text-cream-50/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gold/15 transition-colors"
              >
                <FaTimes className="w-3.5 h-3.5 text-brown-400" />
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Category Tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <CategoryTabs
            categories={allCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            counts={categoryCounts}
          />
        </motion.div>

        

        {/* ── Results Info ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <span className="text-sm text-brown-500 dark:text-cream-50/50">
            {filteredStories.length} stor{filteredStories.length !== 1 ? 'ies' : 'y'}
            {searchQuery ? ` for "${searchQuery}"` : ''}
          </span>
          
          {activeCategory !== 'all' && (
            <button
              onClick={() => { setActiveCategory('all'); }}
              className="text-xs text-gold hover:text-saffron font-medium transition-colors flex items-center gap-1"
            >
              <FaTimes className="w-3 h-3" /> Clear filter
            </button>
          )}
        </div>

        {/* ── Grid ── */}
        {filteredStories.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
          >
            <AnimatePresence>
              {filteredStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onLike={handleLike}
                  isLiked={isLiked(story.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <p className="text-5xl mb-4">📖</p>
            <h3 className="text-lg font-semibold text-brown-800 dark:text-cream-50 mb-1">
              No stories found
            </h3>
            <p className="text-sm text-brown-500 dark:text-cream-50/50 mb-5">
              Try a different search term or category
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="px-6 py-2.5 bg-gradient-to-r from-saffron to-gold text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-gold/30 transition-all"
            >
              Reset filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
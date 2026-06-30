// app/(web)/bhajans/page.jsx
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaMusic,
  FaTimes,
  FaPlay,
  FaPause,
  FaArrowRight,
  FaFire,
  FaHeadphones,
  FaStepForward,
  FaStepBackward,
  FaHeart,
  FaArrowLeft,
} from 'react-icons/fa';
import { GiLotus } from 'react-icons/gi';
import { toast } from 'react-hot-toast';
import BhajanCard from '@/components/web/home/bhajan/BhajanCard';
import BhajanPlayerModal from '@/components/web/home/bhajan/Bhajanplayermodal';
import { 
  getBhajans, 
  incrementMediaView,
  toggleMediaLike 
} from '@/lib/services/mediaService';

// ─── helpers ──────────────────────────────────────────────────────────────────

const getCategoryEmoji = (category) => {
  const emojis = { krishna: '🪈', shiva: '🔱', hanuman: '🙏', durga: '⚔️', sai: '🕊️', jagannath: '🛕' };
  return emojis[category?.toLowerCase()] || '🕉️';
};

const getCategoryGradient = (category) => {
  const colors = {
    krishna:   'from-blue-600 to-cyan-500',
    shiva:     'from-purple-600 to-indigo-500',
    hanuman:   'from-red-600 to-orange-500',
    durga:     'from-pink-600 to-rose-500',
    sai:       'from-green-600 to-emerald-500',
    jagannath: 'from-yellow-500 to-amber-400',
  };
  return colors[category?.toLowerCase()] || 'from-saffron to-gold';
};

const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// Helper to get YouTube thumbnail
const getYouTubeThumbnail = (url) => {
  if (!url) return null;
  
  let videoId = null;
  if (url.includes('youtu.be/')) {
    const match = url.match(/youtu\.be\/([^?&]+)/);
    videoId = match ? match[1] : null;
  } else if (url.includes('watch?v=')) {
    const match = url.match(/watch\?v=([^&]+)/);
    videoId = match ? match[1] : null;
  } else if (url.includes('/shorts/')) {
    const match = url.match(/\/shorts\/([^?&]+)/);
    videoId = match ? match[1] : null;
  } else if (url.includes('/embed/')) {
    const match = url.match(/\/embed\/([^?&]+)/);
    videoId = match ? match[1] : null;
  }
  
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
};

// ─── FeaturedHero ─────────────────────────────────────────────────────────────

function FeaturedHero({ bhajan, onOpen }) {
  if (!bhajan) return null;
  const gradient = getCategoryGradient(bhajan.category);
  const thumbnail = getYouTubeThumbnail(bhajan.youtubeUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-2xl overflow-hidden mb-10 cursor-pointer group"
      onClick={() => onOpen(bhajan)}
    >
      {/* BG gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-90`} />
      
      {/* Thumbnail as background */}
      {thumbnail && (
        <div className="absolute inset-0 opacity-30">
          <img 
            src={thumbnail} 
            alt={bhajan.title} 
            className="w-full h-full object-cover"
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      )}
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.3),transparent_70%)]" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 md:p-8 lg:p-10">
        {/* Thumbnail circle */}
        <div className="flex-shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-white/30 group-hover:scale-105 transition-transform duration-300">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={bhajan.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<span class="text-6xl md:text-7xl select-none">${getCategoryEmoji(bhajan.category)}</span>`;
              }}
            />
          ) : (
            <span className="text-6xl md:text-7xl select-none">
              {getCategoryEmoji(bhajan.category)}
            </span>
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white border border-white/20 mb-3">
            <FaFire className="w-3 h-3" />
            Featured Bhajan
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-1">
            {bhajan.title}
          </h2>
          <p className="text-white/70 text-sm mb-4">{bhajan.artist}</p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-white/60 mb-6">
            <span className="flex items-center gap-1.5">
              <FaHeadphones className="w-3.5 h-3.5" />
              {formatNumber(bhajan.views || 0)} plays
            </span>
            <span className="flex items-center gap-1.5">
              <FaHeart className="w-3.5 h-3.5" />
              {formatNumber(bhajan.likes || 0)} likes
            </span>
            <span className="capitalize px-2 py-0.5 bg-white/15 rounded-full">
              {bhajan.category}
            </span>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onOpen(bhajan); }}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-brown-900 font-semibold text-sm rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <FaPlay className="w-3.5 h-3.5" />
            Play now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

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

// ─── StickyNowPlaying ─────────────────────────────────────────────────────────

function StickyNowPlaying({ bhajan, isPlaying, onOpen, onToggle, onNext, onPrev, onClose }) {
  if (!bhajan) return null;
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="fixed bottom-0 left-0 right-0 z-40 p-3 md:p-4"
    >
      <div className="max-w-3xl mx-auto flex items-center gap-3 md:gap-4 px-4 py-3 bg-brown-900/96 dark:bg-brown-950/96 backdrop-blur-xl rounded-2xl shadow-2xl border border-gold/25">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-saffron/40 to-gold/30 flex items-center justify-center cursor-pointer"
          onClick={() => onOpen(bhajan)}
        >
          <span className="text-xl">{getCategoryEmoji(bhajan.category)}</span>
        </div>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onOpen(bhajan)}>
          <p className="text-xs font-semibold text-cream-50 truncate">{bhajan.title}</p>
          <p className="text-[10px] text-cream-50/50 truncate">{bhajan.artist}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button onClick={onPrev} className="p-2 rounded-full hover:bg-white/10 text-cream-50/60 hover:text-cream-50 transition-colors">
            <FaStepBackward className="w-3 h-3" />
          </button>
          <button
            onClick={onToggle}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron to-gold text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          >
            {isPlaying ? <FaPause className="w-3.5 h-3.5" /> : <FaPlay className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          <button onClick={onNext} className="p-2 rounded-full hover:bg-white/10 text-cream-50/60 hover:text-cream-50 transition-colors">
            <FaStepForward className="w-3 h-3" />
          </button>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-cream-50/40 hover:text-cream-50 transition-colors ml-1">
            <FaTimes className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function BhajansPage() {
  const router = useRouter();
  const [allBhajans, setAllBhajans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [likedBhajans, setLikedBhajans] = useState([]);
  const [modalBhajan, setModalBhajan] = useState(null);

  // Fetch real data
  useEffect(() => {
    const fetchBhajans = async () => {
      setLoading(true);
      try {
        const result = await getBhajans(100);
        if (result.success) {
          setAllBhajans(result.bhajans);
        } else {
          toast.error('Failed to load bhajans');
        }
      } catch (error) {
        console.error('Error fetching bhajans:', error);
        toast.error('Failed to load bhajans');
      } finally {
        setLoading(false);
      }
    };
    fetchBhajans();
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: allBhajans.length };
    allBhajans.forEach((b) => {
      const cat = b.category?.toLowerCase() || 'uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [allBhajans]);

  // Filtered list
  const filteredBhajans = useMemo(() => {
    let results = allBhajans;
    if (activeCategory !== 'all') {
      results = results.filter((b) => b.category?.toLowerCase() === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.artist?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q)
      );
    }
    return results;
  }, [allBhajans, activeCategory, searchQuery]);

  // Featured = first featured bhajan or first in list
  const featuredBhajan = useMemo(
    () => allBhajans.find((b) => b.isFeatured) || allBhajans[0],
    [allBhajans]
  );

  // Modal handlers
  const handleOpenModal = useCallback(async (bhajan) => {
    setModalBhajan(bhajan);
    setPlayingId(bhajan.id);
    
    try {
      await incrementMediaView(bhajan.id);
      setAllBhajans(prev => 
        prev.map(b => 
          b.id === bhajan.id 
            ? { ...b, views: (b.views || 0) + 1 }
            : b
        )
      );
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalBhajan(null);
  }, []);

  const handleNext = useCallback(() => {
    if (!modalBhajan) return;
    const idx = filteredBhajans.findIndex((b) => b.id === modalBhajan.id);
    const next = filteredBhajans[(idx + 1) % filteredBhajans.length];
    if (next) { setModalBhajan(next); setPlayingId(next.id); }
  }, [modalBhajan, filteredBhajans]);

  const handlePrev = useCallback(() => {
    if (!modalBhajan) return;
    const idx = filteredBhajans.findIndex((b) => b.id === modalBhajan.id);
    const prev = filteredBhajans[(idx - 1 + filteredBhajans.length) % filteredBhajans.length];
    if (prev) { setModalBhajan(prev); setPlayingId(prev.id); }
  }, [modalBhajan, filteredBhajans]);

  const handleLike = useCallback(async (id) => {
    setLikedBhajans((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
    
    setAllBhajans(prev => 
      prev.map(b => 
        b.id === id 
          ? { ...b, likes: (b.likes || 0) + 1 }
          : b
      )
    );

    try {
      await toggleMediaLike(id);
    } catch (error) {
      console.error('Error toggling like:', error);
      setLikedBhajans((prev) =>
        prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
      );
      setAllBhajans(prev => 
        prev.map(b => 
          b.id === id 
            ? { ...b, likes: Math.max(0, (b.likes || 0) - 1) }
            : b
        )
      );
    }
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (!modalBhajan) return;
    setPlayingId((prev) => (prev === modalBhajan.id ? null : modalBhajan.id));
  }, [modalBhajan]);

  const isLiked = (id) => likedBhajans.includes(id);
  const nowPlaying = playingId ? allBhajans.find((b) => b.id === playingId) : null;

  // Unique categories from real data
  const uniqueCategories = useMemo(() => {
    const cats = new Set();
    allBhajans.forEach(b => {
      if (b.category) cats.add(b.category.toLowerCase());
    });
    return Array.from(cats);
  }, [allBhajans]);

  const allCategories = useMemo(() => {
    const defaultCats = [{ id: 'all', name: 'All', icon: '🕉️' }];
    const categoryCats = uniqueCategories.map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      icon: getCategoryEmoji(cat),
    }));
    return [...defaultCats, ...categoryCats];
  }, [uniqueCategories]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (allBhajans.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
        <p className="text-5xl mb-4">🎵</p>
        <h2 className="text-2xl font-bold text-brown-900 dark:text-cream-50 mb-2">
          No Bhajans Available
        </h2>
        <p className="text-brown-500 dark:text-cream-50/50">
          Check back later for devotional music.
        </p>
      </div>
    );
  }

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
          className="mb-2"
        >
          <button
            onClick={handleBack}
            className="group inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-brown-800/80 backdrop-blur-sm rounded-full border border-gold/20 dark:border-gold/10 shadow-sm hover:shadow-md hover:border-gold/40 dark:hover:border-gold/30 transition-all duration-300"
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
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-brown-800/80 backdrop-blur-sm rounded-full border border-gold/20 shadow-sm mb-3">
            <GiLotus className="w-4 h-4 text-saffron" />
            <span className="text-xs font-semibold tracking-wide text-brown-600 dark:text-cream-50/70 uppercase">
              Divine Melodies
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brown-900 dark:text-cream-50">
            Explore{' '}
            <span className="bg-gradient-to-r from-saffron via-gold to-amber-400 bg-clip-text text-transparent">
              Bhajans
            </span>
          </h1>
          <p className="mt-3 text-brown-500 dark:text-cream-50/50 max-w-xl mx-auto">
            Discover sacred devotional music — filter by deity, or search for a favourite.
          </p>
        </motion.div>

        {/* ── Featured Hero ── */}
        {featuredBhajan && (
          <FeaturedHero bhajan={featuredBhajan} onOpen={handleOpenModal} />
        )}

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
              placeholder="Search by title, artist, or category…"
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
          className="mb-8"
        >
          <CategoryTabs
            categories={allCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            counts={categoryCounts}
          />
        </motion.div>

        {/* ── Results meta ── */}
        <div className="flex items-center justify-between mb-5 text-sm">
          <span className="text-brown-500 dark:text-cream-50/50">
            {filteredBhajans.length} bhajan{filteredBhajans.length !== 1 ? 's' : ''}
            {searchQuery ? ` for "${searchQuery}"` : ''}
          </span>
          {activeCategory !== 'all' && (
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="text-xs text-gold hover:text-saffron font-medium transition-colors flex items-center gap-1"
            >
              <FaTimes className="w-3 h-3" /> Clear filter
            </button>
          )}
        </div>

        {/* ── Grid ── */}
        {filteredBhajans.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5"
          >
            <AnimatePresence>
              {filteredBhajans.map((bhajan) => (
                <BhajanCard
                  key={bhajan.id}
                  bhajan={bhajan}
                  isPlaying={playingId === bhajan.id}
                  onPlay={() => handleOpenModal(bhajan)}
                  onLike={handleLike}
                  isLiked={isLiked(bhajan.id)}
                  onClick={handleOpenModal}
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
            <p className="text-5xl mb-4">🎵</p>
            <h3 className="text-lg font-semibold text-brown-800 dark:text-cream-50 mb-1">
              No bhajans found
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

      {/* ── Sticky Now-Playing Bar ── */}
      <AnimatePresence>
        {nowPlaying && !modalBhajan && (
          <StickyNowPlaying
            key="sticky-bar"
            bhajan={nowPlaying}
            isPlaying={playingId === nowPlaying.id}
            onOpen={handleOpenModal}
            onToggle={handleTogglePlay}
            onNext={handleNext}
            onPrev={handlePrev}
            onClose={() => setPlayingId(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Player Modal ── */}
      <BhajanPlayerModal
        bhajan={modalBhajan}
        isOpen={!!modalBhajan}
        onClose={handleCloseModal}
        onNext={handleNext}
        onPrev={handlePrev}
        onLike={handleLike}
        isLiked={modalBhajan ? isLiked(modalBhajan.id) : false}
        isPlaying={modalBhajan ? playingId === modalBhajan.id : false}
        onPlay={handleTogglePlay}
      />
    </div>
  );
}
// app/(web)/spiritual-videos/page.jsx
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaVideo,
  FaTimes,
  FaFire,
  FaClock,
  FaEye,
  FaArrowLeft,
  FaPlay,
  FaPause,
  FaHeart,
  FaStepForward,
  FaStepBackward,
} from 'react-icons/fa';
import { GiLotus } from 'react-icons/gi';
import VideoCard from '@/components/web/home/spiritual-videos/VideoCard';
import VideoPlayerModal from '@/components/web/home/spiritual-videos/VideoPlayerModal';
import {
  getVideos,
  getTrendingVideos,
  incrementVideoView,
  toggleVideoLike,
} from '@/lib/services/mediaService';

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

function StickyNowPlaying({ video, isPlaying, onOpen, onToggle, onNext, onPrev, onClose }) {
  if (!video) return null;
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="fixed bottom-0 left-0 right-0 z-40 p-3 md:p-4"
    >
      <div className="max-w-3xl mx-auto flex items-center gap-3 md:gap-4 px-4 py-3 bg-brown-900/96 dark:bg-brown-950/96 backdrop-blur-xl rounded-2xl shadow-2xl border border-gold/25">
        {/* Thumbnail */}
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-saffron/40 to-gold/30 cursor-pointer"
          onClick={() => onOpen(video)}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onOpen(video)}>
          <p className="text-xs font-semibold text-cream-50 truncate">{video.title}</p>
          <p className="text-[10px] text-cream-50/50 truncate">{video.speaker}</p>
        </div>

        {/* Controls */}
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

export default function SpiritualVideosPage() {
  const router = useRouter();
  const [allVideos, setAllVideos] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [likedVideos, setLikedVideos] = useState([]);
  const [modalVideo, setModalVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const result = await getVideos(60, 'standard');
        if (result.success) {
          setAllVideos(result.videos || []);
        }
      } catch (error) {
        console.error('Error fetching spiritual videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = { all: allVideos.length };
    allVideos.forEach((v) => {
      counts[v.category] = (counts[v.category] || 0) + 1;
    });
    return counts;
  }, [allVideos]);

  const filteredVideos = useMemo(() => {
    let results = allVideos;
    if (activeCategory !== 'all') {
      results = results.filter((video) => video.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.speaker.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q)
      );
    }
    return results;
  }, [allVideos, activeCategory, searchQuery]);

  const handleOpenModal = useCallback(async (video) => {
    setModalVideo(video);
    setPlayingId(video.id);
    try {
      await incrementVideoView(video.id);
    } catch (error) {
      console.error('Error incrementing video view:', error);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVideo(null);
  }, []);

  const handleNext = useCallback(() => {
    if (!playingId) return;
    const idx = filteredVideos.findIndex((v) => v.id === playingId);
    const next = filteredVideos[(idx + 1) % filteredVideos.length];
    if (next) { setModalVideo(next); setPlayingId(next.id); }
  }, [playingId, filteredVideos]);

  const handlePrev = useCallback(() => {
    if (!playingId) return;
    const idx = filteredVideos.findIndex((v) => v.id === playingId);
    const prev = filteredVideos[(idx - 1 + filteredVideos.length) % filteredVideos.length];
    if (prev) { setModalVideo(prev); setPlayingId(prev.id); }
  }, [playingId, filteredVideos]);

  const handleLike = useCallback(async (id) => {
    setLikedVideos((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
    try {
      await toggleVideoLike(id);
    } catch (error) {
      console.error('Error toggling video like:', error);
    }
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (!modalVideo) return;
    setPlayingId((prev) => (prev === modalVideo.id ? null : modalVideo.id));
  }, [modalVideo]);

  const isLiked = (id) => likedVideos.includes(id);
  const nowPlaying = playingId ? allVideos.find((v) => v.id === playingId) : null;

  const allCategories = useMemo(() => {
    const seen = new Set();
    const categories = [{ id: 'all', name: 'All', icon: '🎬' }];
    allVideos.forEach((video) => {
      const categoryId = video.category || 'general';
      if (!seen.has(categoryId)) {
        seen.add(categoryId);
        categories.push({ id: categoryId, name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1), icon: '🎥' });
      }
    });
    return categories;
  }, [allVideos]);

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

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-14 py-6 lg:py-8">

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
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-brown-800/80 backdrop-blur-sm rounded-full border border-gold/20 shadow-sm mb-3">
            <GiLotus className="w-4 h-4 text-saffron" />
            <span className="text-xs font-semibold tracking-wide text-brown-600 dark:text-cream-50/70 uppercase">
              Watch & Learn
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brown-900 dark:text-cream-50">
            Spiritual{' '}
            <span className="bg-gradient-to-r from-saffron via-gold to-amber-400 bg-clip-text text-transparent">
              Videos
            </span>
          </h1>
          <p className="mt-3 text-brown-500 dark:text-cream-50/50 max-w-xl mx-auto">
            Explore insightful discourses, soulful bhajans, and spiritual documentaries.
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
              placeholder="Search by title, speaker, or category…"
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

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ── Results meta ── */}
            <div className="flex items-center justify-between mb-5 text-sm">
              <span className="text-brown-500 dark:text-cream-50/50">
                {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
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
            {filteredVideos.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
              >
                <AnimatePresence>
                  {filteredVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      isPlaying={playingId === video.id}
                      onPlay={() => handleOpenModal(video)}
                      onLike={handleLike}
                      isLiked={isLiked(video.id)}
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
                <p className="text-5xl mb-4">🎬</p>
                <h3 className="text-lg font-semibold text-brown-800 dark:text-cream-50 mb-1">
                  No videos found
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
          </>
        )}
      </div>

      {/* ── Sticky Now-Playing Bar ── */}
      <AnimatePresence>
        {nowPlaying && !modalVideo && (
          <StickyNowPlaying
            key="sticky-bar"
            video={nowPlaying}
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
      <VideoPlayerModal
        video={modalVideo}
        isOpen={!!modalVideo}
        onClose={handleCloseModal}
        onNext={handleNext}
        onPrev={handlePrev}
        onLike={handleLike}
        isLiked={modalVideo ? isLiked(modalVideo.id) : false}
        isPlaying={modalVideo ? playingId === modalVideo.id : false}
        onPlay={handleTogglePlay}
      />
    </div>
  );
}
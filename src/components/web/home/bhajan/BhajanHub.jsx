// components/web/home/bhajan/BhajanHub.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaMusic,
  FaArrowRight,
  FaHeart,
  FaPlay,
  FaPause,
  FaTimes,
  FaStepForward,
  FaStepBackward,
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import BhajanCard from './BhajanCard';
import BhajanPlayerModal from './Bhajanplayermodal';
import { 
  getBhajans, 
  incrementMediaView,
  toggleMediaLike 
} from '@/lib/services/mediaService';

// Get unique categories from bhajans
const getUniqueCategories = (bhajans) => {
  const categories = new Set();
  bhajans.forEach(b => {
    if (b.category) categories.add(b.category);
  });
  return Array.from(categories);
};

// Category emoji mapping
const categoryEmojis = {
  krishna: '🪈',
  shiva: '🔱',
  hanuman: '🙏',
  durga: '⚔️',
  sai: '🕊️',
  jagannath: '🛕',
};

const getCategoryEmoji = (category) => {
  return categoryEmojis[category?.toLowerCase()] || '🕉️';
};

// Helper to extract YouTube video ID and embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  
  // If it's already an embed URL, return as is
  if (url.includes('/embed/')) return url;
  
  // Extract video ID
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
  } else if (url.includes('youtube.com/embed/')) {
    return url; // Already an embed URL
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

export default function BhajanHub() {
  const [bhajans, setBhajans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const [likedBhajans, setLikedBhajans] = useState([]);
  const [modalBhajan, setModalBhajan] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get all bhajans
        const bhajansResult = await getBhajans(20);
        if (bhajansResult.success) {
          setBhajans(bhajansResult.bhajans);
          // Extract unique categories
          const uniqueCategories = getUniqueCategories(bhajansResult.bhajans);
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching bhajans:', error);
        toast.error('Failed to load bhajans');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = useCallback(async (bhajan) => {
    setModalBhajan(bhajan);
    setPlayingId(bhajan.id);
    
    // Increment view count
    try {
      await incrementMediaView(bhajan.id);
      // Update local state
      setBhajans(prev => 
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
    const idx = bhajans.findIndex((b) => b.id === modalBhajan.id);
    const next = bhajans[(idx + 1) % bhajans.length];
    setModalBhajan(next);
    setPlayingId(next.id);
  }, [modalBhajan, bhajans]);

  const handlePrev = useCallback(() => {
    if (!modalBhajan) return;
    const idx = bhajans.findIndex((b) => b.id === modalBhajan.id);
    const prev = bhajans[(idx - 1 + bhajans.length) % bhajans.length];
    setModalBhajan(prev);
    setPlayingId(prev.id);
  }, [modalBhajan, bhajans]);

  const handleLike = useCallback(async (id) => {
    // Optimistic update
    setLikedBhajans((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
    
    // Update local state
    setBhajans(prev => 
      prev.map(b => 
        b.id === id 
          ? { ...b, likes: (b.likes || 0) + 1 }
          : b
      )
    );

    // API call
    try {
      await toggleMediaLike(id);
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setLikedBhajans((prev) =>
        prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
      );
      setBhajans(prev => 
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

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (bhajans.length === 0) {
    return (
      <section className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">No bhajans available yet.</p>
      </section>
    );
  }

  return (
    <section className="py-6 lg:py-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-50/40 via-white to-cream-50/40 dark:from-brown-900/20 dark:via-brown-900 dark:to-brown-900/20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-saffron/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-brown-800/80 backdrop-blur-sm rounded-full border border-gold/20 shadow-sm mb-3">
            <FaMusic className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wide text-brown-600 dark:text-cream-50/70 uppercase">
              Divine Melodies
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-brown-900 dark:text-cream-50">
            Bhajan{' '}
            <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">Hub</span>
          </h2>
          <p className="mt-1.5 text-sm text-brown-500 dark:text-cream-50/50 max-w-sm">
            Devotional music to connect with the divine.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {bhajans.map((bhajan) => (
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
        </div>

        {/* See all */}
        <div className="text-center mt-8">
          <Link
            href="/bhajans"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-saffron to-gold text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-gold/30 transition-all"
          >
            See all bhajans <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Mini now-playing bar */}
      <AnimatePresence>
        {playingId && !modalBhajan && (() => {
          const playing = bhajans.find((b) => b.id === playingId);
          if (!playing) return null;
          return (
            <motion.div
              key="mini-bar"
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 80 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-safe"
            >
              <div className="max-w-2xl mx-auto mb-3 flex items-center gap-3 px-4 py-3 bg-brown-900/95 dark:bg-brown-950/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gold/20">
                <span className="text-2xl">{getCategoryEmoji(playing.category)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-cream-50 truncate">{playing.title}</p>
                  <p className="text-[10px] text-cream-50/50 truncate">{playing.artist}</p>
                </div>
                <button
                  onClick={() => handleOpenModal(playing)}
                  className="p-2 rounded-full bg-gradient-to-br from-saffron to-gold text-white"
                >
                  <FaPlay className="w-3 h-3 ml-0.5" />
                </button>
                <button
                  onClick={() => setPlayingId(null)}
                  className="p-2 rounded-full bg-white/10 text-cream-50/60 hover:text-cream-50 transition-colors"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Modal */}
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
        allBhajans={bhajans}
        getYouTubeEmbedUrl={getYouTubeEmbedUrl}
      />
    </section>
  );
}
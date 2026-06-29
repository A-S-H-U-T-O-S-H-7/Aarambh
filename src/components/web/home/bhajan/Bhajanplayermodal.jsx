// components/web/home/bhajan/BhajanPlayerModal.jsx
'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaPlay,
  FaPause,
  FaHeart,
  FaRegHeart,
  FaStepBackward,
  FaStepForward,
  FaHeadphones,
  FaClock,
} from 'react-icons/fa';

const getCategoryGradient = (category) => {
  const map = {
    krishna:   'from-blue-500 to-cyan-400',
    shiva:     'from-purple-500 to-indigo-400',
    hanuman:   'from-red-500 to-orange-400',
    durga:     'from-pink-500 to-rose-400',
    sai:       'from-green-500 to-emerald-400',
    jagannath: 'from-yellow-500 to-amber-400',
  };
  return map[category] || 'from-saffron to-gold';
};

const getCategoryEmoji = (category) => {
  const map = { krishna: '🪈', shiva: '🔱', hanuman: '🙏', durga: '⚔️', sai: '🕊️', jagannath: '🛕' };
  return map[category] || '🕉️';
};

const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return String(num);
};

export default function BhajanPlayerModal({
  bhajan,
  isOpen,
  onClose,
  onNext,
  onPrev,
  onLike,
  isLiked,
  isPlaying,
  onPlay,
}) {
  // ESC to close + lock scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!bhajan) return null;

  const hasVideo = !!bhajan.videoUrl;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 28 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl bg-white dark:bg-brown-900 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient accent bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${getCategoryGradient(bhajan.category)}`} />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
              >
                <FaTimes className="w-3.5 h-3.5 text-brown-800 dark:text-cream-50" />
              </button>

              {/* ── Video / Cover area ── */}
              {hasVideo ? (
                /* Full-width 16/9 video embed */
                <div className="relative w-full aspect-video bg-black">
                  <iframe
                    key={bhajan.videoUrl}
                    src={`${bhajan.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                    title={bhajan.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              ) : (
                /* Cover art placeholder with play overlay */
                <div className={`relative w-full aspect-video bg-gradient-to-br ${getCategoryGradient(bhajan.category)} flex items-center justify-center`}>
                  <span className="text-8xl opacity-40 select-none">
                    {getCategoryEmoji(bhajan.category)}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={onPlay}
                      className="w-16 h-16 rounded-full bg-white/90 text-brown-900 flex items-center justify-center shadow-xl"
                    >
                      {isPlaying
                        ? <FaPause className="w-6 h-6" />
                        : <FaPlay className="w-6 h-6 ml-1" />}
                    </motion.button>
                  </div>
                </div>
              )}

              {/* ── Info + controls ── */}
              <div className="px-5 py-4 md:px-6 md:py-5">
                {/* Category + title */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/20 mb-2 capitalize">
                      {getCategoryEmoji(bhajan.category)} {bhajan.category}
                    </span>
                    <h2 className="text-base md:text-lg font-bold text-brown-900 dark:text-cream-50 leading-snug">
                      {bhajan.title}
                    </h2>
                    <p className="text-sm text-brown-500 dark:text-cream-50/55 mt-0.5">
                      {bhajan.artist}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-brown-400 dark:text-cream-50/40 mb-4">
                  <span className="flex items-center gap-1">
                    <FaHeadphones className="w-3 h-3" />
                    {formatNumber(bhajan.plays)} plays
                  </span>
                  <span className="flex items-center gap-1">
                    <FaHeart className="w-3 h-3" />
                    {formatNumber(bhajan.likes)} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock className="w-3 h-3" />
                    {bhajan.duration}
                  </span>
                </div>

                {/* Controls row */}
                <div className="flex items-center justify-between pt-3 border-t border-gold/10">
                  {/* Prev / Next */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onPrev}
                      className="p-2.5 rounded-full bg-gold/8 hover:bg-gold/20 text-brown-700 dark:text-cream-50/70 transition-colors border border-gold/15"
                      title="Previous"
                    >
                      <FaStepBackward className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={onNext}
                      className="p-2.5 rounded-full bg-gold/8 hover:bg-gold/20 text-brown-700 dark:text-cream-50/70 transition-colors border border-gold/15"
                      title="Next"
                    >
                      <FaStepForward className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Like */}
                  <button
                    onClick={() => onLike?.(bhajan.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 hover:border-divine-red/30 hover:bg-divine-red/5 transition-all text-sm font-medium text-brown-700 dark:text-cream-50/80"
                  >
                    {isLiked
                      ? <FaHeart className="w-4 h-4 text-divine-red" />
                      : <FaRegHeart className="w-4 h-4 text-brown-400 dark:text-cream-50/40" />}
                    {isLiked ? 'Liked' : 'Like'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
// components/web/home/video/VideoPlayerModal.jsx
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
  FaEye,
  FaClock,
  FaUserCircle,
} from 'react-icons/fa';

const getCategoryGradient = (category) => {
  const map = {
    discourse: 'from-purple-500 to-indigo-400',
    bhajan: 'from-pink-500 to-rose-400',
    documentary: 'from-blue-500 to-cyan-400',
    talk: 'from-green-500 to-emerald-400',
  };
  return map[category] || 'from-saffron to-gold';
};

const getCategoryEmoji = (category) => {
  const map = {
    discourse: '📿',
    bhajan: '🎵',
    documentary: '🎥',
    talk: '🗣️',
  };
  return map[category] || '🎬';
};

const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return String(num);
};

// Helper to get YouTube embed URL
const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;
  
  if (url.includes('/embed/')) return url;
  
  let videoId = null;
  if (url.includes('watch?v=')) {
    const match = url.match(/[?&]v=([^&]+)/);
    if (match) videoId = match[1];
  } else if (url.includes('youtu.be/')) {
    const match = url.match(/youtu\.be\/([^?]+)/);
    if (match) videoId = match[1];
  } else if (url.includes('/embed/')) {
    const match = url.match(/\/embed\/([^?]+)/);
    if (match) videoId = match[1];
  } else if (url.includes('/shorts/')) {
    const match = url.match(/\/shorts\/([^?]+)/);
    if (match) videoId = match[1];
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

export default function VideoPlayerModal({
  video,
  isOpen,
  onClose,
  onNext,
  onPrev,
  onLike,
  isLiked,
  isPlaying,
  onPlay,
}) {
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

  if (!video) return null;

  const videoEmbedUrl = getYoutubeEmbedUrl(video.youtubeUrl);
  const hasVideo = !!videoEmbedUrl;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 28 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl bg-white dark:bg-brown-900 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`h-1 w-full bg-gradient-to-r ${getCategoryGradient(video.category)}`} />

              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
              >
                <FaTimes className="w-3.5 h-3.5 text-brown-800 dark:text-cream-50" />
              </button>

              {hasVideo ? (
                <div className="relative w-full aspect-video bg-black">
                  <iframe
                    key={videoEmbedUrl}
                    src={`${videoEmbedUrl}?autoplay=1&rel=0&modestbranding=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              ) : (
                <div className={`relative w-full aspect-video bg-gradient-to-br ${getCategoryGradient(video.category)} flex items-center justify-center`}>
                  <span className="text-8xl opacity-40 select-none">
                    {getCategoryEmoji(video.category)}
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

              <div className="px-5 py-4 md:px-6 md:py-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gold/10 text-gold border border-gold/20 mb-2 capitalize">
                      {getCategoryEmoji(video.category)} {video.category}
                    </span>
                    <h2 className="text-base md:text-lg font-bold text-brown-900 dark:text-cream-50 leading-snug">
                      {video.title}
                    </h2>
                    <p className="text-sm text-brown-500 dark:text-cream-50/55 mt-0.5 flex items-center gap-1.5">
                      <FaUserCircle className="w-3.5 h-3.5" />
                      {video.speaker}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-brown-400 dark:text-cream-50/40 mb-4">
                  <span className="flex items-center gap-1">
                    <FaEye className="w-3 h-3" />
                    {formatNumber(video.views)} views
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock className="w-3 h-3" />
                    {video.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaHeart className="w-3 h-3" />
                    {formatNumber(video.likes)} likes
                  </span>
                </div>

                {video.description && (
                  <p className="text-xs text-brown-600 dark:text-cream-50/60 leading-relaxed mb-4 line-clamp-2">
                    {video.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gold/10">
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

                  <button
                    onClick={() => onLike?.(video.id)}
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
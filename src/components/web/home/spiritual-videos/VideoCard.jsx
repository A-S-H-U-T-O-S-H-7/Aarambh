// components/web/home/video/VideoCard.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaPlay,
  FaPause,
  FaClock,
  FaEye,
  FaHeart,
  FaRegHeart,
  FaUserCircle
} from 'react-icons/fa';

const getCategoryGradient = (category) => {
  const colors = {
    discourse: 'from-purple-500/30 to-indigo-400/20',
    bhajan: 'from-pink-500/30 to-rose-400/20',
    documentary: 'from-blue-500/30 to-cyan-400/20',
    talk: 'from-green-500/30 to-emerald-400/20',
  };
  return colors[category] || 'from-saffron/20 to-gold/20';
};

const getCategoryAccent = (category) => {
  const colors = {
    discourse: 'bg-purple-500',
    bhajan: 'bg-pink-500',
    documentary: 'bg-blue-500',
    talk: 'bg-green-500',
  };
  return colors[category] || 'bg-gold';
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

const formatViews = (views) => {
  if (!views) return '0';
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
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
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};

export default function VideoCard({ video, isPlaying, onPlay, onLike, isLiked, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCardClick = () => {
    if (onClick) onClick(video);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick(video);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onLike?.(video.id);
  };

  const thumbnailUrl = video.thumbnail || getYouTubeThumbnail(video.youtubeUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-brown-800/80 rounded-xl border border-gold/15 dark:border-gold/10 shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-gold/10 hover:border-gold/35"
    >
      {/* Now playing accent bar */}
      {isPlaying && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className={`absolute top-0 left-0 right-0 h-0.5 ${getCategoryAccent(video.category)} z-10`}
        />
      )}

      {/* Thumbnail */}
      <div className={`relative aspect-video w-full bg-gradient-to-br ${getCategoryGradient(video.category)} overflow-hidden`}>
        {thumbnailUrl && !imgError ? (
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-5xl transition-all duration-300 ${hovered ? 'opacity-30 scale-110' : 'opacity-50'}`}>
              {getCategoryEmoji(video.category)}
            </span>
          </div>
        )}

        {/* Dark overlay - slightly stronger on hover */}
        <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${hovered || isPlaying ? 'opacity-60' : 'opacity-35'}`} />

        {/* ─── SINGLE PLAY BUTTON ─── */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.92 }}
            onClick={handlePlayClick}
            className={`
              w-11 h-11 rounded-full flex items-center justify-center shadow-lg
              transition-all duration-300
              bg-gradient-to-br from-saffron to-gold text-white scale-110 shadow-xl shadow-saffron/30
            `}
          >
            {isPlaying ? (
              <FaPause className="w-4 h-4" />
            ) : (
              <FaPlay className="w-4 h-4 ml-0.5" />
            )}
          </motion.button>
        </div>

        {/* ─── "Play" text - subtle hint ─── */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 text-[9px] font-medium tracking-wide uppercase transition-all duration-300 text-white/90 opacity-100">
          {isPlaying ? 'Now Playing' : 'Watch Now'}
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-medium rounded-full capitalize flex items-center gap-1">
          <span>{getCategoryEmoji(video.category)}</span>
          <span>{video.category}</span>
        </div>

        {/* Duration */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] rounded-full flex items-center gap-1">
            <FaClock className="w-2.5 h-2.5" />
            {video.duration}
          </div>
        )}

        {/* Featured Badge */}
        {video.isFeatured && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-gold text-brown-900 text-[9px] font-bold rounded-full shadow">
            ⭐ Featured
          </div>
        )}

        {/* Now playing wave bars */}
        {isPlaying && (
          <div className="absolute bottom-2 left-2 flex items-end gap-0.5 h-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [0.4, 1, 0.4] }}
                transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                className={`w-1 rounded-full origin-bottom ${getCategoryAccent(video.category)} opacity-90`}
                style={{ height: '100%' }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-1 mb-1.5">
          <div className="flex-1 min-w-0">
            <h3 className={`text-xs font-semibold leading-snug line-clamp-2 transition-colors ${isPlaying ? 'text-saffron' : 'text-brown-900 dark:text-cream-50 group-hover:text-saffron'}`}>
              {video.title}
            </h3>
            <p className="text-[10px] text-brown-500 dark:text-cream-50/50 truncate mt-0.5 flex items-center gap-1">
              <FaUserCircle className="w-2.5 h-2.5" />
              {video.speaker}
            </p>
          </div>
          <button
            onClick={handleLikeClick}
            className="p-1 rounded-full hover:bg-saffron/10 transition-colors flex-shrink-0 mt-0.5"
          >
            {isLiked ? (
              <FaHeart className="w-3.5 h-3.5 text-divine-red" />
            ) : (
              <FaRegHeart className="w-3.5 h-3.5 text-brown-300 dark:text-cream-50/30" />
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-[10px] text-brown-400 dark:text-cream-50/35">
          <span className="flex items-center gap-1">
            <FaEye className="w-2.5 h-2.5" />
            {formatViews(video.views)}
          </span>
          <span className="flex items-center gap-1">
            <FaClock className="w-2.5 h-2.5" />
            {video.duration}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
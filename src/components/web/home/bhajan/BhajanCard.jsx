// components/web/home/bhajan/BhajanCard.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaRegHeart,
  FaClock,
  FaHeadphones,
} from 'react-icons/fa';

const getCategoryGradient = (category) => {
  const colors = {
    krishna: 'from-blue-500/30 to-cyan-400/20',
    shiva:   'from-purple-500/30 to-indigo-400/20',
    hanuman: 'from-red-500/30 to-orange-400/20',
    durga:   'from-pink-500/30 to-rose-400/20',
    sai:     'from-green-500/30 to-emerald-400/20',
    jagannath: 'from-yellow-500/30 to-amber-400/20',
  };
  return colors[category?.toLowerCase()] || 'from-saffron/20 to-gold/20';
};

const getCategoryAccent = (category) => {
  const colors = {
    krishna:   'bg-blue-500',
    shiva:     'bg-purple-500',
    hanuman:   'bg-red-500',
    durga:     'bg-pink-500',
    sai:       'bg-green-500',
    jagannath: 'bg-yellow-500',
  };
  return colors[category?.toLowerCase()] || 'bg-gold';
};

const getCategoryEmoji = (category) => {
  const emojis = {
    krishna: '🪈', shiva: '🔱', hanuman: '🙏',
    durga: '⚔️', sai: '🕊️', jagannath: '🛕',
  };
  return emojis[category?.toLowerCase()] || '🕉️';
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

const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export default function BhajanCard({ bhajan, isPlaying, onPlay, onLike, isLiked, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCardClick = () => {
    if (onClick) onClick(bhajan);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick(bhajan);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onLike?.(bhajan.id);
  };

  const thumbnailUrl = getYouTubeThumbnail(bhajan.youtubeUrl);

  // Badge logic: if both featured and trending, show only trending
  const showFeatured = bhajan.isFeatured && !bhajan.isTrending;
  const showTrending = bhajan.isTrending;

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
          className={`absolute top-0 left-0 right-0 h-0.5 ${getCategoryAccent(bhajan.category)} z-10`}
        />
      )}

      {/* Cover Art */}
      <div className={`relative aspect-square w-full bg-gradient-to-br ${getCategoryGradient(bhajan.category)} overflow-hidden`}>
        {/* Thumbnail Image */}
        {thumbnailUrl && !imgError ? (
          <img
            src={thumbnailUrl}
            alt={bhajan.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-5xl transition-all duration-300 ${hovered ? 'opacity-30 scale-110' : 'opacity-50'}`}>
              {getCategoryEmoji(bhajan.category)}
            </span>
          </div>
        )}

        {/* Dark overlay - darker on hover */}
        <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${hovered || isPlaying ? 'opacity-60' : 'opacity-0'}`} />

        {/* ─── SINGLE PLAY BUTTON ─── */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.92 }}
            onClick={handlePlayClick}
            className={`
              w-11 h-11 rounded-full flex items-center justify-center shadow-lg
              transition-all duration-300
              ${hovered || isPlaying 
                ? 'bg-gradient-to-br from-saffron to-gold text-white scale-110 shadow-xl shadow-saffron/30' 
                : 'bg-white/25 backdrop-blur-sm text-white border border-white/40'
              }
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
        <div className={`
          absolute bottom-14 left-1/2 -translate-x-1/2 
          text-[9px] font-medium tracking-wide uppercase
          transition-all duration-300
          ${hovered || isPlaying 
            ? 'text-white/80 opacity-100' 
            : 'text-white/40 opacity-0'
          }
        `}>
          {isPlaying ? 'Now Playing' : 'Play'}
        </div>

        {/* Badges */}
        {showFeatured && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-gold text-brown-900 text-[9px] font-bold rounded-full shadow">
            ⭐ Featured
          </div>
        )}

        {showTrending && (
          <div className={`absolute top-2 ${showFeatured ? 'left-20' : 'left-2'} px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full shadow`}>
            🔥 Trending
          </div>
        )}

        {/* Duration pill */}
        {bhajan.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] rounded-full flex items-center gap-1">
            <FaClock className="w-2.5 h-2.5" />
            {bhajan.duration}
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
                className={`w-1 rounded-full origin-bottom ${getCategoryAccent(bhajan.category)} opacity-90`}
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
              {bhajan.title}
            </h3>
            <p className="text-[10px] text-brown-500 dark:text-cream-50/50 truncate mt-0.5">
              {bhajan.artist}
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
            <FaHeadphones className="w-2.5 h-2.5" />
            {formatNumber(bhajan.views || 0)}
          </span>
          <span className="flex items-center gap-1">
            <FaHeart className="w-2.5 h-2.5" />
            {formatNumber(bhajan.likes || 0)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
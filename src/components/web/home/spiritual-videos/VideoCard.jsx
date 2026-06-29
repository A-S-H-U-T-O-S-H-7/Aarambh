// components/web/home/VideoCard.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  FaPlay, 
  FaPause,
  FaClock, 
  FaEye,
  FaHeart,
  FaRegHeart,
  FaUserCircle
} from 'react-icons/fa';
import { formatViews } from '@/lib/mockVideoData';

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

export default function VideoCard({ video, isPlaying, onPlay, onLike, isLiked, onClick }) {
  const [hovered, setHovered] = useState(false);

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
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Category Emoji */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-5xl transition-all duration-300 ${hovered ? 'opacity-30 scale-110' : 'opacity-50'}`}>
            {getCategoryEmoji(video.category)}
          </span>
        </div>

        {/* Hover overlay — play CTA */}
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 transition-opacity duration-300 ${hovered || isPlaying ? 'opacity-100' : 'opacity-0'}`}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron to-gold text-white flex items-center justify-center shadow-lg"
          >
            {isPlaying ? (
              <FaPause className="w-4 h-4" />
            ) : (
              <FaPlay className="w-4 h-4 ml-0.5" />
            )}
          </motion.button>
          <span className="text-[10px] text-white/80 font-medium">Watch now</span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-medium rounded-full capitalize flex items-center gap-1">
          <span>{getCategoryEmoji(video.category)}</span>
          <span>{video.category}</span>
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] rounded-full flex items-center gap-1">
          <FaClock className="w-2.5 h-2.5" />
          {video.duration}
        </div>

        {/* Featured Badge */}
        {video.featured && (
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
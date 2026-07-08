'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt, FaHeart, FaRegHeart, FaEye } from 'react-icons/fa';
import FestivalCountdown from './FestivalCountdown';

export default function FestivalCard({ festival, onLike, isLiked }) {
  const [hovered, setHovered] = useState(false);

  const featuredImage = festival.featuredImage || festival.image || null;
  const title = festival.title || festival.name || 'Festival';
  const href = festival.slug ? `/festivals/${festival.slug}` : `/festivals/${festival.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative bg-white dark:bg-[#241B14] rounded-xl border border-[#F4B400]/15 dark:border-[#F4B400]/15 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#F4B400]/35 cursor-pointer"
      onClick={() => window.location.href = href}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-[#E8742C]/20 to-[#F4B400]/20">
        {featuredImage ? (
          <img
            src={featuredImage}
            alt={title}
            className="object-cover transition-transform duration-500 group-hover:scale-105 w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {festival.emoji || '🎊'}
          </div>
        )}

        {/* Featured Badge */}
        {festival.featured && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#F4B400] text-[#3D2B1A] text-[9px] font-bold rounded-full shadow-lg">
            ⭐ Featured
          </div>
        )}

        {/* Days Count Badge */}
        {festival.nextDate && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-medium rounded-full">
            {Math.ceil((festival.nextDate - new Date()) / (1000 * 60 * 60 * 24))}d
          </div>
        )}

        {/* Overlay on Hover */}
        <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            className="px-6 py-2.5 bg-gradient-to-r from-[#E8742C] to-[#F4B400] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = href;
            }}
          >
            Explore Festival
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Category & Emoji */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-lg">{festival.emoji || '🎊'}</span>
          <span className="text-[10px] text-[#8C7456] dark:text-[#9C8569] truncate capitalize">
            {festival.category || 'Festival'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-[#3D2B1A] dark:text-[#F5EAD9] group-hover:text-[#E8742C] dark:group-hover:text-[#F4B400] transition-colors line-clamp-1">
          {title}
        </h3>

        {/* Date & Region */}
        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#8C7456] dark:text-[#9C8569]">
          <span className="flex items-center gap-0.5">
            <FaCalendarAlt className="w-2.5 h-2.5 text-[#E8742C] dark:text-[#FFA45C]" />
            {festival.date ? new Date(festival.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}
          </span>
          {festival.region && (
            <span className="flex items-center gap-0.5">
              <FaMapMarkerAlt className="w-2.5 h-2.5 text-[#E8742C] dark:text-[#FFA45C]" />
              {festival.region}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-1.5 text-[9px] text-[#8C7456] dark:text-[#9C8569]">
          <span className="flex items-center gap-0.5">
            <FaEye className="w-2.5 h-2.5" />
            {festival.views || 0}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onLike?.(festival.id);
            }}
            className="flex items-center gap-0.5 hover:text-[#E8742C] transition-colors"
          >
            {isLiked ? (
              <FaHeart className="w-2.5 h-2.5 text-[#C0392B]" />
            ) : (
              <FaRegHeart className="w-2.5 h-2.5" />
            )}
            {festival.likes || 0}
          </button>
        </div>

        {/* Countdown */}
        {festival.nextDate && (
          <div className="mt-2 pt-2 border-t border-[#F4B400]/10">
            <FestivalCountdown targetDate={festival.nextDate.toISOString()} size="sm" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
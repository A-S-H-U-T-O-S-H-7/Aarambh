// components/home/TempleCard.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaMapPin, 
  FaClock, 
  FaStar, 
  FaUsers,
  FaVideo,
  FaHeart,
  FaRegHeart,
  FaBuilding
} from 'react-icons/fa';

export default function TempleCard({ temple, onLike, isLiked }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative bg-white dark:bg-brown-800/80 backdrop-blur-sm rounded-xl border border-gold/20 dark:border-gold/10 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gold/30"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-saffron/20 to-gold/20">
        <Image
          src={temple.image}
          alt={temple.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Live Darshan Badge */}
        {temple.liveDarshan && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-divine-red text-white text-[10px] font-bold rounded-full shadow-lg flex items-center space-x-1 animate-pulse">
            <FaVideo className="w-3 h-3" />
            <span>Live Darshan</span>
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full flex items-center space-x-1">
          <FaStar className="w-3 h-3 text-gold" />
          <span>{temple.rating}</span>
        </div>

        {/* Overlay on Hover */}
        <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <Link
            href={`/temples/${temple.id}`}
            className="px-6 py-2.5 bg-gradient-to-r from-saffron to-gold text-white font-medium rounded-full hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 hover:scale-105"
          >
            Explore Temple
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/temples/${temple.id}`}>
              <h3 className="text-sm font-semibold text-brown-900 dark:text-cream-50 group-hover:text-saffron transition-colors line-clamp-1">
                {temple.name}
              </h3>
            </Link>
            <p className="text-xs text-brown-600 dark:text-cream-50/60 flex items-center space-x-1 mt-0.5">
              <FaMapPin className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">{temple.location}</span>
            </p>
          </div>

          {/* Like Button */}
          <button
            onClick={() => onLike?.(temple.id)}
            className="p-1.5 rounded-full hover:bg-saffron/10 dark:hover:bg-saffron/20 transition-colors flex-shrink-0"
          >
            {isLiked ? (
              <FaHeart className="w-4 h-4 text-divine-red animate-pulse" />
            ) : (
              <FaRegHeart className="w-4 h-4 text-brown-400 dark:text-cream-50/40 hover:text-divine-red transition-colors" />
            )}
          </button>
        </div>

        {/* Deity & Details */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="px-2 py-0.5 bg-saffron/10 text-saffron text-[10px] rounded-full">
            {temple.deity}
          </span>
          <span className="text-[10px] text-brown-500 dark:text-cream-50/40">
            {temple.architecture}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gold/5">
          <div className="flex items-center space-x-2 text-[10px] text-brown-500 dark:text-cream-50/50">
            <FaClock className="w-3 h-3" />
            <span>{temple.timings}</span>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-brown-500 dark:text-cream-50/50">
            <FaUsers className="w-3 h-3" />
            <span className="line-clamp-1">{temple.visitors}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
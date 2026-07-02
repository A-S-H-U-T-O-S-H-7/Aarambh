// components/home/TempleCard.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaMapPin, 
  FaHeart,
  FaRegHeart,
  FaEye,
  FaStar
} from 'react-icons/fa';

export default function TempleCard({ temple, onLike, isLiked }) {
  const [hovered, setHovered] = useState(false);

  const featuredImage = temple.featuredImage || (temple.images && temple.images[0]) || null;
  const title = temple.title || 'Sacred temple';
  const href = temple.slug ? `/temples/${temple.slug}` : '/temples';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative bg-white dark:bg-[#241B14] rounded-xl border border-[#F4B400]/15 dark:border-[#F4B400]/15 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#F4B400]/35"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-[#E8742C]/20 to-[#F4B400]/20">
        {featuredImage ? (
          <img
            src={featuredImage}
            alt={`${title} temple`}
            className="object-cover transition-transform duration-500 group-hover:scale-105 w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🛕</div>
        )}

        {/* Overlay on Hover */}
        <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <Link
            href={href}
            className="px-6 py-2.5 bg-gradient-to-r from-[#E8742C] to-[#F4B400] text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Explore Temple
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={href}>
              <h3 className="text-sm font-semibold text-[#3D2B1A] dark:text-[#F5EAD9] group-hover:text-[#E8742C] dark:group-hover:text-[#F4B400] transition-colors line-clamp-1">
                {title}
              </h3>
            </Link>
            <p className="text-xs text-[#8C7456] dark:text-[#9C8569] flex items-center space-x-1 mt-0.5">
              <FaMapPin className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">{temple.location}</span>
            </p>
          </div>

          {/* Like Button */}
          <button
            onClick={() => onLike?.(temple.id)}
            className="p-1.5 rounded-full hover:bg-[#E8742C]/10 transition-colors flex-shrink-0"
          >
            {isLiked ? (
              <FaHeart className="w-4 h-4 text-[#C0392B] dark:text-[#E8674F]" />
            ) : (
              <FaRegHeart className="w-4 h-4 text-[#C9B89C] dark:text-[#5C4630] hover:text-[#C0392B] transition-colors" />
            )}
          </button>
        </div>

        {/* Deity & Views/Likes */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="px-2 py-0.5 bg-[#E8742C]/10 text-[#C2570F] dark:text-[#FFA45C] text-[10px] rounded-full">
            {temple.deity || 'Sacred'}
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-[#8C7456] dark:text-[#9C8569]">
            <FaEye className="w-3 h-3" />
            {temple.views || 0}
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-[#8C7456] dark:text-[#9C8569]">
            <FaHeart className="w-3 h-3" />
            {temple.likes || 0}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

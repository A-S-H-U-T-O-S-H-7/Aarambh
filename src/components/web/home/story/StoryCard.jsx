// components/home/StoryCard.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaClock, 
  FaHeart, 
  FaRegHeart,
  FaBookOpen,
  FaUser,
  FaTags
} from 'react-icons/fa';

export default function StoryCard({ story, isFeatured = false, onLike, isLiked }) {
  const [hovered, setHovered] = useState(false);

  const getCategoryColor = (category) => {
    const colors = {
      ramayana: 'text-orange-600 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400',
      mahabharata: 'text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400',
      saints: 'text-purple-600 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400',
      parable: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400',
    };
    return colors[category] || 'text-gray-600 bg-gray-50 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      ramayana: '🏹',
      mahabharata: '⚔️',
      saints: '🕉️',
      parable: '💡',
    };
    return emojis[category] || '📖';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`group relative bg-white dark:bg-brown-800/80 backdrop-blur-sm rounded-xl border border-gold/20 dark:border-gold/10 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gold/30 ${
        isFeatured ? 'md:col-span-2' : ''
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-saffron/20 to-gold/20">
        <Image
          src={story.image}
          alt={story.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Category Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(story.category)} shadow-lg`}>
          <span className="flex items-center space-x-1">
            <span>{getCategoryEmoji(story.category)}</span>
            <span className="capitalize">{story.category}</span>
          </span>
        </div>

        {/* Reading Time */}
        <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full flex items-center space-x-1">
          <FaClock className="w-3 h-3" />
          <span>{story.readingTime} min read</span>
        </div>

        {/* Overlay on Hover */}
        <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <Link
            href={`/stories/${story.id}`}
            className="px-6 py-2.5 bg-gradient-to-r from-saffron to-gold text-white font-medium rounded-full hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
          >
            <FaBookOpen className="w-4 h-4" />
            <span>Read Story</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/stories/${story.id}`}>
              <h3 className="text-sm font-semibold text-brown-900 dark:text-cream-50 line-clamp-2 group-hover:text-saffron transition-colors">
                {story.title}
              </h3>
            </Link>
            <p className="text-xs text-brown-600 dark:text-cream-50/60 line-clamp-2 mt-1">
              {story.description}
            </p>
          </div>

          {/* Like Button */}
          <button
            onClick={() => onLike?.(story.id)}
            className="p-1.5 rounded-full hover:bg-saffron/10 dark:hover:bg-saffron/20 transition-colors flex-shrink-0"
          >
            {isLiked ? (
              <FaHeart className="w-4 h-4 text-divine-red animate-pulse" />
            ) : (
              <FaRegHeart className="w-4 h-4 text-brown-400 dark:text-cream-50/40 hover:text-divine-red transition-colors" />
            )}
          </button>
        </div>

        {/* Author and Tags */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gold/5">
          <div className="flex items-center space-x-2 text-[10px] text-brown-500 dark:text-cream-50/50">
            <FaUser className="w-3 h-3" />
            <span>{story.author}</span>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-brown-500 dark:text-cream-50/50">
            <FaTags className="w-3 h-3" />
            <span className="line-clamp-1">{story.tags.slice(0, 2).join(' · ')}</span>
          </div>
        </div>

        {/* Moral Preview */}
        {story.moral && (
          <div className="mt-2 p-2 bg-gold/5 dark:bg-gold/10 rounded-lg border border-gold/10">
            <p className="text-[10px] text-gold font-medium">✨ Moral</p>
            <p className="text-[10px] text-brown-600 dark:text-cream-50/60 line-clamp-1">
              {story.moral}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
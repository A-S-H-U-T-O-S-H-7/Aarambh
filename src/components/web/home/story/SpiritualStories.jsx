// components/home/SpiritualStories.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaArrowRight,
  FaBookOpen,
  FaFire,
  FaHeart,
  FaRegHeart,
  FaClock,
  FaUser,
  FaArrowLeft,
} from 'react-icons/fa';
import { GiLotus } from 'react-icons/gi';
import StoryFeaturedCarousel from './StoryFeaturedCarousel';
import StoryCard from './StoryCard';
import {
  getFeaturedStories,
  stories,
} from '@/lib/mockStoryData';

// Compact sidebar card — horizontal layout
function SideStoryCard({ story, onLike, isLiked, index }) {
  const getCategoryColor = (category) => {
    const colors = {
      ramayana: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40',
      mahabharata: 'text-red-500 bg-red-50 dark:bg-red-950/40',
      saints: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40',
      parable: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
    };
    return colors[category] || 'text-gold bg-gold/10';
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
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="group flex gap-3 p-3 rounded-xl bg-white dark:bg-brown-800/70 border border-gold/15 dark:border-gold/10 hover:border-gold/40 hover:shadow-md hover:shadow-gold/10 transition-all duration-300"
    >
      {/* Thumbnail */}
      <Link href={`/stories/${story.id}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-saffron/20 to-gold/20">
          <Image
            src={story.image}
            alt={story.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Category */}
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1 ${getCategoryColor(story.category)}`}>
            <span>{getCategoryEmoji(story.category)}</span>
            <span className="capitalize">{story.category}</span>
          </span>

          {/* Title */}
          <Link href={`/stories/${story.id}`}>
            <h4 className="text-xs font-semibold text-brown-900 dark:text-cream-50 line-clamp-2 leading-snug group-hover:text-saffron transition-colors">
              {story.title}
            </h4>
          </Link>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1.5 text-[10px] text-brown-400 dark:text-cream-50/40">
            <FaClock className="w-2.5 h-2.5" />
            <span>{story.readingTime} min</span>
            <span className="opacity-40">·</span>
            <FaUser className="w-2.5 h-2.5" />
            <span className="truncate max-w-[60px]">{story.author}</span>
          </div>
          <button
            onClick={() => onLike?.(story.id)}
            className="p-1 rounded-full hover:bg-saffron/10 transition-colors"
          >
            {isLiked ? (
              <FaHeart className="w-3 h-3 text-divine-red" />
            ) : (
              <FaRegHeart className="w-3 h-3 text-brown-300 dark:text-cream-50/30 hover:text-divine-red transition-colors" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function SpiritualStories() {
  const [likedStories, setLikedStories] = useState([]);

  const featuredStories = getFeaturedStories();
  // Sidebar shows up to 4 non-featured stories
  const sidebarStories = stories.filter((s) => !s.featured).slice(0, 4);

  const handleLike = (id) => {
    setLikedStories((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };
  const isLiked = (id) => likedStories.includes(id);

  return (
    <section className="py-6 md:py-8 relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/60 to-yellow-50 dark:from-brown-900/30 dark:via-brown-900 dark:to-brown-900/30">
      {/* Light mode: layered radial colour washes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden dark:hidden">
        <div className="absolute -top-32 -left-20 w-[500px] h-[500px] bg-gradient-radial from-amber-200/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-[420px] h-[420px] bg-gradient-radial from-orange-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-radial from-yellow-100/60 to-transparent rounded-full blur-2xl" />
      </div>
      {/* Dark mode blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden dark:block">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-saffron/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-10"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-brown-800/80 backdrop-blur-sm rounded-full border border-gold/20 shadow-sm mb-3">
            <GiLotus className="w-4 h-4 text-saffron" />
            <span className="text-xs font-semibold tracking-wide text-brown-600 dark:text-cream-50/70 uppercase">
              Ancient Wisdom
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl  font-bold text-brown-900 dark:text-cream-50 leading-tight">
            Spiritual{' '}
            <span className="bg-gradient-to-r from-saffron via-gold to-amber-400 bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="mt-2 text-sm text-brown-500 dark:text-cream-50/50 max-w-md mx-auto">
            Timeless tales from sacred scriptures, saints & living traditions.
          </p>

          {/* <Link
            href="/stories"
            className="group mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/30 text-sm font-medium text-brown-700 dark:text-cream-50/80 hover:bg-gradient-to-r hover:from-saffron hover:to-gold hover:text-white hover:border-transparent transition-all duration-300"
          >
            View all stories
            <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link> */}
        </motion.div>

        {/* ── Main Split Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 xl:gap-8 items-start">

          {/* LEFT — Featured Carousel (≈60%) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            {/* Sub-label */}
            <div className="flex items-center gap-2 mb-3">
              <FaFire className="w-4 h-4 text-divine-red" />
              <span className="text-sm font-semibold text-brown-800 dark:text-cream-50">
                Featured Stories
              </span>
              <span className="ml-1 text-[11px] bg-white dark:bg-brown-800 border border-gold/15 text-brown-400 dark:text-cream-50/40 px-2 py-0.5 rounded-full">
                {featuredStories.length} featured
              </span>
            </div>

            <StoryFeaturedCarousel stories={featuredStories} />
          </motion.div>

          {/* RIGHT — Side Story Cards (≈40%) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="w-full lg:w-[340px] xl:w-[380px] flex-shrink-0"
          >
            {/* Sub-label */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaBookOpen className="w-4 h-4 text-gold" />
                <span className="text-sm font-semibold text-brown-800 dark:text-cream-50">
                  More Stories
                </span>
              </div>
              <Link
                href="/stories"
                className="text-[11px] text-gold hover:text-saffron font-medium transition-colors"
              >
                See all →
              </Link>
            </div>

            {/* Stacked cards */}
            <div className="flex flex-col gap-3">
              {sidebarStories.map((story, idx) => (
                <SideStoryCard
                  key={story.id}
                  story={story}
                  index={idx}
                  onLike={handleLike}
                  isLiked={isLiked(story.id)}
                />
              ))}
            </div>

            {/* Divider + CTA */}
            <div className="mt-5 pt-4 border-t border-gold/10 dark:border-gold/10">
              <Link
                href="/stories"
                className="group w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-saffron/10 to-gold/10 hover:from-saffron hover:to-gold border border-gold/20 hover:border-transparent text-sm font-medium text-brown-700 dark:text-cream-50 hover:text-white transition-all duration-300"
              >
                <span>View all stories</span>
                <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
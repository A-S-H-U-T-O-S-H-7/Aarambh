// components/home/StoryFeaturedCarousel.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaArrowLeft, 
  FaArrowRight,
  FaClock,
  FaBookOpen,
  FaUser
} from 'react-icons/fa';

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function StoryFeaturedCarousel({ stories }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  // Auto-scroll
  useEffect(() => {
    if (!isPaused && stories.length > 1) {
      timerRef.current = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(timerRef.current);
  }, [isPaused, stories.length]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (stories.length === 0) return null;

  const story = stories[currentIndex];

  return (
    <div 
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brown-800 to-brown-900 shadow-xl border border-gold/20"
        >
          {/* Image */}
          <div className="relative w-full h-[300px] md:h-[380px] lg:h-[420px]">
            <Image
              src={story.image}
              alt={story.title}
              fill
              className="object-cover"
              priority
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center p-6 md:p-8 lg:p-10">
            <div className="max-w-2xl">
              {/* Category Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 text-xs text-white mb-3">
                <span>📖</span>
                <span className="capitalize">{story.category}</span>
                <span className="text-white/40">•</span>
                <span className="text-white/60">{story.readingTime} min read</span>
              </div>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 line-clamp-2">
                {story.title}
              </h3>
              
              {/* Description */}
              <p className="text-white/70 text-sm max-w-xl mb-4 line-clamp-2">
                {story.description}
              </p>
              
              {/* Author & Source */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-white/60 mb-4">
                {story.author ? (
                  <div className="flex items-center space-x-2">
                    <FaUser className="w-3 h-3" />
                    <span>{story.author}</span>
                  </div>
                ) : null}
                {story.source ? (
                  <span className="text-white/50">• {story.source}</span>
                ) : null}
              </div>

              {/* Read Button */}
              <Link
                href={`/stories/${story.slug || slugify(story.title) || story.id}`}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-saffron to-gold text-white font-medium rounded-full hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 hover:scale-105"
              >
                <FaBookOpen className="w-4 h-4" />
                <span>Read Story</span>
              </Link>
            </div>
          </div>

          {/* Navigation Arrows */}
          {stories.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <FaArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <FaArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {stories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? 'w-8 bg-gold' 
                : 'w-1.5 bg-gold/30 hover:bg-gold/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
// components/home/VideoTrendingCarousel.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaPlay, 
  FaClock, 
  FaEye,
  FaHeart,
  FaRegHeart,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';
import { formatViews } from '@/lib/mockVideoData';

export default function VideoTrendingCarousel({ videos, onLike, isLiked }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  const timerRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  // Auto-scroll
  useEffect(() => {
    if (!isPaused && videos.length > 1) {
      timerRef.current = setInterval(nextSlide, 4000);
    }
    return () => clearInterval(timerRef.current);
  }, [isPaused, videos.length]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (videos.length === 0) return null;

  const video = videos[currentIndex];

  return (
    <div 
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={carouselRef}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brown-800 to-brown-900 shadow-xl border border-gold/20"
        >
          {/* Video Thumbnail */}
          <div className="relative w-full h-[280px] md:h-[320px] lg:h-[380px]">
            <Image
              src={video.thumbnail}
              alt={video.title}
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
                <span>🔥</span>
                <span className="capitalize">{video.category}</span>
                <span className="text-white/40">•</span>
                <span className="text-white/60">{video.duration}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 line-clamp-2">
                {video.title}
              </h3>
              
              {/* Description */}
              <p className="text-white/70 text-sm max-w-xl mb-4 line-clamp-2">
                {video.description}
              </p>
              
              {/* Speaker and Stats */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm text-white/60">
                  {video.speaker}
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center space-x-1 text-sm text-white/60">
                  <FaEye className="w-3 h-3" />
                  <span>{formatViews(video.views)}</span>
                </span>
                <button
                  onClick={() => onLike?.(video.id)}
                  className="flex items-center space-x-1 text-sm text-white/60 hover:text-divine-red transition-colors"
                >
                  {isLiked(video.id) ? (
                    <FaHeart className="w-4 h-4 text-divine-red" />
                  ) : (
                    <FaRegHeart className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Play Button */}
              <Link
                href={`/spiritual-videos/${video.id}`}
                className="inline-flex items-center space-x-2 mt-4 px-6 py-2.5 bg-gradient-to-r from-saffron to-gold text-white font-medium rounded-full hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 hover:scale-105"
              >
                <FaPlay className="w-4 h-4" />
                <span>Watch Now</span>
              </Link>
            </div>
          </div>

          {/* Navigation Arrows */}
          {videos.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <FaArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <FaArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {videos.map((_, idx) => (
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
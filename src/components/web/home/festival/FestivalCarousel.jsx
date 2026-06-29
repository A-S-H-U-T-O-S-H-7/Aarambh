// components/home/FestivalCarousel.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { GiSparkles } from 'react-icons/gi';
import FestivalCountdown from './FestivalCountdown';

export default function FestivalCarousel({ festivals }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % festivals.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + festivals.length) % festivals.length);

  useEffect(() => {
    if (!isPaused && festivals.length > 1) {
      timerRef.current = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(timerRef.current);
  }, [isPaused, festivals.length]);

  if (festivals.length === 0) return null;

  const festival = festivals[currentIndex];

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Glow ring, consistent with other cards on the site */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E8742C]/20 to-[#F4B400]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden bg-white dark:bg-[#241B14] shadow-xl dark:shadow-black/50 border border-[#F4B400]/20 dark:border-[#F4B400]/20"
        >
          {/* Image */}
          <div className="relative w-full h-[280px] sm:h-[340px] lg:h-[400px]">
            <Image
              src={festival.image}
              alt={festival.imageAlt || festival.name}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlays — tuned separately for light vs dark so text stays legible */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/55 to-transparent dark:from-[#1A130E]/95 dark:via-[#1A130E]/60 dark:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-transparent to-transparent dark:from-[#1A130E]/75 dark:via-transparent dark:to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center p-5 sm:p-7 lg:p-9">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 dark:bg-[#2A2018]/90 backdrop-blur-sm rounded-full border border-[#F4B400]/25 text-[11px] sm:text-xs font-medium text-[#5C4630] dark:text-[#F0E4D3] mb-3">
                <GiSparkles className="w-3 h-3 text-[#D98C1F] dark:text-[#F4B400]" />
                <span>Featured Festival</span>
              </div>

              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-2xl sm:text-3xl lg:text-4xl">{festival.emoji}</span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#3D2B1A] dark:text-[#F5EAD9]">
                  {festival.name}
                </h3>
              </div>

              <p className="text-[#5C4630] dark:text-[#D9C7AC] text-sm max-w-xl mb-3 line-clamp-2">
                {festival.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-1 bg-white/85 dark:bg-[#2A2018]/85 backdrop-blur-sm rounded-full text-[11px] text-[#5C4630] dark:text-[#D9C7AC] border border-[#F4B400]/15">
                  <FaCalendarAlt className="w-3 h-3 mr-1 text-[#E8742C] dark:text-[#FFA45C]" />
                  {new Date(festival.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 bg-white/85 dark:bg-[#2A2018]/85 backdrop-blur-sm rounded-full text-[11px] text-[#5C4630] dark:text-[#D9C7AC] border border-[#F4B400]/15">
                  <FaMapMarkerAlt className="w-3 h-3 mr-1 text-[#E8742C] dark:text-[#FFA45C]" />
                  {festival.region}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 bg-white/85 dark:bg-[#2A2018]/85 backdrop-blur-sm rounded-full text-[11px] text-[#5C4630] dark:text-[#D9C7AC] border border-[#F4B400]/15">
                  {festival.category}
                </span>
              </div>

              <div className="bg-white/90 dark:bg-[#2A2018]/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-[#F4B400]/25 inline-block">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#8C7456] dark:text-[#9C8569] mb-1">
                  Countdown to {festival.name}
                </p>
                <FestivalCountdown targetDate={festival.date} />
              </div>
            </div>
          </div>

          {festivals.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 dark:bg-[#2A2018]/85 hover:bg-white dark:hover:bg-[#2A2018] shadow-lg text-[#5C4630] dark:text-[#F0E4D3] hover:text-[#E8742C] dark:hover:text-[#F4B400] transition-all opacity-0 group-hover:opacity-100"
              >
                <FaArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 dark:bg-[#2A2018]/85 hover:bg-white dark:hover:bg-[#2A2018] shadow-lg text-[#5C4630] dark:text-[#F0E4D3] hover:text-[#E8742C] dark:hover:text-[#F4B400] transition-all opacity-0 group-hover:opacity-100"
              >
                <FaArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex space-x-1 flex-1">
          {festivals.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all duration-500 flex-1 ${
                idx === currentIndex ? 'bg-[#F4B400]' : 'bg-[#F4B400]/20 hover:bg-[#F4B400]/40'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-[#8C7456] dark:text-[#9C8569] ml-3 font-medium">
          {currentIndex + 1} / {festivals.length}
        </span>
      </div>
    </div>
  );
}
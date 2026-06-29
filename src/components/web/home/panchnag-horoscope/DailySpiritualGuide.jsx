'use client';

import { motion } from 'framer-motion';
import { GiLotus } from 'react-icons/gi';
import PanchangSection from './PanchangSection';
import HoroscopeSection from './HoroscopeSection';
import { mockPanchang, mockHoroscope } from '@/lib/mockAstroData';
import DailyWisdom from './DailyWisdom';

export default function DailySpiritualGuide() {
  return (
    <section className="py-6 lg:py-8 relative overflow-hidden bg-[#FBF3E7] dark:bg-[#15100C]">
      {/* Layered background mesh */}
      <div
        className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity"
        style={{
          backgroundImage: `
            radial-gradient(circle at 12% 20%, rgba(232,116,44,0.16) 0%, transparent 45%),
            radial-gradient(circle at 88% 15%, rgba(244,180,0,0.18) 0%, transparent 50%),
            radial-gradient(circle at 50% 90%, rgba(192,57,43,0.10) 0%, transparent 55%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity"
        style={{
          backgroundImage: `
            radial-gradient(circle at 12% 20%, rgba(232,116,44,0.22) 0%, transparent 45%),
            radial-gradient(circle at 88% 15%, rgba(244,180,0,0.20) 0%, transparent 50%),
            radial-gradient(circle at 50% 90%, rgba(192,57,43,0.16) 0%, transparent 55%)
          `,
        }}
      />

      {/* Floating Om Symbols */}
      <div className="absolute top-20 right-20 text-[#E8742C]/10 dark:text-[#F4B400]/[0.08] text-8xl font-serif hidden lg:block">
        ॐ
      </div>
      <div className="absolute bottom-20 left-20 text-[#F4B400]/10 dark:text-[#E8742C]/[0.08] text-7xl font-serif hidden lg:block">
        ॐ
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-[#2A2018]/90 backdrop-blur-sm rounded-full border border-[#F4B400]/25 dark:border-[#F4B400]/20 shadow-sm mb-4">
            <GiLotus className="w-4 h-4 text-[#D98C1F] dark:text-[#F4B400]" />
            <span className="text-xs sm:text-sm font-medium text-[#5C4630] dark:text-[#F0E4D3]">
              Begin Your Day with Divine Wisdom
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl  font-bold text-[#3D2B1A] dark:text-[#F5EAD9]">
            Daily Spiritual
            <span className="bg-gradient-to-r from-[#E8742C] to-[#F4B400] bg-clip-text text-transparent"> Guide</span>
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#E8742C] to-[#F4B400] rounded-full mx-auto mt-4" />
          <p className="mt-4 text-sm sm:text-base text-[#6B5640] dark:text-[#CBB89E] max-w-2xl mx-auto px-2">
            Start your day with cosmic guidance and divine wisdom. Check your daily panchang and horoscope.
          </p>
        </motion.div>

        {/* Grid: Panchang (with Wisdom underneath) + Horoscope */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
          {/* Left Column - Panchang + Wisdom */}
          <div className="flex flex-col gap-5 md:gap-6">
            <PanchangSection data={mockPanchang} />
            <DailyWisdom />
          </div>
          
          {/* Right Column - Horoscope */}
          <HoroscopeSection data={mockHoroscope} />
        </div>
      </div>
    </section>
  );
}
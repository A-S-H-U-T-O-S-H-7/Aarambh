// components/home/FestivalHub.jsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight, FaClock, FaStar } from 'react-icons/fa';
import { GiSparkles } from 'react-icons/gi';
import FestivalCarousel from './FestivalCarousel';
import FestivalTimelineCard from './FestivalTimelineCard';
import { getFeaturedFestivals, getUpcomingFestivals } from '@/lib/mockFestivalData';

export default function FestivalHub() {
  const featuredFestivals = getFeaturedFestivals();
  const upcomingFestivals = getUpcomingFestivals();

  return (
    <section className="py-6 md:py-8 relative overflow-hidden bg-[#FBF3E7] dark:bg-[#15100C]">
      {/* Layered gradient mesh — same system used across the site so sections feel like one family */}
      <div
        className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity"
        style={{
          backgroundImage: `
            radial-gradient(circle at 85% 10%, rgba(244,180,0,0.16) 0%, transparent 45%),
            radial-gradient(circle at 10% 30%, rgba(232,116,44,0.14) 0%, transparent 50%),
            radial-gradient(circle at 50% 95%, rgba(192,57,43,0.08) 0%, transparent 55%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity"
        style={{
          backgroundImage: `
            radial-gradient(circle at 85% 10%, rgba(244,180,0,0.20) 0%, transparent 45%),
            radial-gradient(circle at 10% 30%, rgba(232,116,44,0.20) 0%, transparent 50%),
            radial-gradient(circle at 50% 95%, rgba(192,57,43,0.14) 0%, transparent 55%)
          `,
        }}
      />

      {/* Subtle confetti accents — kept but dimmed so they don't fight with content */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-3xl opacity-[0.07] dark:opacity-[0.06]">🎊</div>
        <div className="absolute top-20 right-20 text-2xl opacity-[0.07] dark:opacity-[0.06]">🎉</div>
        <div className="absolute bottom-20 left-20 text-4xl opacity-[0.07] dark:opacity-[0.06]">✨</div>
        <div className="absolute bottom-10 right-10 text-3xl opacity-[0.07] dark:opacity-[0.06]">🌟</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-2 md:mb-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-[#2A2018]/90 backdrop-blur-sm rounded-full border border-[#F4B400]/25 dark:border-[#F4B400]/20 shadow-sm mb-4">
            <GiSparkles className="w-4 h-4 text-[#D98C1F] dark:text-[#F4B400]" />
            <span className="text-xs sm:text-sm font-medium text-[#5C4630] dark:text-[#F0E4D3]">
              Upcoming Celebrations
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold text-[#3D2B1A] dark:text-[#F5EAD9]">
            Festival
            <span className="bg-gradient-to-r from-[#E8742C] to-[#F4B400] bg-clip-text text-transparent"> Hub</span>
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#E8742C] to-[#F4B400] rounded-full mx-auto mt-4" />
          <p className="mt-4 text-sm sm:text-base text-[#6B5640] dark:text-[#CBB89E] max-w-2xl mx-auto px-2">
            Discover upcoming festivals, countdown to celebrations, and embrace the divine spirit of Indian traditions.
          </p>
        </motion.div>

        {/* Featured Festivals Carousel */}
        {featuredFestivals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mb-8 sm:mb-10"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-[#3D2B1A] dark:text-[#F5EAD9] flex items-center gap-2">
                <FaStar className="w-4 h-4 text-[#D98C1F] dark:text-[#F4B400]" />
                <span>Featured Festivals</span>
              </h3>
              <span className="text-[11px] sm:text-xs text-[#8C7456] dark:text-[#9C8569] bg-white/80 dark:bg-[#241B14]/80 px-3 py-1 rounded-full border border-[#F4B400]/15">
                {featuredFestivals.length} celebrations
              </span>
            </div>
            <FestivalCarousel festivals={featuredFestivals} />
          </motion.div>
        )}

        {/* Upcoming Festivals Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-[#3D2B1A] dark:text-[#F5EAD9] flex items-center gap-2">
              <FaClock className="w-4 h-4 text-[#C2570F] dark:text-[#FFA45C]" />
              <span>Upcoming Festivals</span>
            </h3>
            <span className="text-[11px] sm:text-xs text-[#8C7456] dark:text-[#9C8569] bg-white/80 dark:bg-[#241B14]/80 px-3 py-1 rounded-full border border-[#F4B400]/15">
              {upcomingFestivals.length} festivals ahead
            </span>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {upcomingFestivals.slice(0, 5).map((festival, index) => (
              <FestivalTimelineCard key={festival.id} festival={festival} index={index} />
            ))}
          </div>

          {upcomingFestivals.length > 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-6 sm:mt-8"
            >
              <Link
                href="/festivals"
                className="inline-flex items-center px-6 py-2.5 text-white font-medium rounded-full transition-all duration-300 hover:scale-105 text-sm group shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #E85D04, #F4B400)',
                  boxShadow: '0 4px 20px rgba(244,180,0,0.3)',
                }}
              >
                View all {upcomingFestivals.length} festivals
                <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
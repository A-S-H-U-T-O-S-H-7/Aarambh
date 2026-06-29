// components/home/FestivalTimelineCard.jsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import FestivalCountdown from './FestivalCountdown';

export default function FestivalTimelineCard({ festival, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="group relative"
    >
      {index !== 0 && (
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#F4B400]/30 to-transparent" />
      )}

      <div className="flex items-start gap-3 sm:gap-4">
        {/* Timeline Dot */}
        <div className="relative z-10 flex-shrink-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#E8742C]/20 to-[#F4B400]/20 dark:from-[#E8742C]/30 dark:to-[#F4B400]/30 border-2 border-[#F4B400] flex items-center justify-center text-xl sm:text-2xl shadow-lg">
            {festival.emoji}
          </div>
        </div>

        {/* Card */}
        <div className="flex-1 bg-white dark:bg-[#241B14] rounded-xl border border-[#F4B400]/15 dark:border-[#F4B400]/15 p-3 sm:p-4 hover:shadow-lg dark:hover:shadow-black/40 transition-all duration-300 group-hover:border-[#F4B400]/35 min-w-0">
          <div className="flex flex-wrap items-start gap-3 sm:gap-4">
            {/* Thumbnail */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={festival.image} alt={festival.name} fill className="object-cover" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-[180px]">
              <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
                <div className="min-w-0">
                  <div className="flex items-center flex-wrap gap-1.5">
                    <h4 className="text-sm sm:text-base font-semibold text-[#3D2B1A] dark:text-[#F5EAD9]">
                      {festival.name}
                    </h4>
                    <span className="text-[11px] sm:text-xs text-[#8C7456] dark:text-[#9C8569]">
                      {festival.nameHindi}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs text-[#6B5640] dark:text-[#B8A088] line-clamp-1 mt-0.5">
                    {festival.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5">
                    <span className="inline-flex items-center text-[10px] text-[#8C7456] dark:text-[#9C8569]">
                      <FaCalendarAlt className="w-2.5 h-2.5 mr-1 text-[#E8742C] dark:text-[#FFA45C]" />
                      {new Date(festival.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="inline-flex items-center text-[10px] text-[#8C7456] dark:text-[#9C8569]">
                      <FaMapMarkerAlt className="w-2.5 h-2.5 mr-1 text-[#E8742C] dark:text-[#FFA45C]" />
                      {festival.region}
                    </span>
                    <span className="px-2 py-0.5 bg-[#E8742C]/10 dark:bg-[#E8742C]/20 rounded-full text-[10px] text-[#C2570F] dark:text-[#FFA45C]">
                      {festival.category}
                    </span>
                  </div>
                </div>

                {/* Countdown */}
                <div className="bg-[#FBF3E7] dark:bg-[#1A130E] rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 border border-[#F4B400]/15 shrink-0">
                  <FestivalCountdown targetDate={festival.date} size="sm" />
                </div>
              </div>

              {/* Traditions Tags */}
              <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-[#F4B400]/10">
                {festival.traditions.slice(0, 3).map((tradition, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-[#FBF3E7] dark:bg-[#1A130E] rounded text-[8px] text-[#8C7456] dark:text-[#9C8569] border border-[#F4B400]/10"
                  >
                    {tradition}
                  </span>
                ))}
                {festival.traditions.length > 3 && (
                  <span className="px-2 py-0.5 text-[8px] text-[#8C7456] dark:text-[#9C8569]">
                    +{festival.traditions.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
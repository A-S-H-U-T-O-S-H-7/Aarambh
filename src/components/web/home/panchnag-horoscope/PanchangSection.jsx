// components/home/PanchangSection.jsx
'use client';

import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaHeart, FaOm } from 'react-icons/fa';
import { GiSunrise, GiSunset, GiSparkles, GiHadesSymbol } from 'react-icons/gi';


export default function PanchangSection({ data, language = 'en' }) {
  const panchangItems = [
    { icon: FaCalendarAlt, label: 'Tithi', value: data.tithi, sub: data.tithiDetails },
    { icon: GiHadesSymbol, label: 'Nakshatra', value: data.nakshatra, sub: data.nakshatraDetails },
    { icon: GiSunrise, label: 'Sunrise', value: data.sunrise },
    { icon: GiSunset, label: 'Sunset', value: data.sunset },
    { icon: FaClock, label: 'Rahu Kaal', value: data.rahuKaal },
    { icon: GiSparkles, label: 'Abhijit Muhurat', value: data.abhijitMuhurat },
  ];

  // 3 brand-tied tones, cycled — gold, terracotta, muted rose. Cohesive instead of rainbow.
  const tones = [
    {
      bg: 'from-[#F4B400]/14 to-[#F4B400]/6 dark:from-[#F4B400]/28 dark:to-[#F4B400]/12',
      border: 'border-[#F4B400]/25 dark:border-[#F4B400]/25',
      icon: 'text-[#B8860B] dark:text-[#FFD66B]',
      iconBg: 'bg-white/70 dark:bg-[#1A130E]/60',
    },
    {
      bg: 'from-[#E8742C]/14 to-[#E8742C]/6 dark:from-[#E8742C]/28 dark:to-[#E8742C]/12',
      border: 'border-[#E8742C]/25 dark:border-[#E8742C]/25',
      icon: 'text-[#C2570F] dark:text-[#FFA45C]',
      iconBg: 'bg-white/70 dark:bg-[#1A130E]/60',
    },
    {
      bg: 'from-[#C0392B]/12 to-[#C0392B]/5 dark:from-[#C0392B]/24 dark:to-[#C0392B]/10',
      border: 'border-[#C0392B]/20 dark:border-[#C0392B]/25',
      icon: 'text-[#A53125] dark:text-[#F08C7D]',
      iconBg: 'bg-white/70 dark:bg-[#1A130E]/60',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative group"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E8742C]/25 to-[#F4B400]/25 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Main Card — clearly elevated above the section bg in both modes */}
      <div className="relative bg-white dark:bg-[#241B14] backdrop-blur-sm rounded-2xl border border-[#F4B400]/20 dark:border-[#F4B400]/20 shadow-xl dark:shadow-black/50 overflow-hidden">
        {/* Decorative Top Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8742C] via-[#F4B400] to-[#E8742C]" />

        {/* Header */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-[#F4B400]/10 dark:border-[#F4B400]/10">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
              <div className="p-2 bg-gradient-to-br from-[#E8742C]/15 to-[#F4B400]/15 dark:from-[#E8742C]/25 dark:to-[#F4B400]/25 rounded-xl shrink-0">
                <FaOm className="w-5 h-5 sm:w-6 sm:h-6 text-[#D9651A] dark:text-[#F4B400]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-bold text-[#3D2B1A] dark:text-[#F5EAD9] truncate">
                  Daily Panchang
                </h2>
                <p className="text-[11px] sm:text-xs text-[#80694F] dark:text-[#B8A088] truncate">
                  {data.date}
                </p>
              </div>
            </div>
            {data.specialEvent && (
              <div className="px-2.5 py-1 bg-gradient-to-r from-[#C0392B]/15 to-[#F4B400]/15 dark:from-[#C0392B]/25 dark:to-[#F4B400]/25 rounded-full border border-[#F4B400]/20 shrink-0">
                <span className="text-[10px] sm:text-xs font-medium text-[#C0392B] dark:text-[#F4B400] whitespace-nowrap">
                  {data.specialEvent}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Grid Content — tighter padding/gap on mobile, no truncation/cropping */}
        <div className="p-3 sm:p-6 grid grid-cols-2 gap-2 sm:gap-4">
          {panchangItems.map((item, index) => {
            const tone = tones[index % tones.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl bg-gradient-to-br ${tone.bg} border ${tone.border} transition-all duration-300 group/item min-w-0`}
              >
                <div className={`p-1.5 rounded-lg ${tone.iconBg} shrink-0`}>
                  <item.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${tone.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#8C7456] dark:text-[#9C8569] font-medium">
                    {item.label}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-[#3D2B1A] dark:text-[#F0E4D3] break-words leading-snug">
                    {item.value}
                  </p>
                  {item.sub && (
                    <p className="text-[9px] sm:text-[10px] text-[#8C7456] dark:text-[#9C8569] break-words leading-snug">
                      {item.sub}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer - Mantra of the Day */}
        <div className="px-3 sm:px-6 pb-4 sm:pb-6 pt-1 sm:pt-2">
          <div className="p-2.5 sm:p-3 bg-gradient-to-r from-[#E8742C]/8 to-[#F4B400]/8 dark:from-[#E8742C]/16 dark:to-[#F4B400]/16 rounded-xl border border-[#F4B400]/10">
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <div className="p-1.5 rounded-full bg-[#C0392B]/10 dark:bg-[#C0392B]/20 shrink-0">
                <FaHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C0392B] dark:text-[#E8674F]" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#8C7456] dark:text-[#9C8569]">
                  Mantra of the Day
                </p>
                <p className="text-xs sm:text-sm font-serif text-[#B8860B] dark:text-[#F4B400] font-medium">
                  ॐ नमः शिवाय
                </p>
              </div>
            </div>
          </div>
        </div>
        

      </div>
    </motion.div>
  );
}
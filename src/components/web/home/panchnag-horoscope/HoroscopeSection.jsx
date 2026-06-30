// components/home/HoroscopeSection.jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaUserFriends, FaSmile } from 'react-icons/fa';
import { zodiacSigns } from '@/lib/mockAstroData';

// Zodiac grouped by classical element, each tied to a brand-cohesive tone
// instead of a full rainbow — fire/earth/air/water still read as distinct,
// but everything stays inside the warm gold/terracotta/rose family.
const ELEMENT_TONE = {
  aries: 'fire', leo: 'fire', sagittarius: 'fire',
  taurus: 'earth', virgo: 'earth', capricorn: 'earth',
  gemini: 'air', libra: 'air', aquarius: 'air',
  cancer: 'water', scorpio: 'water', pisces: 'water',
};

const TONES = {
  fire: {
    selected: 'from-[#E8742C]/22 to-[#E8742C]/10 dark:from-[#E8742C]/35 dark:to-[#E8742C]/18 border-[#E8742C]',
    text: 'text-[#C2570F] dark:text-[#FFA45C]',
  },
  earth: {
    selected: 'from-[#9C7A2E]/22 to-[#9C7A2E]/10 dark:from-[#9C7A2E]/35 dark:to-[#9C7A2E]/18 border-[#9C7A2E]',
    text: 'text-[#7A5F22] dark:text-[#D9B86A]',
  },
  air: {
    selected: 'from-[#F4B400]/22 to-[#F4B400]/10 dark:from-[#F4B400]/35 dark:to-[#F4B400]/18 border-[#F4B400]',
    text: 'text-[#B8860B] dark:text-[#FFD66B]',
  },
  water: {
    selected: 'from-[#C0392B]/18 to-[#C0392B]/8 dark:from-[#C0392B]/32 dark:to-[#C0392B]/16 border-[#C0392B]',
    text: 'text-[#A53125] dark:text-[#F08C7D]',
  },
};

export default function HoroscopeSection({ data, language = 'en', onLanguageChange }) {
  const [selectedSign, setSelectedSign] = useState('aries');

  const selectedData = data?.[selectedSign] || data?.aries || {};
  const signInfo = zodiacSigns.find((s) => s.id === selectedSign);
  const selectedColor = selectedData?.color || selectedData?.luckyColor || '#D98C1F';
  const selectedLuckyNumber = selectedData?.luckyNumber || selectedData?.number || '—';
  const selectedMood = selectedData?.mood || 'Balanced';
  const selectedCompatibility = selectedData?.compatibility || '—';

  const getZodiacEmoji = (id) => {
    const emojis = {
      aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
      leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
      sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
    };
    return emojis[id] || '⭐';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative group h-full"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E8742C]/25 to-[#F4B400]/25 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Main Card */}
      <div className="relative bg-white dark:bg-[#241B14] backdrop-blur-sm rounded-2xl border border-[#F4B400]/20 dark:border-[#F4B400]/20 shadow-xl dark:shadow-black/50 overflow-hidden h-full flex flex-col">
        {/* Decorative Top Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8742C] via-[#F4B400] to-[#E8742C]" />

        {/* Header */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-[#F4B400]/10 dark:border-[#F4B400]/10">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
              <div className="p-2 bg-gradient-to-br from-[#E8742C]/15 to-[#F4B400]/15 dark:from-[#E8742C]/25 dark:to-[#F4B400]/25 rounded-xl shrink-0">
                <FaStar className="w-5 h-5 sm:w-6 sm:h-6 text-[#D98C1F] dark:text-[#F4B400]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-bold text-[#3D2B1A] dark:text-[#F5EAD9] truncate">
                  Daily Horoscope
                </h2>
                <p className="text-[11px] sm:text-xs text-[#80694F] dark:text-[#B8A088] truncate">
                  Your cosmic guidance for today
                </p>
              </div>
            </div>

            <select
              value={language}
              onChange={(e) => onLanguageChange?.(e.target.value)}
              className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-[#FBF3E7] dark:bg-[#1A130E] border border-[#F4B400]/20 rounded-lg focus:outline-none focus:border-[#E8742C] text-[#3D2B1A] dark:text-[#F0E4D3] shrink-0"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
        </div>

        {/* Zodiac Grid */}
        <div className="px-3 sm:px-6 pt-3 sm:pt-4">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {zodiacSigns.map((sign) => {
              const isSelected = selectedSign === sign.id;
              const tone = TONES[ELEMENT_TONE[sign.id]] ?? TONES.air;

              return (
                <motion.button
                  key={sign.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSign(sign.id)}
                  className={`relative p-1.5 sm:p-2.5 rounded-xl transition-all duration-300 ${
                    isSelected
                      ? `bg-gradient-to-br ${tone.selected} border-2 shadow-lg`
                      : 'bg-[#FBF3E7] dark:bg-[#1A130E] border border-[#F4B400]/10 hover:border-[#F4B400]/30'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-lg sm:text-xl">{getZodiacEmoji(sign.id)}</span>
                    <span
                      className={`text-[9px] sm:text-[10px] font-medium mt-0.5 leading-tight text-center ${
                        isSelected ? tone.text : 'text-[#80694F] dark:text-[#9C8569]'
                      }`}
                    >
                      {language === 'en' ? sign.name : sign.nameHindi}
                    </span>
                    {isSelected && (
                      <motion.div
                        layoutId="selectedIndicator"
                        className="absolute -bottom-1 w-6 h-0.5 bg-[#F4B400] rounded-full"
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Horoscope Content */}
        <div className="flex-1 p-3 sm:p-6 pt-3 sm:pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSign}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                <div className="text-3xl sm:text-4xl shrink-0">{getZodiacEmoji(selectedSign)}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-[#3D2B1A] dark:text-[#F5EAD9]">
                    {language === 'en' ? signInfo?.name : signInfo?.nameHindi}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#8C7456] dark:text-[#9C8569]">
                    {language === 'en' ? "Today's Prediction" : 'आज का भविष्यफल'}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#5C4630] dark:text-[#D9C7AC] leading-relaxed mb-3 sm:mb-4 bg-[#FBF3E7] dark:bg-[#1A130E] p-2.5 sm:p-3 rounded-xl border border-[#F4B400]/8">
                {selectedData?.prediction}
              </p>

              {/* Stat tiles — stack on very small screens so values never get clipped */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                <div className="p-1.5 sm:p-2.5 bg-[#FBF3E7] dark:bg-[#1A130E] rounded-lg border border-[#F4B400]/8 min-w-0">
                  <p className="text-[8px] sm:text-[10px] uppercase tracking-wider text-[#8C7456] dark:text-[#9C8569] truncate">
                    Lucky Color
                  </p>
                  <div className="flex items-center gap-1 sm:gap-2 mt-1 min-w-0">
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-inner shrink-0"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <span className="text-[10px] sm:text-xs font-medium text-[#3D2B1A] dark:text-[#F0E4D3] truncate">
                      {String(selectedColor).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-1.5 sm:p-2.5 bg-[#FBF3E7] dark:bg-[#1A130E] rounded-lg border border-[#F4B400]/8 min-w-0">
                  <p className="text-[8px] sm:text-[10px] uppercase tracking-wider text-[#8C7456] dark:text-[#9C8569] truncate">
                    Lucky No.
                  </p>
                  <p className="text-sm sm:text-base font-bold text-[#D98C1F] dark:text-[#F4B400] mt-1">
                    {selectedLuckyNumber}
                  </p>
                </div>

                <div className="p-1.5 sm:p-2.5 bg-[#FBF3E7] dark:bg-[#1A130E] rounded-lg border border-[#F4B400]/8 min-w-0">
                  <p className="text-[8px] sm:text-[10px] uppercase tracking-wider text-[#8C7456] dark:text-[#9C8569] truncate">
                    Mood
                  </p>
                  <div className="flex items-center gap-1 mt-1 min-w-0">
                    <FaSmile className="w-3 h-3 text-[#D98C1F] dark:text-[#F4B400] shrink-0" />
                    <p className="text-[10px] sm:text-xs font-medium text-[#3D2B1A] dark:text-[#F0E4D3] truncate">
                      {selectedMood}
                    </p>
                  </div>
                </div>
              </div>

              {/* Compatibility */}
              {selectedData?.compatibility && (
                <div className="mt-2 sm:mt-3 p-2 sm:p-2.5 bg-[#FBF3E7] dark:bg-[#1A130E] rounded-lg border border-[#F4B400]/8 min-w-0">
                  <p className="text-[8px] sm:text-[10px] uppercase tracking-wider text-[#8C7456] dark:text-[#9C8569]">
                    Compatibility
                  </p>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                    <FaUserFriends className="w-3 h-3 text-[#E8742C] dark:text-[#E8825A] shrink-0" />
                    <p className="text-[11px] sm:text-xs font-medium text-[#3D2B1A] dark:text-[#F0E4D3] break-words">
                      {selectedCompatibility}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GiLotus } from 'react-icons/gi';
import PanchangSection from './PanchangSection';
import HoroscopeSection from './HoroscopeSection';
import DailyWisdom from './DailyWisdom';
import { getPanchangForHomepage } from '@/lib/services/panchangService';
import { getAllHoroscopes, zodiacSigns } from '@/lib/services/horoscopeService';
import { getDailyContent } from '@/lib/services/dailyContentService';

const normalizePanchangData = (data = {}) => ({
  date: data?.date || new Date().toISOString().split('T')[0],
  tithi: data?.tithi || '—',
  tithiDetails: data?.tithiDetails || '',
  nakshatra: data?.nakshatra || '—',
  nakshatraDetails: data?.nakshatraDetails || '',
  sunrise: data?.sunrise || '—',
  sunset: data?.sunset || '—',
  rahuKaal: data?.rahuKaal || '—',
  abhijitMuhurat: data?.abhijitMuhurat || '—',
  specialEvent: data?.specialEvent || data?.festivals?.[0]?.festival_name || '',
});

const normalizeHoroscopeData = (horoscopes = {}) => {
  const normalized = {};

  zodiacSigns.forEach((sign) => {
    const source = horoscopes[sign.id];
    normalized[sign.id] = source
      ? {
          ...source,
          prediction: source.prediction || 'Take a moment to pause and reflect on today’s energy.',
          color: source.luckyColor || source.color || '#D98C1F',
          luckyNumber: source.luckyNumber || source.number || '—',
          mood: source.mood || 'Balanced',
          compatibility: source.compatibility || '—',
        }
      : {
          prediction: 'Take a moment to pause and reflect on today’s energy.',
          color: '#D98C1F',
          luckyNumber: '—',
          mood: 'Balanced',
          compatibility: '—',
        };
  });

  return normalized;
};

const normalizeDailyWisdom = (data) => {
  if (!data) return null;

  return {
    id: data.id || 'daily-wisdom',
    quote: data.quote || data.text || '',
    author: data.author || 'Aarambh',
    category: data.category || 'Wisdom',
    color: '#D98C1F',
    bgGradient: 'from-[#FFF6E5] via-[#FFFAF0] to-[#FDECC8]',
    borderColor: 'border-[#F4B400]/30',
    tags: data.tags || ['Wisdom', 'Spirituality'],
  };
};

export default function DailySpiritualGuide() {
  const [panchangData, setPanchangData] = useState(null);
  const [horoscopeData, setHoroscopeData] = useState({});
  const [quoteData, setQuoteData] = useState(null);
  const [mantra, setMantra] = useState('ॐ नमः शिवाय');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const loadGuideData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const [panchangResult, horoscopeResult, dailyContentResult] = await Promise.all([
          getPanchangForHomepage(today, language),
          getAllHoroscopes(today, language),
          getDailyContent(),
        ]);

        if (panchangResult.success && panchangResult.panchang) {
          setPanchangData(normalizePanchangData(panchangResult.panchang));
        } else {
          setPanchangData(normalizePanchangData({}));
        }

        if (horoscopeResult.success && horoscopeResult.horoscopes) {
          setHoroscopeData(normalizeHoroscopeData(horoscopeResult.horoscopes));
        } else {
          setHoroscopeData(normalizeHoroscopeData({}));
        }

        if (dailyContentResult.success) {
          const wisdomData = dailyContentResult.data?.wisdom;
          const mantraData = dailyContentResult.data?.mantra;
          setQuoteData(normalizeDailyWisdom(wisdomData));
          setMantra((mantraData?.text || mantraData?.mantra || 'ॐ नमः शिवाय').trim() || 'ॐ नमः शिवाय');
        } else {
          setQuoteData(null);
        }
      } catch (error) {
        console.error('Error loading spiritual guide data:', error);
      }
    };

    loadGuideData();
  }, [language]);

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
            <PanchangSection data={panchangData} mantra={mantra} language={language} />
            <DailyWisdom quoteData={quoteData} />
          </div>

          {/* Right Column - Horoscope */}
          <HoroscopeSection data={horoscopeData} language={language} onLanguageChange={setLanguage} />
        </div>
      </div>
    </section>
  );
}
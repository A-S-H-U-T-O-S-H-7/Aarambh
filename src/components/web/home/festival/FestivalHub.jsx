'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { GiSparkles } from 'react-icons/gi';
import Image from 'next/image';
import FestivalCarousel from './FestivalCarousel';
import { getFeaturedFestivals } from '@/lib/services/festivalService';

export default function FestivalHub() {
  const [featuredFestivals, setFeaturedFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const featuredResult = await getFeaturedFestivals(6);
        
        if (featuredResult.success) {
          const featuredWithSlug = featuredResult.festivals.map(f => ({
            ...f,
            slug: f.slug || f.id
          }));
          setFeaturedFestivals(featuredWithSlug);
        }
      } catch (error) {
        console.error('Error fetching festivals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-6 md:py-8 relative overflow-hidden bg-[#FBF3E7] dark:bg-[#15100C]">
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  // If no festivals, don't render
  if (featuredFestivals.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-8 relative overflow-hidden bg-[#FBF3E7] dark:bg-[#15100C]">
      {/* ─── Mandala Decorations ─── */}
      {/* Top Left */}
      <div className="absolute -top-16 -left-16 w-48 h-48 md:w-64 md:h-64 opacity-70 dark:opacity-90 pointer-events-none select-none z-0">
        <Image
          src="/mandala3.png"
          alt="Mandala"
          width={256}
          height={256}
          className="w-full h-full object-contain rotate-12"
          priority
        />
      </div>

      {/* Top Right */}
      <div className="absolute -top-16 -right-16 w-48 h-48 md:w-64 md:h-64 opacity-70 dark:opacity-90 pointer-events-none select-none z-0 scale-x-[-1]">
        <Image
          src="/mandala3.png"
          alt="Mandala"
          width={256}
          height={256}
          className="w-full h-full object-contain -rotate-12"
          priority
        />
      </div>

      {/* Bottom Left */}
      <div className="absolute -bottom-18 -left-18 w-48 h-48 md:w-64 md:h-64 opacity-70 dark:opacity-90 pointer-events-none select-none z-0 scale-y-[-1]">
        <Image
          src="/mandala3.png"
          alt="Mandala"
          width={256}
          height={256}
          className="w-full h-full object-contain -rotate-12"
          priority
        />
      </div>

      {/* Bottom Right */}
      <div className="absolute -bottom-18 -right-18 w-48 h-48 md:w-64 md:h-64 opacity-70 dark:opacity-90 pointer-events-none select-none z-0 scale-x-[-1] scale-y-[-1]">
        <Image
          src="/mandala3.png"
          alt="Mandala"
          width={256}
          height={256}
          className="w-full h-full object-contain rotate-12"
          priority
        />
      </div>

      {/* Background gradients */}
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

      {/* Subtle confetti accents */}
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
      </div>
    </section>
  );
}
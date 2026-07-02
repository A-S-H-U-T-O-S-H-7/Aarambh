// components/home/TempleDirectory.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ChevronRight,
  Flame,
  MapPin,
  Star,
  Building2
} from 'lucide-react';
import TempleCarousel from './TempleCarousel';
import TempleRail from './TempleRail';
import { getPublishedTemples, getFeaturedTemples } from '@/lib/services/templeService';

export default function TempleDirectory() {
  const [allTemples, setAllTemples] = useState([]);
  const [featuredTemples, setFeaturedTemples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemples = async () => {
      setLoading(true);
      try {
        const [allResult, featuredResult] = await Promise.all([
          getPublishedTemples(30),
          getFeaturedTemples(6),
        ]);
        if (allResult.success) setAllTemples(allResult.temples);
        if (featuredResult.success) setFeaturedTemples(featuredResult.temples);
      } catch (error) {
        console.error('Error fetching temples:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemples();
  }, []);

  if (loading) {
    return (
      <section className="py-6 lg:py-8 bg-[#FBF3E7] dark:bg-[#15100C]">
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (allTemples.length === 0) {
    return null;
  }

  return (
    <section className="py-6 lg:py-8 relative overflow-hidden bg-[#FBF3E7] dark:bg-[#15100C]">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4B400]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E8742C]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 bg-[#E8742C] rounded-full" />
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-[#3D2B1A] dark:text-[#F5EAD9] leading-tight">
                Sacred{' '}
                <span className="bg-gradient-to-r from-[#E8742C] to-[#F4B400] bg-clip-text text-transparent">
                  Temples
                </span>
              </h2>
              <p className="text-sm text-[#8C7456] dark:text-[#9C8569] mt-0.5">
                Discover Divine Places
              </p>
            </div>
          </div>
          <Link
            href="/temples"
            className="text-sm text-[#E8742C] dark:text-[#F4B400] hover:text-[#C2570F] dark:hover:text-[#FFA45C] font-medium flex items-center gap-1 transition-colors group"
          >
            View All
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Mobile: Stack Carousel */}
        <div className="md:hidden">
          <TempleCarousel temples={featuredTemples.length > 0 ? featuredTemples : allTemples.slice(0, 6)} />
        </div>

        {/* Desktop: Horizontal Rail */}
        <div className="hidden md:block">
          <TempleRail temples={allTemples} />
        </div>

        {/* Stats */}
        <div className="mt-4 text-center">
          <p className="text-xs text-[#8C7456] dark:text-[#9C8569]">
            {allTemples.length}+ temples • Swipe to explore • Click to learn more
          </p>
        </div>
      </div>
    </section>
  );
}
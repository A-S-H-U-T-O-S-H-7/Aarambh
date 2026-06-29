// components/home/TempleDirectory.jsx
'use client';

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
import { temples } from '@/lib/mockTempleData';

export default function TempleDirectory() {
  const allTemples = temples;

  return (
    <section className="py-6 lg:py-8 relative overflow-hidden bg-gradient-to-b from-cream-50/50 via-white to-cream-50/50 dark:from-brown-900/20 dark:via-brown-900 dark:to-brown-900/20">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
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
            <div className="w-1 h-10 bg-saffron rounded-full" />
            <div>
              
              <h2 className="text-2xl md:text-4xl  font-bold text-brown-900 dark:text-cream-50 leading-tight">
            Sacred{' '}
            <span className="bg-gradient-to-r from-saffron via-gold to-amber-400 bg-clip-text text-transparent">
              Temples
             {/* <Flame className="w-5 h-5 text-saffron" /> */}
            </span>

          </h2>
              <p className="text-sm text-brown-500 dark:text-gray-400 mt-0.5">
                Discover Divine Places
              </p>
            </div>
          </div>
          <Link
            href="/temples"
            className="text-sm text-saffron hover:text-gold font-medium flex items-center gap-1 transition-colors"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Mobile: Stack Carousel */}
        <div className="md:hidden">
          <TempleCarousel temples={allTemples} />
        </div>

        {/* Desktop: Horizontal Rail */}
        <div className="hidden md:block">
          <TempleRail temples={allTemples} />
        </div>

        {/* Stats */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {allTemples.length}+ temples • Swipe to explore • Click to learn more
          </p>
        </div>
      </div>
    </section>
  );
}
'use client';

import { motion } from 'framer-motion';
import { FaHands, FaHeart, FaLightbulb, FaPeace } from 'react-icons/fa';
import ValueCard from './ValueCard';

const values = [
  {
    icon: FaHeart,
    title: 'Devotion',
    description: 'Every creation is an offering to the divine',
    from: '#FF6B6B',
    to: '#EE5A24',
    soft: '#FFF0F0', // Brighter soft color
    glow: 'rgba(238, 90, 36, 0.3)',
  },
  {
    icon: FaLightbulb,
    title: 'Wisdom',
    description: 'Sharing ancient wisdom for modern life',
    from: '#FBBF24',
    to: '#F59E0B',
    soft: '#FFFDF0', // Brighter soft color
    glow: 'rgba(245, 158, 11, 0.3)',
  },
  {
    icon: FaHands,
    title: 'Service',
    description: 'Serving humanity through spiritual content',
    from: '#34D399',
    to: '#059669',
    soft: '#F0FFF5', // Brighter soft color
    glow: 'rgba(5, 150, 105, 0.3)',
  },
  {
    icon: FaPeace,
    title: 'Peace',
    description: 'Creating content that brings inner peace',
    from: '#60A5FA',
    to: '#2563EB',
    soft: '#F0F5FF', // Brighter soft color
    glow: 'rgba(37, 99, 235, 0.3)',
  },
];

export default function ValuesSection() {
  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-cream-50/30 to-white dark:from-brown-900 dark:via-brown-900/50 dark:to-brown-900" />
      
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/10 dark:bg-rose-900/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200/10 dark:bg-amber-900/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-200/5 dark:bg-emerald-900/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-brown-800/90 backdrop-blur-sm rounded-full border border-gold/20 dark:border-gold/10 shadow-sm mb-3">
            <FaHeart className="w-4 h-4 text-divine-red" />
            <span className="text-xs font-medium text-brown-700 dark:text-cream-50/70 uppercase tracking-wider">
              Our Values
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-brown-900 dark:text-cream-50">
            What We <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">Stand For</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-saffron to-gold rounded-full mx-auto mt-4" />
          <p className="mt-4 text-sm text-brown-600 dark:text-cream-50/50 max-w-2xl mx-auto">
            Our core values guide everything we do at Aarambh TV
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <ValueCard value={value} Icon={Icon} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
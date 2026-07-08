'use client';

import { motion } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';

const journey = [
  { year: '2023', title: 'The Vision', description: 'Aarambh TV was born from a vision to bring spirituality to the digital world' },
  { year: '2024', title: 'The Launch', description: 'Platform launched with bhajans, videos, and spiritual content' },
  { year: '2025', title: 'The Growth', description: 'Expanded to temples, horoscopes, and spiritual guidance' },
  { year: '2026', title: 'The Future', description: 'AI-powered spiritual guidance and global reach' },
];

export default function JourneySection() {
  return (
    <section className="py-12 md:py-16 relative overflow-hidden bg-white/50 dark:bg-brown-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-brown-800/80 backdrop-blur-sm rounded-full border border-gold/20 dark:border-gold/10 shadow-sm mb-3">
            <FaRocket className="w-4 h-4 text-saffron" />
            <span className="text-xs font-medium text-brown-700 dark:text-cream-50/70 uppercase tracking-wider">
              Our Journey
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-brown-900 dark:text-cream-50">
            The <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">Story</span> So Far
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-saffron via-gold to-saffron rounded-full hidden md:block" />

          {journey.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8 last:mb-0 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-saffron to-gold border-2 border-white dark:border-brown-900 z-10 hidden md:block" />

              <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-6' : 'md:text-left md:pl-6'}`}>
                <div className="bg-white/80 dark:bg-brown-800/80 backdrop-blur-sm rounded-xl border border-gold/20 dark:border-gold/10 p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-xl font-bold text-saffron dark:text-gold mb-0.5">
                    {item.year}
                  </div>
                  <h3 className="text-sm font-bold text-brown-900 dark:text-cream-50 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-brown-600 dark:text-cream-50/50 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
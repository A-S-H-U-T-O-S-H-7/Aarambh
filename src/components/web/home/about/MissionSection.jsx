'use client';

import { motion } from 'framer-motion';
import { FaQuoteLeft, FaOm } from 'react-icons/fa';
import { GiSparkles } from 'react-icons/gi';

export default function MissionSection() {
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
            <GiSparkles className="w-4 h-4 text-saffron" />
            <span className="text-xs font-medium text-brown-700 dark:text-cream-50/70 uppercase tracking-wider">
              Our Purpose
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-brown-900 dark:text-cream-50">
            Our <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">Mission</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="relative">
              <FaQuoteLeft className="absolute -top-2 -left-2 w-6 h-6 text-gold/20" />
              <p className="text-base md:text-lg text-brown-700 dark:text-cream-50/70 leading-relaxed pl-6">
                At Aarambh TV, we believe that spirituality is for everyone.
                Our mission is to make ancient wisdom accessible, engaging,
                and relevant for the modern world.
              </p>
            </div>

            <p className="text-sm text-brown-600 dark:text-cream-50/50 leading-relaxed">
              We combine technology with tradition to create a platform where
              devotees can connect with the divine through bhajans, spiritual
              videos, and daily guidance.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-saffron" />
                <span className="text-xs text-brown-700 dark:text-cream-50/70">Daily Panchang</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-xs text-brown-700 dark:text-cream-50/70">Spiritual Videos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-divine-red" />
                <span className="text-xs text-brown-700 dark:text-cream-50/70">Spiritual Stories</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Sanskrit Quote Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-saffron/10 via-gold/10 to-amber-50/10 dark:from-saffron/20 dark:via-gold/10 dark:to-amber-900/10 rounded-2xl border border-gold/20 dark:border-gold/10 p-6 shadow-lg">
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-saffron/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-gold/20 rounded-full blur-2xl" />

              <div className="text-center relative z-10">
                <FaOm className="w-12 h-12 mx-auto text-saffron mb-3" />
                <h3 className="text-lg font-bold text-brown-900 dark:text-cream-50 mb-1">
                  आरम्भः सर्वकार्येषु मङ्गलाचरणम्
                </h3>
                <p className="text-xs text-brown-500 dark:text-cream-50/50">
                  "Every beginning is an auspicious invocation"
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
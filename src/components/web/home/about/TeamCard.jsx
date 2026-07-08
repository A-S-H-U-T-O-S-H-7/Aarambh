'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCrown } from 'react-icons/fa';

export default function TeamCard({ member, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = member.icon;
  const isFounder = member.isFounder;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {isFounder ? (
        // Founder Card
        <div className="relative bg-gradient-to-br from-saffron/10 via-gold/5 to-amber-50/10 dark:from-saffron/20 dark:via-gold/10 dark:to-amber-900/10 rounded-2xl border-2 border-saffron/30 dark:border-gold/30 p-6 shadow-xl shadow-saffron/10 dark:shadow-gold/10">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-saffron via-gold to-saffron opacity-20 blur-sm" />
          
          <div className="relative">
            <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-gradient-to-r from-saffron to-gold text-white text-[8px] font-bold tracking-wider shadow-lg">
              <span className="flex items-center gap-1">
                <FaCrown className="w-3 h-3" /> FOUNDER
              </span>
            </div>

            <div className="flex flex-col items-center">
              <motion.div
                animate={isHovered ? { scale: 1.1, rotate: [0, -3, 3, 0] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-24 h-24 rounded-full bg-gradient-to-br from-saffron/20 to-gold/20 dark:from-saffron/30 dark:to-gold/30 flex items-center justify-center mb-3 border-2 border-saffron/40 dark:border-gold/40 shadow-lg"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-saffron/10 to-gold/10 animate-pulse" />
                <span className="text-3xl font-bold text-saffron dark:text-gold">
                  {member.initials}
                </span>
              </motion.div>

              <h3 className="text-base font-bold text-brown-900 dark:text-cream-50 text-center">
                {member.name}
              </h3>
              <p className="text-xs font-medium text-saffron dark:text-gold text-center mt-0.5">
                {member.role}
              </p>

              <div className="w-12 h-0.5 bg-gradient-to-r from-saffron to-gold rounded-full my-2" />

              <p className="text-xs text-brown-600 dark:text-cream-50/60 text-center italic leading-relaxed">
                "{member.quote}"
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Regular Team Card
        <div className={`relative bg-gradient-to-br ${member.gradient} bg-opacity-30 dark:bg-opacity-20 rounded-2xl border border-gold/15 dark:border-gold/10 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
          <div
            className={`absolute -top-2 right-4 px-3 py-0.5 rounded-full text-[8px] font-bold tracking-wider text-white bg-gradient-to-r ${member.gradient}`}
          >
            {member.tag}
          </div>

          <div className="flex flex-col items-center">
            <motion.div
              animate={isHovered ? { scale: 1.08, rotate: [0, -5, 5, 0] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-16 h-16 rounded-full bg-white/60 dark:bg-brown-900/60 flex items-center justify-center mb-3 border-2 border-gold/15 dark:border-gold/10"
            >
              <span className="text-xl font-bold text-brown-800 dark:text-cream-50">
                {member.initials}
              </span>
            </motion.div>

            <h3 className="text-sm font-bold text-brown-900 dark:text-cream-50 text-center">
              {member.name}
            </h3>
            <p className="text-xs text-brown-500 dark:text-cream-50/50 text-center mt-0.5">
              {member.role}
            </p>

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={isHovered ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-2"
            >
              <p className="text-[10px] text-brown-600 dark:text-cream-50/40 text-center italic leading-relaxed">
                "{member.quote}"
              </p>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
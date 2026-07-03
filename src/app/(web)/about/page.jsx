'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaOm,
  FaPlay,
  FaPause,
  FaArrowRight,
  FaArrowLeft,
  FaQuoteLeft,
  FaQuoteRight,
  FaCrown,
  FaCamera,
  FaFilm,
  FaPalette,
  FaChartLine,
  FaComment,
  FaCog,
  FaPen,
  FaChartBar,
  FaUsers,
  FaHeart,
  FaStar,
  FaInfinity,
  FaLightbulb,
  FaRocket,
  FaHands,
  FaPeace,
  FaGlobe,
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from 'react-icons/fa';
import { GiLotus, GiTempleGate, GiSparkles } from 'react-icons/gi';

// ─── Team Member Data ──────────────────────────────────────────────

const teamMembers = [
  {
    id: 1,
    name: "Dr. Manoranjan Mohanty",
    role: "Founder & Chairman",
    initials: "MM",
    icon: FaCrown,
    tag: "FOUNDER",
    gradient: "from-saffron to-gold",
    color: "#FF7A00",
    quote: "Bringing spirituality to the digital age",
    isFounder: true,
  },
  {
    id: 2,
    name: "Manbir Singh Negi",
    role: "Sr. Cameraman & Video Editor",
    initials: "MN",
    icon: FaCamera,
    tag: "VIDEO",
    gradient: "from-orange-500 to-amber-500",
    color: "#E8742C",
    quote: "Visual stories that touch the soul",
  },
  {
    id: 3,
    name: "Deepak Kumar",
    role: "Animation & Video Editor",
    initials: "DK",
    icon: FaFilm,
    tag: "MOTION",
    gradient: "from-purple-500 to-violet-500",
    color: "#6A1B9A",
    quote: "Animating divine stories",
  },
  {
    id: 4,
    name: "Manish Batra",
    role: "Graphic Designer",
    initials: "MB",
    icon: FaPalette,
    tag: "DESIGN",
    gradient: "from-blue-500 to-cyan-500",
    color: "#0284c7",
    quote: "Designing spirituality with color",
  },
  {
    id: 5,
    name: "Lal Yadav",
    role: "SEO Specialist",
    initials: "LY",
    icon: FaChartLine,
    tag: "GROWTH",
    gradient: "from-emerald-500 to-green-500",
    color: "#059669",
    quote: "Spreading divine content to the world",
  },
  {
    id: 6,
    name: "Ankita Mohanty",
    role: "Social Media Handler",
    initials: "AM",
    icon: FaComment,
    tag: "SOCIAL",
    gradient: "from-pink-500 to-rose-500",
    color: "#DB2777",
    quote: "Connecting souls through social media",
  },
  {
    id: 7,
    name: "Reva Solanki",
    role: "Manager",
    initials: "RS",
    icon: FaCog,
    tag: "OPS",
    gradient: "from-indigo-500 to-blue-500",
    color: "#4F46E5",
    quote: "Managing divine operations with grace",
  },
  {
    id: 8,
    name: "Rajneesh Verma",
    role: "Content Writer & Digital Strategist",
    initials: "RV",
    icon: FaPen,
    tag: "CONTENT",
    gradient: "from-lime-500 to-green-500",
    color: "#65A30D",
    quote: "Weaving words of wisdom",
  },
  {
    id: 9,
    name: "Nirmalya Mohanty",
    role: "SEO & SMO Specialist",
    initials: "NM",
    icon: FaChartBar,
    tag: "SEO/SMO",
    gradient: "from-cyan-500 to-teal-500",
    color: "#0891B2",
    quote: "Optimizing the divine presence",
  },
];

// ─── Values ────────────────────────────────────────────────────────

const values = [
  {
    icon: FaHeart,
    title: 'Devotion',
    description: 'Every creation is an offering to the divine',
    gradient: 'from-rose-500/20 to-pink-500/20 dark:from-rose-500/10 dark:to-pink-500/10',
    iconColor: 'text-rose-500 dark:text-rose-400',
  },
  {
    icon: FaLightbulb,
    title: 'Wisdom',
    description: 'Sharing ancient wisdom for modern life',
    gradient: 'from-amber-500/20 to-yellow-500/20 dark:from-amber-500/10 dark:to-yellow-500/10',
    iconColor: 'text-amber-500 dark:text-amber-400',
  },
  {
    icon: FaHands,
    title: 'Service',
    description: 'Serving humanity through spiritual content',
    gradient: 'from-emerald-500/20 to-green-500/20 dark:from-emerald-500/10 dark:to-green-500/10',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
  },
  {
    icon: FaPeace,
    title: 'Peace',
    description: 'Creating content that brings inner peace',
    gradient: 'from-sky-500/20 to-blue-500/20 dark:from-sky-500/10 dark:to-blue-500/10',
    iconColor: 'text-sky-500 dark:text-sky-400',
  },
];

// ─── Journey Timeline ─────────────────────────────────────────────

const journey = [
  { year: '2023', title: 'The Vision', description: 'Aarambh TV was born from a vision to bring spirituality to the digital world' },
  { year: '2024', title: 'The Launch', description: 'Platform launched with bhajans, videos, and spiritual content' },
  { year: '2025', title: 'The Growth', description: 'Expanded to temples, horoscopes, and spiritual guidance' },
  { year: '2026', title: 'The Future', description: 'AI-powered spiritual guidance and global reach' },
];

// ─── Team Member Card ─────────────────────────────────────────────

function TeamCard({ member, index }) {
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
      {/* Founder Card - Different Design */}
      {isFounder ? (
        <div className="relative bg-gradient-to-br from-saffron/10 via-gold/5 to-amber-50/10 dark:from-saffron/20 dark:via-gold/10 dark:to-amber-900/10 rounded-2xl border-2 border-saffron/30 dark:border-gold/30 p-6 shadow-xl shadow-saffron/10 dark:shadow-gold/10">
          {/* Glow Ring */}
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-saffron via-gold to-saffron opacity-20 blur-sm" />
          
          <div className="relative">
            {/* Crown Badge */}
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
        // Regular Team Cards with Soft Gradient Backgrounds
        <div className={`relative bg-gradient-to-br ${member.gradient} bg-opacity-30 dark:bg-opacity-20 rounded-2xl border border-gold/15 dark:border-gold/10 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
          {/* Top Tag */}
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

            {/* Quote on Hover */}
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

// ─── Main Page ─────────────────────────────────────────────────────

export default function AboutPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen overflow-x-hidden" ref={containerRef}>
      {/* ─── HERO SECTION ─── */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-saffron/20 via-cream-50/90 to-gold/20 dark:from-brown-900 dark:via-brown-800 dark:to-brown-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,180,0,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,122,0,0.08),transparent_60%)]" />

          {/* Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gold/20 dark:bg-gold/10"
              style={{
                width: Math.random() * 6 + 3 + 'px',
                height: Math.random() * 6 + 3 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: Math.random() * 4 + 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <motion.div
          style={{ y, opacity }}
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-brown-800/80 backdrop-blur-sm rounded-full border border-gold/20 dark:border-gold/10 shadow-sm mb-5">
              <GiLotus className="w-4 h-4 text-saffron" />
              <span className="text-xs font-medium text-brown-700 dark:text-cream-50/70 uppercase tracking-wider">
                Our Story
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brown-900 dark:text-cream-50 mb-3">
              <span className="bg-gradient-to-r from-saffron via-gold to-amber-400 bg-clip-text text-transparent">
                Aarambh TV
              </span>
            </h1>
            <p className="text-lg md:text-xl text-brown-700 dark:text-cream-50/70 font-light">
              Where Spirituality Meets Technology
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 max-w-2xl mx-auto"
          >
            <p className="text-sm md:text-base text-brown-600 dark:text-cream-50/50 leading-relaxed">
              Aarambh TV is a modern spiritual media platform dedicated to devotion,
              spiritual education, and divine experiences. We bring ancient wisdom
              to the digital age through bhajans, stories, and spiritual guidance.
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-[10px] text-brown-500 dark:text-cream-50/30 uppercase tracking-widest">
              Scroll
            </span>
            <div className="w-4 h-6 border border-gold/30 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 h-2 bg-gold/50 rounded-full mt-1.5"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── MISSION SECTION ─── */}
      <section className="py-12 md:py-16 relative overflow-hidden bg-white/50 dark:bg-brown-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* ─── VALUES SECTION ─── */}
      <section className="py-12 md:py-16 relative overflow-hidden bg-gradient-to-b from-white/30 to-cream-50/30 dark:from-brown-900/20 dark:to-brown-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-brown-800/80 backdrop-blur-sm rounded-full border border-gold/20 dark:border-gold/10 shadow-sm mb-3">
              <FaHeart className="w-4 h-4 text-divine-red" />
              <span className="text-xs font-medium text-brown-700 dark:text-cream-50/70 uppercase tracking-wider">
                Our Values
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-brown-900 dark:text-cream-50">
              What We <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">Stand For</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className={`group relative bg-gradient-to-br ${value.gradient} rounded-xl border border-gold/10 dark:border-gold/5 p-5 transition-all duration-300 hover:shadow-lg`}
              >
                <div className={`w-10 h-10 rounded-full bg-white/60 dark:bg-brown-800/60 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className={`w-5 h-5 ${value.iconColor}`} />
                </div>
                <h3 className="text-sm font-bold text-brown-900 dark:text-cream-50 mb-1">
                  {value.title}
                </h3>
                <p className="text-xs text-brown-600 dark:text-cream-50/50 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── JOURNEY SECTION ─── */}
      <section className="py-12 md:py-16 relative overflow-hidden bg-white/50 dark:bg-brown-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* ─── TEAM SECTION ─── */}
      <section className="py-12 md:py-16 relative overflow-hidden bg-gradient-to-b from-cream-50/30 to-white dark:from-brown-900/20 dark:to-brown-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-brown-800/80 backdrop-blur-sm rounded-full border border-gold/20 dark:border-gold/10 shadow-sm mb-3">
              <FaUsers className="w-4 h-4 text-gold" />
              <span className="text-xs font-medium text-brown-700 dark:text-cream-50/70 uppercase tracking-wider">
                Our Team
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-brown-900 dark:text-cream-50">
              Meet the <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">Makers</span>
            </h2>
            <p className="mt-2 text-sm text-brown-600 dark:text-cream-50/50 max-w-2xl mx-auto">
              The passionate individuals behind Aarambh TV, dedicated to bringing
              spirituality to the digital world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teamMembers.map((member, index) => (
              <TeamCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER QUOTE & SOCIAL ─── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-saffron/90 to-gold/90 dark:from-saffron/80 dark:to-gold/80 py-12 md:py-14">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <GiLotus className="w-12 h-12 mx-auto text-white/80 mb-3" />
            
            <blockquote className="text-lg md:text-xl text-white/90 font-light italic max-w-2xl mx-auto leading-relaxed">
              "Spirituality is not about perfection, it's about connection. 
              Connect with the divine, connect with yourself, connect with the world."
            </blockquote>
            <p className="text-sm text-white/70 mt-3 font-medium">
              — Aarambh TV
            </p>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-xs text-white/60 uppercase tracking-wider mb-3">
                Follow us on
              </p>
              <div className="flex items-center justify-center gap-4">
                <a href="#" className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110">
                  <FaYoutube className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110">
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110">
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110">
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110">
                  <FaLinkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
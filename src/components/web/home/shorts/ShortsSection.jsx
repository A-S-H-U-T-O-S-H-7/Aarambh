'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPlay, FaEye, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaFire } from 'react-icons/fa';
import { getVideosPage, countPublishedVideos } from '@/lib/services/mediaService';
import ShortsModal from '@/components/web/shorts/ShortsModal';
import { shortThumb, formatDate, formatViews } from '@/components/web/shorts/shortsUtils';

const HOME_SHORTS = 20;

// Homepage "Shorts" section: latest 20 Shorts, desktop horizontal rail with
// arrows, mobile swipeable card stack. "View all" goes to /shorts.
export default function ShortsSection() {
  const [shorts, setShorts] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getVideosPage(HOME_SHORTS, 'short'), countPublishedVideos('short')])
      .then(([result, count]) => {
        if (cancelled) return;
        if (result.success) setShorts(result.videos);
        setTotal(count);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && shorts.length === 0) return null;

  return (
    <section className="py-8 lg:py-10 relative overflow-hidden bg-[#FBF3E7] dark:bg-[#15100C]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 10%, rgba(244,180,0,0.12) 0%, transparent 45%), radial-gradient(circle at 90% 90%, rgba(232,116,44,0.10) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 bg-gradient-to-b from-[#E8742C] to-[#F4B400] rounded-full" />
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-[#3D2B1A] dark:text-[#F5EAD9] flex items-center gap-2">
                Spiritual
                <span className="bg-gradient-to-r from-[#E8742C] to-[#F4B400] bg-clip-text text-transparent">Shorts</span>
                <FaFire className="w-4 h-4 md:w-5 md:h-5 text-[#E8742C]" />
              </h2>
              <p className="text-xs md:text-sm text-[#6B5640] dark:text-[#CBB89E] mt-0.5">
                Quick moments of devotion{total ? ` · ${total.toLocaleString('en-IN')} shorts` : ''}
              </p>
            </div>
          </div>
          <Link
            href="/shorts"
            className="flex-shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-[#E8742C] to-[#F4B400] hover:shadow-lg hover:shadow-[#F4B400]/30 transition-all"
          >
            View All
            <FaChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[200px] md:w-[230px] aspect-[9/16] rounded-xl bg-[#EADBC4] dark:bg-[#2A2018] animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <ShortsRail shorts={shorts} onOpen={setSelected} />
            </div>
            <div className="block md:hidden">
              <ShortsStack shorts={shorts} onOpen={setSelected} paused={!!selected} />
            </div>
          </>
        )}
      </div>

      {selected && (
        <ShortsModal
          short={selected}
          allShorts={shorts}
          onClose={() => setSelected(null)}
          onNavigate={setSelected}
        />
      )}
    </section>
  );
}

// ─── Desktop: horizontal rail with arrows ─────────────────────────────────────

function ShortsRail({ shorts, onOpen }) {
  const railRef = useRef(null);
  const scroll = (dir) => railRef.current?.scrollBy({ left: dir * 520, behavior: 'smooth' });

  return (
    <div className="relative group">
      <button
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 dark:bg-[#2A2018] shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <FaChevronLeft className="w-4 h-4 text-[#5C4630] dark:text-[#F0E4D3]" />
      </button>
      <button
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 dark:bg-[#2A2018] shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        <FaChevronRight className="w-4 h-4 text-[#5C4630] dark:text-[#F0E4D3]" />
      </button>

      <div
        ref={railRef}
        className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {shorts.map((short) => (
          <button
            key={short.id}
            type="button"
            onClick={() => onOpen(short)}
            className="group/card flex-shrink-0 w-[230px] snap-start text-left cursor-pointer"
          >
            <ShortTile short={short} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Mobile: swipeable stacked cards ─────────────────────────────────────────

const cardVariants = {
  active: { scale: 0.86, x: 0, y: 0, opacity: 1, zIndex: 30, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  next: { scale: 0.78, x: 38, y: 12, opacity: 0.7, zIndex: 20, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  prev: { scale: 0.72, x: -38, y: 12, opacity: 0.7, zIndex: 10, transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

function ShortsStack({ shorts, onOpen, paused }) {
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const n = shorts.length;

  const next = useCallback(() => setCurrent((i) => (i + 1) % n), [n]);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + n) % n), [n]);

  // Auto-advance every 5s while idle
  useEffect(() => {
    if (n < 2 || paused || dragging) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [n, paused, dragging, next]);

  // Keyed by short id so a card animates from "next" to "active" etc.
  const cards = [
    ...(n >= 3 ? [[shorts[(current - 1 + n) % n], 'prev']] : []),
    ...(n >= 2 ? [[shorts[(current + 1) % n], 'next']] : []),
    [shorts[current], 'active'],
  ];

  return (
    <div>
      <div className="relative mx-auto w-full max-w-[340px]" style={{ height: 520 }}>
        {cards.map(([card, position]) => (
          <motion.div
            key={card.id}
            className="absolute inset-0 cursor-pointer"
            variants={cardVariants}
            initial={position}
            animate={position}
            drag={position === 'active' ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragStart={() => setDragging(true)}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) next();
              else if (info.offset.x > 60) prev();
              setDragging(false);
            }}
            style={{ touchAction: 'pan-y' }}
            // onTap does not fire after a drag, so a swipe never opens the player
            onTap={() => position === 'active' && onOpen(card)}
          >
            <ShortTile short={card} full />
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-2 mt-3">
        {shorts.slice(0, 6).map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrent(i)}
            aria-label={`Go to short ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-6 h-1.5 bg-[#E8742C]' : 'w-1.5 h-1.5 bg-[#D9C4A5] dark:bg-[#4A3A2A]'
            }`}
          />
        ))}
        {n > 6 && <span className="text-xs text-[#8A7358] dark:text-[#A8957C] ml-1">+{n - 6}</span>}
      </div>
      <p className="text-center text-[10px] text-[#8A7358] dark:text-[#A8957C] mt-2">← Swipe to explore · tap to watch →</p>
    </div>
  );
}

// ─── Card visual (shared) ────────────────────────────────────────────────────

function ShortTile({ short, full = false }) {
  const thumb = shortThumb(short);
  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-[#2A2018] shadow-md transition-all duration-300 ${
        full ? 'w-full h-full shadow-2xl' : 'aspect-[9/16] group-hover/card:shadow-xl group-hover/card:-translate-y-1'
      }`}
    >
      {thumb && (
        <img
          src={thumb}
          alt={short.title}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          full ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
          <FaPlay className="w-4 h-4 text-white ml-0.5" />
        </div>
      </div>

      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-gradient-to-r from-[#E8742C] to-[#F4B400] text-white text-[9px] font-bold rounded-full uppercase tracking-wider shadow">
        Short
      </span>
      {short.duration && (
        <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 bg-black/60 text-white text-[10px] font-semibold rounded-md">
          {short.duration}
        </span>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white text-xs md:text-sm font-bold leading-snug line-clamp-2 mb-1.5">{short.title}</h3>
        <div className="flex items-center gap-3 text-white/70 text-[10px]">
          <span className="flex items-center gap-1">
            <FaEye className="w-3 h-3" />
            {formatViews(short.views)}
          </span>
          <span className="flex items-center gap-1">
            <FaCalendarAlt className="w-3 h-3" />
            {formatDate(short.publishDate)}
          </span>
        </div>
      </div>
    </div>
  );
}

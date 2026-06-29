// components/home/CompactWisdomCard.jsx
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GiLotus } from 'react-icons/gi';
import WisdomCard from './WisdomCard';
import { getTodaysWisdom, wisdomQuotes } from '@/lib/mockWisdomData';

export default function DailyWisdom() {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [likedQuotes, setLikedQuotes] = useState([]);

  useEffect(() => {
    setCurrentQuote(getTodaysWisdom());
  }, []);

  const handleRefresh = () => {
    const pool = wisdomQuotes.filter((q) => q.id !== currentQuote?.id);
    const next = pool[Math.floor(Math.random() * pool.length)];
    if (next) setCurrentQuote(next);
  };

  const handleLike = (quoteId) => {
    setLikedQuotes((prev) =>
      prev.includes(quoteId) ? prev.filter((id) => id !== quoteId) : [...prev, quoteId]
    );
  };

  if (!currentQuote) {
    return (
      <div className="flex-1 rounded-2xl bg-cream-50/50 dark:bg-brown-900/30 flex items-center justify-center min-h-[140px]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold" />
      </div>
    );
  }

  const isLiked = likedQuotes.includes(currentQuote.id);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center gap-1.5 mb-2">
        <GiLotus className="w-3.5 h-3.5 text-gold" />
        <span className="text-xs sm:text-sm font-semibold text-brown-700 dark:text-cream-50">
          Daily Wisdom
        </span>
      </div>
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          <WisdomCard
            key={currentQuote.id}
            quote={currentQuote}
            isLiked={isLiked}
            onLike={handleLike}
            onRefresh={handleRefresh}
            showRefresh={true}
            showShare={true}
            compact={true}
            className="h-full"
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

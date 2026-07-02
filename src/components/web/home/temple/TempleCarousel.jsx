// components/home/TempleCarousel.jsx
'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { 
  MapPin,
  Star,
  Video
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function TempleCarousel({ temples }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(380);
  const containerRef = useRef(null);

  useEffect(() => {
    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

  const updateContainerWidth = () => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      const cardWidth = Math.min(width - 32, 380);
      setContainerWidth(cardWidth);
    }
  };

  const goToNext = useCallback(() => {
    if (temples.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % temples.length);
  }, [temples.length]);

  const goToPrev = useCallback(() => {
    if (temples.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + temples.length) % temples.length);
  }, [temples.length]);

  const handleDragEnd = (event, info) => {
    const threshold = 60;
    const offset = info.offset.x;
    
    if (offset < -threshold) {
      goToNext();
    } else if (offset > threshold) {
      goToPrev();
    }
    setIsDragging(false);
  };

  useEffect(() => {
    if (temples.length === 0 || isDragging) return;
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [temples.length, isDragging, goToNext]);

  if (temples.length === 0) return null;

  const activeCard = temples[currentIndex];
  const nextCard = temples[(currentIndex + 1) % temples.length];
  const prevCard = temples[(currentIndex - 1 + temples.length) % temples.length];

  const getCardSize = () => {
    const width = containerWidth;
    if (width < 300) {
      return { 
        activeScale: 0.9,
        nextScale: 0.78, 
        prevScale: 0.72,
        xOffset: 20, 
        yOffset: 8 
      };
    } else if (width < 360) {
      return { 
        activeScale: 0.92,
        nextScale: 0.80, 
        prevScale: 0.74,
        xOffset: 25, 
        yOffset: 10 
      };
    } else {
      return { 
        activeScale: 0.82,
        nextScale: 0.78, 
        prevScale: 0.72,
        xOffset: 45, 
        yOffset: 12 
      };
    }
  };

  const cardSize = getCardSize();

  const cardVariants = {
    active: {
      scale: cardSize.activeScale,
      x: 0,
      y: 0,
      opacity: 1,
      zIndex: 30,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    next: {
      scale: cardSize.nextScale,
      x: cardSize.xOffset,
      y: cardSize.yOffset,
      opacity: 0.7,
      zIndex: 20,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    prev: {
      scale: cardSize.prevScale,
      x: -cardSize.xOffset,
      y: cardSize.yOffset,
      opacity: 0.7,
      zIndex: 20,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    hidden: {
      scale: 0.6,
      x: 0,
      y: 0,
      opacity: 0,
      zIndex: 0,
      transition: { duration: 0.3 }
    }
  };

  const renderCard = (card, position, isActive = false) => {
    if (!card) return null;
    const title = card.title || 'Sacred temple';
    const image = card.featuredImage || card.images?.[0] || '';
    
    // Use unique key: position + card.id to ensure uniqueness
    const uniqueKey = `${position}-${card.id}`;
    
    return (
      <motion.div
        key={uniqueKey}
        className="absolute w-full h-full cursor-pointer"
        variants={cardVariants}
        initial={position === 'active' ? 'active' : position === 'next' ? 'next' : position === 'prev' ? 'prev' : 'hidden'}
        animate={position === 'active' ? 'active' : position === 'next' ? 'next' : position === 'prev' ? 'prev' : 'hidden'}
        drag={position === 'active' ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ 
          touchAction: 'none',
          width: '100%',
          height: '100%'
        }}
        onClick={() => isActive && handleCardClick(card)}
      >
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50">
          {/* Image */}
          <div className="relative w-full h-full">
            {image ? (
              <Image
                src={image}
                alt={`${title} temple`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#E8742C] to-[#F4B400] flex items-center justify-center text-white text-6xl">
                <span aria-hidden="true">🛕</span>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-saffron text-white text-[9px] font-bold rounded-full uppercase shadow-lg">
                {card.deity || 'Sacred'}
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h4 className="text-white text-sm font-bold leading-snug line-clamp-2 mb-1.5">
                {title}
              </h4>
              <div className="flex items-center gap-3 text-white/70 text-[9px]">
                {card.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {card.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-gold" />
                  {card.views || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const handleCardClick = (card) => {
    if (card.slug) {
      window.location.href = `/temples/${card.slug}`;
    } else {
      window.location.href = '/temples';
    }
  };

  return (
    <div className="relative w-full">
      <div 
        ref={containerRef}
        className="relative mx-auto w-full"
        style={{ 
          height: "480px",
          maxWidth: "100%"
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center px-1 sm:px-4">
          <div 
            className="relative"
            style={{ 
              width: "100%",
              maxWidth: "360px",
              height: "100%"
            }}
          >
            {renderCard(prevCard, 'prev')}
            {renderCard(nextCard, 'next')}
            {renderCard(activeCard, 'active', true)}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {temples.slice(0, 6).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? "w-6 h-1.5 bg-saffron" 
                : "w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
        {temples.length > 6 && (
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-1 flex items-center">
            +{temples.length - 6}
          </span>
        )}
      </div>

      <p className="text-center text-[9px] text-gray-400 dark:text-gray-500 mt-3">
        ← Swipe to explore temples →
      </p>
    </div>
  );
}
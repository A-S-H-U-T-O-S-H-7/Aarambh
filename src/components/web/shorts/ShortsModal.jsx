'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaShareAlt, FaEye, FaCalendarAlt, FaVolumeUp, FaVolumeMute, FaChevronUp, FaChevronDown, FaFacebook, FaWhatsapp, FaTwitter, FaLink } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { incrementVideoView } from '@/lib/services/mediaService';
import { formatDate, formatViews } from './shortsUtils';

const variants = {
  enter: (direction) => ({ y: direction > 0 ? '100%' : '-100%', scale: 0.95, opacity: 0 }),
  center: { y: 0, scale: 1, opacity: 1, transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] } },
  exit: (direction) => ({
    y: direction > 0 ? '-100%' : '100%',
    scale: 0.95,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
  }),
};

/**
 * Full-screen vertical player for Shorts (swipe / arrow keys to move between them).
 * short:      the one to open
 * allShorts:  list to navigate through
 * total:      optional total count for the "3 / 1283" indicator
 * onNearEnd:  optional; called when the viewer gets close to the end of allShorts
 *             so the page can load more
 */
export default function ShortsModal({ short, allShorts, total, onClose, onNavigate, onNearEnd }) {
  const [current, setCurrent] = useState(short);
  const [direction, setDirection] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const touchStart = useRef(0);
  const touchCurrent = useRef(0);
  const viewed = useRef(new Set());

  const index = Math.max(0, allShorts.findIndex((s) => s.id === current.id));
  const count = Math.max(total || 0, allShorts.length);

  useEffect(() => {
    setCurrent(short);
  }, [short]);

  // Count a view once per short per opening of the player
  useEffect(() => {
    if (!current?.id || viewed.current.has(current.id)) return;
    viewed.current.add(current.id);
    incrementVideoView(current.id).catch(() => {});
  }, [current?.id]);

  // Ask the page for more when 3 from the end
  useEffect(() => {
    if (onNearEnd && index >= allShorts.length - 3) onNearEnd();
  }, [index, allShorts.length, onNearEnd]);

  // Lock page scroll without jumping the page back to the top
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const goTo = useCallback(
    (nextIndex, dir) => {
      const next = allShorts[nextIndex];
      if (!next) return;
      setDirection(dir);
      setCurrent(next);
      setShowShare(false);
      onNavigate?.(next);
    },
    [allShorts, onNavigate]
  );

  const handleNext = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const handlePrev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleNext, handlePrev, onClose]);

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientY;
    touchCurrent.current = e.touches[0].clientY;
  };
  const onTouchMove = (e) => {
    touchCurrent.current = e.touches[0].clientY;
  };
  const onTouchEnd = () => {
    const diff = touchStart.current - touchCurrent.current;
    if (diff > 80) handleNext();
    else if (diff < -80) handlePrev();
  };

  const shareUrl = current.videoId ? `https://www.youtube.com/shorts/${current.videoId}` : '';
  const handleShare = async (platform) => {
    const title = current.title || 'Aarambh TV';
    const links = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
    };
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied!');
      } catch {
        toast.error('Could not copy link');
      }
    } else {
      window.open(links[platform], '_blank', 'noopener,noreferrer,width=600,height=500');
    }
    setShowShare(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-2" onClick={onClose}>
      <div
        className="relative w-full h-full max-w-md mx-auto flex flex-col bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ maxHeight: 'calc(100vh - 16px)', touchAction: 'pan-x' }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 backdrop-blur-sm cursor-pointer"
        >
          <FaTimes className="w-4 h-4 text-white" />
        </button>

        {count > 1 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
            <span className="text-white text-[11px] font-medium">
              {index + 1} / {count.toLocaleString('en-IN')}
            </span>
          </div>
        )}

        <div className="flex-1 relative bg-black overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              {current.videoId && (
                <iframe
                  src={`https://www.youtube.com/embed/${current.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${current.videoId}`}
                  title={current.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}

              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 to-transparent pointer-events-none" />

              <div className="absolute bottom-0 left-0 right-0 p-4 z-20 pointer-events-none">
                <h2 className="text-white text-sm font-semibold mb-1.5 line-clamp-2">{current.title}</h2>
                <div className="flex items-center gap-3 text-white/60 text-[11px]">
                  <span className="flex items-center gap-1">
                    <FaEye className="w-3 h-3" />
                    {formatViews(current.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="w-3 h-3" />
                    {formatDate(current.publishDate)}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Side controls */}
          <div className="absolute bottom-24 right-3 z-30 flex flex-col gap-3">
            <button
              onClick={() => setIsMuted((m) => !m)}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/10 cursor-pointer"
            >
              {isMuted ? <FaVolumeMute className="w-4 h-4 text-white" /> : <FaVolumeUp className="w-4 h-4 text-white" />}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowShare((s) => !s)}
                aria-label="Share"
                className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/10 cursor-pointer"
              >
                <FaShareAlt className="w-4 h-4 text-white" />
              </button>
              {showShare && (
                <div className="absolute right-full mr-2 bottom-0 w-40 rounded-lg bg-white dark:bg-[#2A2018] shadow-xl overflow-hidden text-[#3D2B1A] dark:text-[#F5EAD9]">
                  {[
                    ['whatsapp', 'WhatsApp', <FaWhatsapp key="w" className="w-3.5 h-3.5 text-green-600" />],
                    ['facebook', 'Facebook', <FaFacebook key="f" className="w-3.5 h-3.5 text-blue-600" />],
                    ['twitter', 'Twitter', <FaTwitter key="t" className="w-3.5 h-3.5 text-sky-500" />],
                    ['copy', 'Copy link', <FaLink key="c" className="w-3.5 h-3.5" />],
                  ].map(([key, label, icon]) => (
                    <button
                      key={key}
                      onClick={() => handleShare(key)}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-[#F4B400]/10 flex items-center gap-2 cursor-pointer"
                    >
                      {icon}
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop up/down */}
          <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-3 z-30 flex-col gap-2">
            <button
              onClick={handlePrev}
              disabled={index === 0}
              aria-label="Previous short"
              className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 disabled:opacity-30 cursor-pointer"
            >
              <FaChevronUp className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={handleNext}
              disabled={index >= allShorts.length - 1}
              aria-label="Next short"
              className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 disabled:opacity-30 cursor-pointer"
            >
              <FaChevronDown className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 md:hidden pointer-events-none">
          <div className="flex items-center gap-2 text-white/25">
            <FaChevronUp className="w-3 h-3" />
            <span className="text-[9px]">Swipe</span>
            <FaChevronDown className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

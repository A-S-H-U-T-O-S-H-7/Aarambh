'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaArrowLeft,
  FaMapPin,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaFacebook,
  FaWhatsapp,
  FaCopy,
  FaCheck,
  FaEye,
  FaClock,
  FaBuilding,
  FaInfoCircle,
  FaCalendarAlt,
  FaGift,
  FaArrowRight,
  FaHeadphones,
  FaPause,
  FaPlay,
  FaVolumeUp,
  FaVolumeMute,
  FaTimes,
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { getTempleBySlug, incrementTempleView, toggleTempleLike } from '@/lib/services/templeService';

// Helper to strip HTML tags AND decode HTML entities
const stripHtml = (html) => {
  if (!html) return '';
  
  let text = html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-z]+;/gi, ' ');
  
  text = text.replace(/<[^>]*>/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
};

const formatDate = (date) => {
  if (!date) return 'TBD';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Category names mapping
const categoryNames = {
  north: 'North India',
  south: 'South India',
  east: 'East India',
  west: 'West India',
  central: 'Central India',
};

export default function TempleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;
  
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ─── Audio States ───
  const [isAudioVisible, setIsAudioVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef(null);
  const seekBarRef = useRef(null);

  useEffect(() => {
    const fetchTemple = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const result = await getTempleBySlug(slug);
        if (result.success && result.temple) {
          setTemple(result.temple);
          await incrementTempleView(result.temple.id);
        } else {
          toast.error('Temple not found');
          router.push('/temples');
        }
      } catch (error) {
        console.error('Error fetching temple:', error);
        toast.error('Failed to load temple');
      } finally {
        setLoading(false);
      }
    };
    fetchTemple();
  }, [slug, router]);

  // ─── Lazily create the Audio element ───
  const ensureAudio = () => {
    if (audioRef.current || !temple?.voiceoverUrl) return audioRef.current;

    const audio = new Audio(temple.voiceoverUrl);
    audioRef.current = audio;

    audio.onloadedmetadata = () => setDuration(audio.duration);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    audio.onerror = () => {
      setIsPlaying(false);
      toast.error('Failed to play audio');
    };

    return audio;
  };

  // ─── Set up audio as soon as temple loads ───
  useEffect(() => {
    if (temple?.voiceoverUrl) ensureAudio();
  }, [temple]);

  // ─── Cleanup audio on unmount ───
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // ─── Audio Controls ───
  const togglePlay = () => {
    const audio = ensureAudio();
    if (!audio) {
      toast.error('Audio not loaded');
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        toast.error('Failed to play audio');
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const seekToClientX = (clientX) => {
    if (!audioRef.current || !duration || !seekBarRef.current) return;
    const rect = seekBarRef.current.getBoundingClientRect();
    const x = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const newTime = x * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // ─── Drag-to-seek support ───
  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      seekToClientX(clientX);
    };
    const onUp = () => setIsDragging(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging, duration]);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // ─── Open the player AND start playing immediately ───
  const handleListenClick = () => {
    if (!temple?.voiceoverUrl) {
      toast.info('No audio available for this temple yet.');
      return;
    }
    const audio = ensureAudio();
    setIsAudioVisible(true);
    audio?.play().catch(() => {
      toast.error('Failed to play audio');
    });
  };

  // ─── Close audio player ───
  const handleCloseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsAudioVisible(false);
  };

  const handleLike = async () => {
    setLiked(!liked);
    try {
      await toggleTempleLike(temple.id);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleCopy = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `🛕 ${temple.title} - ${temple.shortDescription}`;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`,
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!temple) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
        <p className="text-6xl mb-4">🛕</p>
        <h2 className="text-2xl font-bold text-[#3D2B1A] dark:text-[#F5EAD9] mb-2">
          Temple not found
        </h2>
        <Link
          href="/temples"
          className="px-6 py-2.5 bg-gradient-to-r from-[#E85D04] to-[#F4B400] text-white rounded-full hover:shadow-lg transition-all"
        >
          Browse all temples
        </Link>
      </div>
    );
  }

  const images = (temple.images || []).filter(Boolean);
  const hasImages = images.length > 0;
  const templeTitle = temple.title || 'Temple';
  const progressPct = duration ? (currentTime / duration) * 100 : 0;
  const RING_RADIUS = 21;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
  const ringOffset = RING_CIRCUMFERENCE - (progressPct / 100) * RING_CIRCUMFERENCE;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FBF3E7] dark:bg-[#15100C]">
      {/* Background gradients */}
      <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity"
        style={{
          backgroundImage: `
            radial-gradient(circle at 85% 10%, rgba(244,180,0,0.12) 0%, transparent 45%),
            radial-gradient(circle at 10% 30%, rgba(232,116,44,0.10) 0%, transparent 50%)
          `,
        }}
      />
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity"
        style={{
          backgroundImage: `
            radial-gradient(circle at 85% 10%, rgba(244,180,0,0.15) 0%, transparent 45%),
            radial-gradient(circle at 10% 30%, rgba(232,116,44,0.15) 0%, transparent 50%)
          `,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4"
        >
          <Link
            href="/temples"
            className="group inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-[#241B14]/80 backdrop-blur-sm rounded-full border border-[#F4B400]/20 shadow-sm hover:shadow-md hover:border-[#F4B400]/40 transition-all duration-300 cursor-pointer"
          >
            <FaArrowLeft className="w-4 h-4 text-[#5C4630] dark:text-[#F0E4D3]/60 group-hover:text-[#E8742C] dark:group-hover:text-[#F4B400] transition-colors" />
            <span className="text-sm font-medium text-[#5C4630] dark:text-[#F0E4D3]/80 group-hover:text-[#3D2B1A] dark:group-hover:text-[#F5EAD9] transition-colors">
              Back to Temples
            </span>
          </Link>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/95 dark:bg-[#241B14]/95 backdrop-blur-sm rounded-2xl border border-[#F4B400]/15 dark:border-[#F4B400]/15 overflow-hidden shadow-xl"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-[#F4B400]/10">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🛕</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    temple.featured 
                      ? 'bg-[#F4B400] text-[#3D2B1A]' 
                      : 'bg-[#F4B400]/10 text-[#8C7456] dark:bg-[#F4B400]/20 dark:text-[#CBB89E]'
                  }`}>
                    {temple.featured ? '⭐ Featured' : temple.category}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3D2B1A] dark:text-[#F5EAD9] mt-2">
                  {temple.title}
                </h1>
                {temple.location && (
                  <p className="text-sm text-[#8C7456] dark:text-[#9C8569] mt-1 flex items-center gap-1.5">
                    <FaMapPin className="w-3.5 h-3.5 text-[#E8742C] dark:text-[#FFA45C]" />
                    {temple.location}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm text-[#8C7456] dark:text-[#9C8569]">
                <span className="flex items-center gap-1">
                  <FaEye className="w-3.5 h-3.5" />
                  {temple.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <FaHeart className="w-3.5 h-3.5" />
                  {temple.likes || 0}
                </span>
              </div>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
              {temple.deity && (
                <span className="flex items-center gap-1.5 text-[#6B5640] dark:text-[#B8A088]">
                  <FaBuilding className="w-4 h-4 text-[#E8742C] dark:text-[#FFA45C]" />
                  {temple.deity}
                </span>
              )}
              {temple.established && (
                <span className="flex items-center gap-1.5 text-[#6B5640] dark:text-[#B8A088]">
                  <FaCalendarAlt className="w-4 h-4 text-[#E8742C] dark:text-[#FFA45C]" />
                  {temple.established}
                </span>
              )}
              {temple.category && (
                <span className="flex items-center gap-1.5 text-[#6B5640] dark:text-[#B8A088]">
                  <FaInfoCircle className="w-4 h-4 text-[#E8742C] dark:text-[#FFA45C]" />
                  {categoryNames[temple.category] || temple.category}
                </span>
              )}
            </div>
          </div>

          {/* ─── Images Gallery - Reduced height ─── */}
          {hasImages && (
            <div className="p-4 sm:p-6 border-b border-[#F4B400]/10">
              <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={`${templeTitle} temple image`}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? 'bg-[#F4B400] w-8'
                            : 'bg-white/50 hover:bg-white/80'
                        } cursor-pointer`}
                      />
                    ))}
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <p className="text-xs text-center text-[#8C7456] dark:text-[#9C8569] mt-2">
                  {currentImageIndex + 1} / {images.length}
                </p>
              )}
            </div>
          )}

          {/* ─── LISTEN TO TEMPLE ─── */}
          {temple.voiceoverUrl && (
            <div className="p-4 sm:p-6 border-b border-[#F4B400]/10">
              {!isAudioVisible ? (
                <motion.button
                  onClick={handleListenClick}
                  whileTap={{ scale: 0.97 }}
                  className="relative cursor-pointer inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-[#E85D04] to-[#F4B400] text-white hover:shadow-xl hover:shadow-[#F4B400]/30 transition-shadow duration-300 hover:scale-105"
                >
                  <span
                    className="absolute inset-0 rounded-full bg-[#F4B400]/50 animate-ping"
                    style={{ animationDuration: '2.2s' }}
                    aria-hidden="true"
                  />
                  <FaHeadphones className="relative w-5 h-5" />
                  <span className="relative">
                    {currentTime > 0 ? 'Resume Listening' : 'Listen to Temple'}
                  </span>
                </motion.button>
              ) : (
                <AnimatePresence initial={false}>
                  <motion.div
                    key="audio-player"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="relative p-4 sm:p-5 bg-gradient-to-r from-[#E8742C]/10 to-[#F4B400]/10 dark:from-[#E8742C]/20 dark:to-[#F4B400]/20 rounded-2xl border border-[#F4B400]/20 shadow-sm overflow-hidden">
                      <svg
                        className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
                        preserveAspectRatio="none"
                        viewBox="0 0 400 100"
                        aria-hidden="true"
                      >
                        <path
                          d="M0,50 Q20,10 40,50 T80,50 T120,50 T160,50 T200,50 T240,50 T280,50 T320,50 T360,50 T400,50"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-[#F4B400]"
                        />
                      </svg>

                      <div className="relative flex justify-end mb-2">
                        <button
                          onClick={handleCloseAudio}
                          aria-label="Close audio player and pause"
                          className="p-1.5 rounded-full hover:bg-white/60 dark:hover:bg-[#241B14]/50 transition-colors"
                        >
                          <FaTimes className="w-4 h-4 text-[#5C4630] dark:text-[#F0E4D3]/50" />
                        </button>
                      </div>

                      <div className="relative flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              onClick={togglePlay}
                              aria-label={isPlaying ? 'Pause' : 'Play'}
                              className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center group"
                            >
                              <svg className="absolute inset-0 w-14 h-14 -rotate-90" viewBox="0 0 48 48">
                                <circle
                                  cx="24"
                                  cy="24"
                                  r={RING_RADIUS}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  className="text-[#F4B400]/20"
                                />
                                <circle
                                  cx="24"
                                  cy="24"
                                  r={RING_RADIUS}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeDasharray={RING_CIRCUMFERENCE}
                                  strokeDashoffset={ringOffset}
                                  className="text-[#F4B400] transition-[stroke-dashoffset] duration-150 ease-linear"
                                />
                              </svg>
                              <span className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-r from-[#E85D04] to-[#F4B400] text-white flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-[#F4B400]/30 transition-all group-active:scale-95">
                                {isPlaying ? (
                                  <FaPause className="w-3.5 h-3.5" />
                                ) : (
                                  <FaPlay className="w-3.5 h-3.5 ml-0.5" />
                                )}
                              </span>
                            </button>

                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#3D2B1A] dark:text-[#F5EAD9]/80 truncate">
                                {temple.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-xs text-[#8C7456] dark:text-[#9C8569]">
                                  {isPlaying ? 'Playing' : 'Paused'}
                                </p>
                                {isPlaying && (
                                  <div className="flex items-end gap-0.5 h-2.5" aria-hidden="true">
                                    {[0, 1, 2].map((i) => (
                                      <motion.span
                                        key={i}
                                        className="w-0.5 bg-[#F4B400] rounded-full"
                                        animate={{ height: [3, 10, 4, 9, 3] }}
                                        transition={{
                                          duration: 0.9 + i * 0.15,
                                          repeat: Infinity,
                                          ease: 'easeInOut',
                                        }}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={toggleMute}
                            aria-label={isMuted ? 'Unmute' : 'Mute'}
                            className="p-2.5 rounded-full hover:bg-white/60 dark:hover:bg-[#241B14]/50 transition-colors flex-shrink-0"
                          >
                            {isMuted ? (
                              <FaVolumeMute className="w-4 h-4 text-[#5C4630] dark:text-[#F0E4D3]/50" />
                            ) : (
                              <FaVolumeUp className="w-4 h-4 text-[#5C4630] dark:text-[#F0E4D3]/50" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-[#8C7456] dark:text-[#9C8569] min-w-[36px]">
                            {formatTime(currentTime)}
                          </span>
                          <div
                            ref={seekBarRef}
                            onMouseDown={(e) => {
                              setIsDragging(true);
                              seekToClientX(e.clientX);
                            }}
                            onTouchStart={(e) => {
                              setIsDragging(true);
                              seekToClientX(e.touches[0].clientX);
                            }}
                            className="flex-1 h-1.5 bg-[#F4B400]/20 dark:bg-[#F4B400]/10 rounded-full cursor-pointer relative group touch-none"
                          >
                            <div
                              className="h-full bg-gradient-to-r from-[#E85D04] to-[#F4B400] rounded-full"
                              style={{ width: `${progressPct || 0}%` }}
                            />
                            <div
                              className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#F4B400] rounded-full shadow-md transition-transform ${
                                isDragging ? 'scale-125' : 'scale-100 group-hover:scale-125'
                              }`}
                              style={{ left: `calc(${progressPct || 0}% - 6px)` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-[#8C7456] dark:text-[#9C8569] min-w-[36px]">
                            {formatTime(duration)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )}

          {/* ─── Description & Details ─── */}
          <div className="p-6 sm:p-8">
            {/* Short Description - Stripped of HTML tags */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#3D2B1A] dark:text-[#F5EAD9] mb-3 flex items-center gap-2">
                <FaInfoCircle className="w-5 h-5 text-[#E8742C] dark:text-[#FFA45C]" />
                About this Temple
              </h2>
              <p className="text-[#6B5640] dark:text-[#CBB89E] leading-relaxed">
                {stripHtml(temple.shortDescription)}
              </p>
            </div>

            {/* Full Description - Stripped of HTML tags */}
            {temple.fullDescription && (
              <div className="mb-6">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div className="text-[#6B5640] dark:text-[#CBB89E] leading-relaxed">
                    {stripHtml(temple.fullDescription)}
                  </div>
                </div>
              </div>
            )}

            {/* Significance */}
            {temple.significance && (
              <div className="mt-6 p-4 bg-[#FBF3E7] dark:bg-[#1A130E] rounded-xl border border-[#F4B400]/10">
                <h4 className="text-sm font-semibold text-[#E8742C] dark:text-[#FFA45C] mb-1">
                  ✨ Significance
                </h4>
                <p className="text-sm text-[#6B5640] dark:text-[#B8A088]">
                  {stripHtml(temple.significance)}
                </p>
              </div>
            )}

            {/* Festivals */}
            {temple.festivals && temple.festivals.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-bold text-[#3D2B1A] dark:text-[#F5EAD9] mb-3 flex items-center gap-2">
                  <FaGift className="w-5 h-5 text-[#E8742C] dark:text-[#FFA45C]" />
                  Celebrated Festivals
                </h2>
                <div className="flex flex-wrap gap-2">
                  {temple.festivals.map((festival, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-[#FBF3E7] dark:bg-[#1A130E] rounded-full text-sm text-[#6B5640] dark:text-[#B8A088] border border-[#F4B400]/10"
                    >
                      {festival}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#F4B400]/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer ${
                    liked
                      ? 'border-[#E8742C] bg-[#E8742C]/10 text-[#E8742C]'
                      : 'border-[#F4B400]/20 hover:border-[#E8742C]/30 text-[#6B5640] dark:text-[#CBB89E] hover:bg-[#E8742C]/5'
                  }`}
                >
                  {liked ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
                  {liked ? 'Liked' : 'Like'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8C7456] dark:text-[#9C8569]">Share:</span>
                {/* Facebook instead of Twitter */}
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] transition-colors cursor-pointer"
                  aria-label="Share on Facebook"
                >
                  <FaFacebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="p-2 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-colors cursor-pointer"
                  aria-label="Share on WhatsApp"
                >
                  <FaWhatsapp className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-full bg-[#F4B400]/10 hover:bg-[#F4B400]/20 text-[#F4B400] transition-colors relative cursor-pointer"
                  aria-label="Copy link"
                >
                  {copied ? <FaCheck className="w-4 h-4 text-green-500" /> : <FaCopy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* More Temples Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <Link
            href="/temples"
            className="inline-flex items-center text-sm text-[#E8742C] dark:text-[#F4B400] hover:underline transition-colors group cursor-pointer"
          >
            Browse all temples
            <FaArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
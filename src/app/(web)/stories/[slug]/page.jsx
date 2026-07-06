'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaArrowLeft,
  FaArrowRight,
  FaBookOpen,
  FaCheck,
  FaClock,
  FaCopy,
  FaHeart,
  FaRegHeart,
  FaFacebook,
  FaWhatsapp,
  FaUser,
  FaHeadphones,
  FaPause,
  FaPlay,
  FaVolumeUp,
  FaVolumeMute,
  FaTimes,
} from 'react-icons/fa';
import { getStoryById, getStoryBySlug, incrementStoryViews } from '@/lib/services/storyService';
import { stories as mockStories } from '@/lib/mockStoryData';
import { toast } from 'react-hot-toast';

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storySlug = params?.slug?.toString() || '';

  const [story, setStory] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // ─── Reading progress ───
  const [readProgress, setReadProgress] = useState(0);

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
    const loadStory = async () => {
      setLoading(true);

      try {
        const bySlug = await getStoryBySlug(storySlug);
        if (bySlug.success && bySlug.story) {
          setStory(bySlug.story);
          await incrementStoryViews(bySlug.story.id);
          setLoading(false);
          return;
        }

        const byId = await getStoryById(storySlug);
        if (byId.success && byId.story) {
          setStory(byId.story);
          await incrementStoryViews(byId.story.id);
          setLoading(false);
          return;
        }

        const fallbackStory = mockStories.find((item) => {
          const generatedSlug = slugify(item.title);
          return generatedSlug === storySlug || String(item.id) === storySlug;
        });

        if (fallbackStory) {
          setStory({
            ...fallbackStory,
            id: fallbackStory.id,
            slug: fallbackStory.slug || slugify(fallbackStory.title),
            content: fallbackStory.fullStory || fallbackStory.description,
            description: fallbackStory.description || fallbackStory.fullStory,
            excerpt: fallbackStory.description || fallbackStory.fullStory,
            moral: fallbackStory.moral || '',
            featuredImage: fallbackStory.image || null,
            images: fallbackStory.image ? [fallbackStory.image] : [],
            category: fallbackStory.category || '',
            tags: fallbackStory.tags || [],
            author: fallbackStory.author || 'Aarambh',
            source: fallbackStory.source || 'Spiritual tradition',
            readingTime: fallbackStory.readingTime || 4,
            date: fallbackStory.date || '',
          });
        }
      } catch (error) {
        console.error('Error loading story:', error);
      } finally {
        setLoading(false);
      }
    };

    if (storySlug) {
      loadStory();
    } else {
      setLoading(false);
    }
  }, [storySlug]);

  // ─── Reading progress bar (tracks scroll through the page) ───
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setReadProgress(Math.min(100, Math.max(0, progress)));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Lazily create the Audio element (safe to call multiple times) ───
  const ensureAudio = () => {
    if (audioRef.current || !story?.voiceoverUrl) return audioRef.current;

    const audio = new Audio(story.voiceoverUrl);
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

  // ─── Set up audio as soon as the story with a voiceover loads ───
  useEffect(() => {
    if (story?.voiceoverUrl) ensureAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story]);

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

  // ─── Drag-to-seek support (mouse + touch) ───
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, duration]);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLike = () => setIsLiked((prev) => !prev);

  const handleCopy = async () => {
    if (!story) return;
    const text = `📖 ${story.title}\n\n${story.description || story.excerpt || ''}\n\nRead more at: ${window.location.href}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleShare = (platform) => {
    if (!story) return;
    const url = window.location.href;
    const text = `📖 ${story.title} - ${story.description || story.excerpt || ''}`;
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`,
    };
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
    }
  };

  // ─── Open the player AND start playing immediately, no second click needed ───
  const handleListenClick = () => {
    if (!story?.voiceoverUrl) {
      toast.info('No audio available for this story yet.');
      return;
    }
    const audio = ensureAudio();
    setIsAudioVisible(true);
    audio?.play().catch(() => {
      toast.error('Failed to play audio');
    });
  };

  // ─── Closing the section always pauses playback too ───
  const handleCloseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsAudioVisible(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold border-r-saffron animate-spin" />
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-brown-900 dark:text-cream-50">Story not found</h2>
          <p className="mt-2 text-sm text-brown-500 dark:text-cream-50/50">
            This tale may have moved or doesn&apos;t exist yet.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center mt-6 px-4 py-2 rounded-full bg-saffron/10 hover:bg-saffron/20 text-saffron transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Stories
          </button>
        </div>
      </div>
    );
  }

  const storyImage = story.featuredImage || story.image || story.images?.[0] || '';
  const storyBody = story.content || story.fullStory || '';
  const hasHtmlContent = typeof storyBody === 'string' && /<\/?[a-z][\s\S]*>/i.test(storyBody);
  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  // Circular progress ring geometry for the play/pause button
  const RING_RADIUS = 21;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
  const ringOffset = RING_CIRCUMFERENCE - (progressPct / 100) * RING_CIRCUMFERENCE;

  const getCategoryColor = (category) => {
    const colors = {
      ramayana: 'text-orange-600 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400',
      mahabharata: 'text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400',
      saints: 'text-purple-600 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400',
      parable: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400',
    };
    return colors[category] || 'text-gray-600 bg-gray-50 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      ramayana: '🏹',
      mahabharata: '⚔️',
      saints: '🕉️',
      parable: '💡',
    };
    return emojis[category] || '📖';
  };

  return (
    <>
      {/* ─── Reading progress bar ─── */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-brown-900/5 dark:bg-cream-50/5">
        <div
          className="h-full bg-gradient-to-r from-saffron to-gold transition-[width] duration-150 ease-out"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <div className="min-h-screen py-8 md:py-6 lg:py-8 relative overflow-hidden bg-gradient-to-b from-cream-50/30 via-white to-cream-50/30 dark:from-brown-900/20 dark:via-brown-900 dark:to-brown-900/20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ─── Back Button ─── */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex cursor-pointer items-center text-brown-600 dark:text-cream-50/60 hover:text-saffron transition-colors text-sm group"
            >
              <FaArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Stories
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-brown-800/80 backdrop-blur-sm rounded-2xl border border-gold/20 dark:border-gold/10 shadow-xl overflow-hidden"
          >
            {/* ─── Image Section ─── */}
            <div className="relative w-full overflow-hidden bg-gradient-to-br from-saffron/20 to-gold/20">
              {storyImage ? (
                <div className="relative w-full" style={{ aspectRatio: '19/9' }}>
                  <Image
                    src={storyImage}
                    alt={story.title}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </div>
              ) : (
                <div className="h-[300px] md:h-[400px] lg:h-[450px] w-full flex items-center justify-center bg-gradient-to-br from-saffron/20 to-gold/20">
                  <span className="text-8xl opacity-40">📖</span>
                </div>
              )}

              <div className={`absolute bottom-4 left-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md ${getCategoryColor(story.category)} shadow-lg`}>
                <span>{getCategoryEmoji(story.category)}</span>
                <span className="capitalize">{story.category || 'spiritual'}</span>
              </div>

              <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/40 text-white backdrop-blur-md">
                <FaClock className="w-3 h-3" />
                {story.readingTime || 4} min read
              </div>
            </div>

            {/* ─── Content ─── */}
            <div className="p-6 md:p-8 lg:p-10">
              <div className="mb-6">
                {story.source && (
                  <p className="text-xs font-semibold tracking-wide uppercase text-gold/80 mb-2">
                    From {story.source}
                  </p>
                )}

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brown-900 dark:text-cream-50 mb-3 leading-tight">
                  {story.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-brown-600 dark:text-cream-50/60">
                  <span className="flex items-center space-x-1.5">
                    <FaUser className="w-3.5 h-3.5" />
                    <span>{story.author || 'Aarambh'}</span>
                  </span>
                  <span className="text-brown-300 dark:text-cream-50/20">•</span>
                  <span className="flex items-center space-x-1.5">
                    <FaClock className="w-3.5 h-3.5" />
                    <span>{story.readingTime || 4} min read</span>
                  </span>
                  {story.date ? (
                    <>
                      <span className="text-brown-300 dark:text-cream-50/20">•</span>
                      <span className="flex items-center space-x-1.5">
                        <FaBookOpen className="w-3.5 h-3.5" />
                        <span>{story.date}</span>
                      </span>
                    </>
                  ) : null}
                </div>

                {(story.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {story.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-gold/10 hover:bg-gold/20 text-gold text-xs rounded-full transition-colors"
                      >
                        #{tag.toLowerCase()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ─── LISTEN TO STORY ─── */}
              {story.voiceoverUrl && (
                <div className="mb-6">
                  {!isAudioVisible ? (
                    // ─── Listen Button (Hidden State) ───
                    <motion.button
                      onClick={handleListenClick}
                      whileTap={{ scale: 0.97 }}
                      className="relative cursor-pointer inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-saffron to-gold text-white hover:shadow-xl hover:shadow-saffron/30 transition-shadow duration-300 hover:scale-105"
                    >
                      <span
                        className="absolute inset-0 rounded-full bg-gold/50 animate-ping"
                        style={{ animationDuration: '2.2s' }}
                        aria-hidden="true"
                      />
                      <FaHeadphones className="relative w-5 h-5" />
                      <span className="relative">
                        {currentTime > 0 ? 'Resume Story' : 'Listen to Story'}
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
                        {/* ─── Audio Player (Visible State) ─── */}
                        <div className="relative p-4 sm:p-5 bg-gradient-to-r from-saffron/10 to-gold/10 dark:from-saffron/20 dark:to-gold/20 rounded-2xl border border-gold/20 shadow-sm overflow-hidden">
                          {/* Decorative soundwave texture */}
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
                              className="text-gold"
                            />
                          </svg>

                          <div className="relative flex justify-end mb-2">
                            <button
                              onClick={handleCloseAudio}
                              aria-label="Close audio player and pause"
                              className="p-1.5 rounded-full hover:bg-white/60 dark:hover:bg-brown-800/50 transition-colors"
                            >
                              <FaTimes className="w-4 h-4 text-brown-500 dark:text-cream-50/50" />
                            </button>
                          </div>

                          <div className="relative flex flex-col gap-4">
                            {/* Top row: play control + title/status + volume */}
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Circular progress play/pause button */}
                                <button
                                  onClick={togglePlay}
                                  aria-label={isPlaying ? 'Pause story' : 'Play story'}
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
                                      className="text-gold/20"
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
                                      className="text-gold transition-[stroke-dashoffset] duration-150 ease-linear"
                                    />
                                  </svg>
                                  <span className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-r from-saffron to-gold text-white flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-saffron/30 transition-all group-active:scale-95">
                                    {isPlaying ? (
                                      <FaPause className="w-3.5 h-3.5" />
                                    ) : (
                                      <FaPlay className="w-3.5 h-3.5 ml-0.5" />
                                    )}
                                  </span>
                                </button>

                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-brown-700 dark:text-cream-50/80 truncate">
                                    {story.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <p className="text-xs text-brown-500 dark:text-cream-50/40">
                                      {isPlaying ? 'Playing' : 'Paused'}
                                    </p>
                                    {isPlaying && (
                                      <div className="flex items-end gap-0.5 h-2.5" aria-hidden="true">
                                        {[0, 1, 2].map((i) => (
                                          <motion.span
                                            key={i}
                                            className="w-0.5 bg-gold rounded-full"
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
                                className="p-2.5 rounded-full hover:bg-white/60 dark:hover:bg-brown-800/50 transition-colors flex-shrink-0"
                              >
                                {isMuted ? (
                                  <FaVolumeMute className="w-4 h-4 text-brown-500 dark:text-cream-50/50" />
                                ) : (
                                  <FaVolumeUp className="w-4 h-4 text-brown-500 dark:text-cream-50/50" />
                                )}
                              </button>
                            </div>

                            {/* Seek bar */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-brown-500 dark:text-cream-50/50 min-w-[36px]">
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
                                className="flex-1 h-1.5 bg-gold/20 dark:bg-gold/10 rounded-full cursor-pointer relative group touch-none"
                              >
                                <div
                                  className="h-full bg-gradient-to-r from-saffron to-gold rounded-full"
                                  style={{ width: `${progressPct || 0}%` }}
                                />
                                <div
                                  className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-gold rounded-full shadow-md transition-transform ${
                                    isDragging ? 'scale-125' : 'scale-100 group-hover:scale-125'
                                  }`}
                                  style={{ left: `calc(${progressPct || 0}% - 6px)` }}
                                />
                              </div>
                              <span className="text-xs font-mono text-brown-500 dark:text-cream-50/50 min-w-[36px]">
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

              {/* ─── Description ─── */}
              <div className="mb-6 p-4 bg-cream-50 dark:bg-brown-900/50 rounded-xl border border-gold/10 relative">
                <span className="absolute top-2 left-3 text-4xl text-gold/20 font-serif leading-none select-none">
                  &ldquo;
                </span>
                <p className="text-sm text-brown-700 dark:text-cream-50/80 italic leading-relaxed pl-4">
                  {story.description || story.excerpt || ''}
                </p>
              </div>

              {/* ─── Story Content - Enhanced for Hindi ─── */}
              <div className="prose prose-brown dark:prose-invert max-w-none">
                {hasHtmlContent ? (
                  <div
                    className="text-brown-800 dark:text-cream-50/90 leading-[2.4] tracking-wide text-base md:text-lg font-serif"
                    style={{
                      fontFamily: "'Noto Serif Devanagari', 'Mangal', 'Krishna', serif",
                      wordSpacing: '0.15em',
                      lineHeight: '2.4',
                      letterSpacing: '0.02em',
                    }}
                    dangerouslySetInnerHTML={{ __html: storyBody }}
                  />
                ) : (
                  <div
                    className="text-brown-800 dark:text-cream-50/90 leading-[2.4] tracking-wide text-base md:text-lg font-serif whitespace-pre-line"
                    style={{
                      fontFamily: "'Noto Serif Devanagari', 'Mangal', 'Krishna', serif",
                      wordSpacing: '0.15em',
                      lineHeight: '2.4',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {storyBody}
                  </div>
                )}
              </div>

              {/* ─── Moral ─── */}
              {story.moral && (
                <div className="mt-8 p-6 bg-gradient-to-r from-saffron/10 to-gold/10 dark:from-saffron/20 dark:to-gold/20 rounded-xl border-l-4 border-gold">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl flex-shrink-0">✨</span>
                    <div>
                      <h3 className="text-sm font-semibold text-gold tracking-wide uppercase">
                        Moral of the Story
                      </h3>
                      <p
                        className="text-sm text-brown-700 dark:text-cream-50/80 mt-1 leading-relaxed"
                        style={{
                          fontFamily: "'Noto Serif Devanagari', 'Mangal', 'Krishna', serif",
                          lineHeight: '1.8',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {story.moral}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Action Buttons ─── */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gold/10">
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={handleLike}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-saffron/10 hover:bg-saffron/20 dark:bg-saffron/20 dark:hover:bg-saffron/30 transition-colors"
                  >
                    {isLiked ? (
                      <FaHeart className="w-4 h-4 text-divine-red animate-pulse" />
                    ) : (
                      <FaRegHeart className="w-4 h-4 text-brown-600 dark:text-cream-50/60" />
                    )}
                    <span className="text-sm font-medium text-brown-700 dark:text-cream-50">
                      {isLiked ? 'Liked' : 'Like'}
                    </span>
                  </motion.button>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-brown-500 dark:text-cream-50/40">Share:</span>
                  <button
                    onClick={() => handleShare('facebook')}
                    aria-label="Share on Facebook"
                    className="p-2 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] transition-colors"
                  >
                    <FaFacebook className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    aria-label="Share on WhatsApp"
                    className="p-2 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-colors"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopy}
                    aria-label="Copy story link"
                    className="p-2 rounded-full bg-gold/10 hover:bg-gold/20 text-gold transition-colors relative"
                  >
                    {copied ? <FaCheck className="w-4 h-4 text-green-500" /> : <FaCopy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── Footer ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-brown-500 dark:text-cream-50/40">
              Enjoyed this story? Explore more inspiring tales in our{' '}
              <Link href="/stories" className="text-gold hover:text-saffron transition-colors">
                Story Library
              </Link>
            </p>
            <Link
              href="/stories"
              className="inline-flex items-center mt-3 text-sm text-gold hover:text-saffron transition-colors group"
            >
              Browse All Stories
              <FaArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, Play, Sparkles, Volume2, VolumeX, Pause, Music } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

// Fixed positions — reduced for mobile
const SANSKRIT_SYMBOLS = [
  { text: 'ॐ',       top: '10%', left: '60%',  size: '1.6rem', dur: 14, delay: 0   },
  { text: 'श्री',     top: '18%', left: '82%',  size: '1.2rem', dur: 18, delay: 1.5 },
  { text: 'गणेश',    top: '42%', left: '92%',  size: '1.1rem', dur: 16, delay: 3   },
  { text: 'सरस्वती', top: '68%', left: '48%',  size: '1rem',   dur: 20, delay: 0.8 },
  { text: 'कृष्ण',   top: '30%', left: '72%',  size: '1.3rem', dur: 13, delay: 2.5 },
  { text: 'शिव',     top: '75%', left: '76%',  size: '1.1rem', dur: 17, delay: 4   },
  { text: 'राम',     top: '55%', left: '62%',  size: '1.2rem', dur: 15, delay: 1   },
  { text: 'हरि',     top: '85%', left: '35%',  size: '1rem',   dur: 19, delay: 2   },
];

const MOBILE_SANSKRIT_SYMBOLS = [
  { text: 'ॐ',   top: '12%', left: '75%', size: '1.2rem', dur: 14, delay: 0   },
  { text: 'श्री', top: '25%', left: '88%', size: '0.9rem', dur: 18, delay: 1.5 },
  { text: 'गणेश', top: '55%', left: '85%', size: '0.8rem', dur: 16, delay: 3   },
  { text: 'राम',  top: '70%', left: '65%', size: '0.9rem', dur: 15, delay: 1   },
  { text: 'शिव',  top: '40%', left: '92%', size: '0.8rem', dur: 17, delay: 4   },
];

// ============ DEFAULT VALUES (Fallback) ============
const DEFAULT_VALUES = {
  headingLine1: 'Begin Every Day',
  headingLine2: 'with Divine Wisdom',
  tagline: 'आरम्भः सर्वकार्येषु मङ्गलाचरणम्',
  ctaText: 'Explore Now',
  ctaLink: '/stories',
  desktopImage: '/Herocopy1.png',
  desktopVideo: '',
  mobileImage: '/MobHerobanner3.png',
  mobileVideo: '',
  mantra: 'ॐ नमः शिवाय',
  mantraTranslation: 'I bow to Lord Shiva',
  songUrl: '/music.mpeg',
  songAutoPlay: true,
};

const resolveHeroContent = (heroData = {}, mantraData = {}, songData = {}) => {
  const headingLine1 =
    heroData.headingLine1?.trim() ||
    heroData.titleLine1?.trim() ||
    heroData.primaryHeading?.trim() ||
    heroData.heading?.trim() ||
    DEFAULT_VALUES.headingLine1;

  const headingLine2 =
    heroData.headingLine2?.trim() ||
    heroData.titleLine2?.trim() ||
    heroData.accentHeading?.trim() ||
    DEFAULT_VALUES.headingLine2;

  const songUrl = songData.url?.trim() || songData.songUrl?.trim() || DEFAULT_VALUES.songUrl;

  return {
    headingLine1,
    headingLine2,
    tagline: heroData.tagline?.trim() || DEFAULT_VALUES.tagline,
    ctaText: heroData.ctaText?.trim() || DEFAULT_VALUES.ctaText,
    ctaLink: heroData.ctaLink?.trim() || DEFAULT_VALUES.ctaLink,
    desktopImage: heroData.desktopImage?.trim() || DEFAULT_VALUES.desktopImage,
    desktopVideo: heroData.desktopVideo?.trim() || '',
    mobileImage: heroData.mobileImage?.trim() || DEFAULT_VALUES.mobileImage,
    mobileVideo: heroData.mobileVideo?.trim() || '',
    mantra: mantraData.text?.trim() || DEFAULT_VALUES.mantra,
    mantraTranslation: mantraData.translation?.trim() || DEFAULT_VALUES.mantraTranslation,
    songUrl: songUrl,
    songAutoPlay: songData.isPlaying !== undefined ? songData.isPlaying : DEFAULT_VALUES.songAutoPlay,
  };
};

export default function HeroSection() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const desktopVideoRef = useRef(null);
  const mobileVideoRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animIdRef = useRef(null);

  // ============ STATE ============
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [content, setContent] = useState(DEFAULT_VALUES);
  const [loading, setLoading] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isDesktopVideoLoaded, setIsDesktopVideoLoaded] = useState(false);
  const [isMobileVideoLoaded, setIsMobileVideoLoaded] = useState(false);

  // ============ FETCH DYNAMIC CONTENT ============
  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const heroDoc = await getDoc(doc(db, 'dailyContent', 'hero'));
        const mantraDoc = await getDoc(doc(db, 'dailyContent', 'mantra'));
        const songDoc = await getDoc(doc(db, 'dailyContent', 'song'));

        const heroData = heroDoc.exists() ? heroDoc.data() : {};
        const mantraData = mantraDoc.exists() ? mantraDoc.data() : {};
        const songData = songDoc.exists() ? songDoc.data() : {};

        setContent(resolveHeroContent(heroData, mantraData, songData));
      } catch (error) {
        console.error('Error fetching hero content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  // ============ MOBILE CHECK ============
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ============ AUDIO CONTROLS ============
  const togglePlay = () => {
    if (!audioRef.current || !content.songUrl || audioError) return;

    if (audioRef.current.paused) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setHasUserInteracted(true);
        })
        .catch((err) => {
          console.error('Play error:', err);
          setIsPlaying(false);
          setAudioError(true);
        });
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // ============ ATTEMPT AUTOPLAY ON LOAD ============
  useEffect(() => {
    if (!content.songAutoPlay || !content.songUrl || audioError || loading) return;
    if (!audioRef.current) return;
    if (hasUserInteracted) return;

    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setHasUserInteracted(true);
      })
      .catch((err) => {
        console.warn('Autoplay blocked, waiting for interaction:', err);
      });
  }, [content.songUrl, content.songAutoPlay, loading, audioError, hasUserInteracted]);

  // ============ AUTO-PLAY ON USER INTERACTION (fallback) ============
  useEffect(() => {
    if (!content.songAutoPlay || audioError) return;
    if (!content.songUrl || hasUserInteracted) return;

    const handleHeroClick = (e) => {
      const heroElement = document.querySelector('.hero-section-container');
      if (!heroElement) return;

      const target = e.target;
      if (heroElement.contains(target) && !target.closest('button') && !target.closest('a')) {
        if (audioRef.current && !isPlaying && content.songUrl && !hasUserInteracted && !audioError) {
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
              setHasUserInteracted(true);
            })
            .catch((err) => {
              console.error('Auto-play error:', err);
              setAudioError(true);
            });
          document.removeEventListener('click', handleHeroClick);
        }
      }
    };

    document.addEventListener('click', handleHeroClick);

    return () => {
      document.removeEventListener('click', handleHeroClick);
    };
  }, [content.songUrl, content.songAutoPlay, isPlaying, hasUserInteracted, audioError]);

  // ============ PARTICLE CANVAS EFFECT ============
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const section = canvas.parentElement;
    const onMove = (e) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);

    const isMobileView = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobileView ? 60 : 100;
    const INFLUENCE_RADIUS = isMobileView ? 80 : 130;
    const REPEL_STRENGTH = isMobileView ? 2.5 : 4;
    const PARTICLE_SIZE_MIN = isMobileView ? 1.0 : 1.2;
    const PARTICLE_SIZE_MAX = isMobileView ? 2.4 : 2.8;

    class Particle {
      constructor() {
        this.ox = Math.random() * canvas.width;
        this.oy = Math.random() * canvas.height;
        this.x = this.ox;
        this.y = this.oy;
        this.vx = 0;
        this.vy = 0;
        this.size = Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN;
        this.baseOp = Math.random() * 0.25 + 0.10;
        this.op = this.baseOp;
        this.dx = (Math.random() - 0.5) * 0.15;
        this.dy = (Math.random() - 0.5) * 0.15;
      }

      update() {
        const { x: mx, y: my } = mouseRef.current;
        const ddx = this.x - mx;
        const ddy = this.y - my;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);

        if (dist < INFLUENCE_RADIUS && dist > 0) {
          const force = (INFLUENCE_RADIUS - dist) / INFLUENCE_RADIUS;
          this.vx += (ddx / dist) * force * REPEL_STRENGTH;
          this.vy += (ddy / dist) * force * REPEL_STRENGTH;
          this.op = Math.min(0.85, this.baseOp + force * 0.5);
        } else {
          this.vx += (this.ox - this.x) * 0.04;
          this.vy += (this.oy - this.y) * 0.04;
          this.op += (this.baseOp - this.op) * 0.06;
        }

        this.ox += this.dx;
        this.oy += this.dy;
        if (this.ox < 0 || this.ox > canvas.width) this.dx *= -1;
        if (this.oy < 0 || this.oy > canvas.height) this.dy *= -1;

        this.vx *= 0.87;
        this.vy *= 0.87;
        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.op;
        const g = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2.5
        );
        g.addColorStop(0, 'rgba(255,220,70,1)');
        g.addColorStop(0.4, 'rgba(255,180,30,0.6)');
        g.addColorStop(1, 'rgba(255,140,10,0)');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.restore();
      }
    }

    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animIdRef.current);
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // ============ RENDER ============
  const symbols = isMobile ? MOBILE_SANSKRIT_SYMBOLS : SANSKRIT_SYMBOLS;

  const {
    headingLine1,
    headingLine2,
    tagline,
    ctaText,
    ctaLink,
    desktopImage,
    desktopVideo,
    mobileImage,
    mobileVideo,
    mantra,
    mantraTranslation,
    songUrl,
  } = content;

  // Determine which media to show for desktop and mobile
  // Video takes priority over image for each device
  const hasDesktopVideo = desktopVideo && desktopVideo.trim() !== '';
  const hasDesktopImage = desktopImage && desktopImage.trim() !== '';
  const hasMobileVideo = mobileVideo && mobileVideo.trim() !== '';
  const hasMobileImage = mobileImage && mobileImage.trim() !== '';

  const showDesktopVideo = hasDesktopVideo;
  const showDesktopImage = !hasDesktopVideo && hasDesktopImage;
  const showMobileVideo = hasMobileVideo;
  const showMobileImage = !hasMobileVideo && hasMobileImage;

  const hasValidAudio = songUrl && songUrl.trim() !== '';

  return (
    <section
      className="hero-section-container relative flex items-center overflow-hidden"
      style={{ height: isMobile ? 'clamp(520px, 75vh, 600px)' : 'clamp(480px, 98vh, 680px)' }}
    >
      {/* ── Desktop Background Video ── */}
      {!isMobile && showDesktopVideo && (
        <video
          ref={desktopVideoRef}
          src={desktopVideo}
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsDesktopVideoLoaded(true)}
        />
      )}

      {/* ── Mobile Background Video ── */}
      {isMobile && showMobileVideo && (
        <video
          ref={mobileVideoRef}
          src={mobileVideo}
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsMobileVideoLoaded(true)}
        />
      )}

      {/* ── Desktop Background Image (fallback if no desktop video) ── */}
      {!isMobile && showDesktopImage && !showDesktopVideo && (
        <div className="absolute inset-0 z-0">
          <Image
            src={desktopImage}
            alt="Aarambh TV – Divine Spiritual Background"
            fill
            priority
            className="object-cover object-top"
            quality={100}
            onError={(e) => {
              e.target.src = '/Herocopy1.png';
            }}
          />
        </div>
      )}

      {/* ── Mobile Background Image (fallback if no mobile video) ── */}
      {isMobile && showMobileImage && !showMobileVideo && (
        <div className="absolute inset-0 z-0">
          <Image
            src={mobileImage}
            alt="Aarambh TV – Divine Spiritual Background"
            fill
            priority
            className="object-cover object-top"
            quality={100}
            onError={(e) => {
              e.target.src = '/MobHerobanner3.png';
            }}
          />
        </div>
      )}

      {/* ── Fallback if no media for current device ── */}
      {!isMobile && !showDesktopVideo && !showDesktopImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src="/Herocopy1.png"
            alt="Aarambh TV – Divine Spiritual Background"
            fill
            priority
            className="object-cover object-top"
            quality={100}
          />
        </div>
      )}

      {isMobile && !showMobileVideo && !showMobileImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src="/MobHerobanner3.png"
            alt="Aarambh TV – Divine Spiritual Background"
            fill
            priority
            className="object-cover object-top"
            quality={100}
          />
        </div>
      )}

      {/* Overlay gradient */}
      <div className={`absolute inset-0 z-[1] ${isMobile ? 'bg-gradient-to-r from-black/70 via-black/30 to-transparent' : 'bg-gradient-to-r from-black/50 via-black/20 to-transparent'}`} />

      {/* ── Particle canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-[2]"
        style={{ pointerEvents: 'none' }}
      />

      {/* ── Floating Sanskrit symbols ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[3]">
        {symbols.map(({ text, top, left, size, dur, delay }, i) => (
          <motion.span
            key={i}
            className="absolute select-none"
            style={{
              top,
              left,
              fontFamily: "'Noto Serif Devanagari', 'Mangal', serif",
              fontSize: size,
              fontWeight: 600,
              lineHeight: 1,
              color: isMobile ? 'rgba(255,210,60,0.5)' : 'rgba(255,210,60,0.75)',
              textShadow: isMobile
                ? '0 0 8px rgba(255,190,30,0.5)'
                : '0 0 12px rgba(255,190,30,0.9), 0 0 30px rgba(255,170,0,0.4)',
              filter: isMobile
                ? 'drop-shadow(0 0 2px rgba(255,200,50,0.3))'
                : 'drop-shadow(0 0 4px rgba(255,200,50,0.6))',
            }}
            animate={{
              y: [0, -12, 6, 0],
              x: [0, 8, -4, 0],
              opacity: isMobile ? [0.4, 0.7, 0.4] : [0.55, 0.90, 0.60, 0.55],
            }}
            transition={{
              duration: dur,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {text}
          </motion.span>
        ))}
      </div>

      {/* ── Audio Player Controls - Enhanced Visibility ── */}
      {hasValidAudio && !audioError && (
        <div className={`absolute ${isMobile ? 'top-4 right-4' : 'top-6 right-6'} z-20 flex items-center gap-3`}>
          {/* Music Status Badge - Glowing */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/30 to-amber-500/30 backdrop-blur-md border border-orange-400/40 shadow-[0_0_30px_rgba(255,165,0,0.25)]">
            <div className="relative">
              <Music className="w-3.5 h-3.5 text-orange-400" />
              <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            </div>
            <span className="text-[11px] text-white/90 font-medium tracking-wide">
              {isPlaying ? 'Divine Music' : 'Paused'}
            </span>
          </div>

          {/* Play/Pause Button - High-visibility, animated */}
          <button
            onClick={togglePlay}
            className={`relative ${isMobile ? 'p-3' : 'p-3.5'} rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-[0_0_25px_rgba(251,146,60,0.7)] hover:shadow-[0_0_45px_rgba(251,146,60,0.9)] transition-all duration-300 hover:scale-110 active:scale-95 group`}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            {/* Attention-grabbing ping ring — only before the user has ever interacted */}
            {!hasUserInteracted && !isPlaying && (
              <span className="absolute inset-0 rounded-full ring-4 ring-yellow-300/70 animate-ping" />
            )}

            {/* Spinning dashed ring — active only while playing, vinyl-style cue */}
            <span
              className={`absolute -inset-1 rounded-full border-2 border-dashed border-yellow-200/80 ${
                isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''
              }`}
            />

            {isPlaying ? (
              <Pause className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] relative z-10`} />
            ) : (
              <Play className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-white ml-0.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] relative z-10`} />
            )}
          </button>

          {/* Mute/Unmute Button - Enhanced */}
          <button
            onClick={toggleMute}
            className={`${isMobile ? 'p-3' : 'p-3.5'} rounded-full bg-white/10 backdrop-blur-md border ${isMuted ? 'border-red-400/30' : 'border-white/20'} shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.2)] hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95 group`}
            aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          >
            {isMuted ? (
              <VolumeX className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-red-400 drop-shadow-[0_2px_10px_rgba(255,0,0,0.3)] relative z-10`} />
            ) : (
              <Volume2 className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-orange-400 drop-shadow-[0_2px_10px_rgba(255,165,0,0.3)] relative z-10`} />
            )}
          </button>
        </div>
      )}

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-8xl mx-auto px-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={isMobile ? 'max-w-full py-4' : 'max-w-xl'}
        >
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className={`font-bold leading-[1.1] ${isMobile ? 'mb-5' : 'mb-4'}`}
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: isMobile ? 'clamp(1.8rem, 7vw, 2.4rem)' : 'clamp(2rem, 4vw, 3.2rem)',
            }}
          >
            <span
              className="text-white block"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            >
              {headingLine1}
            </span>
            {headingLine2 && (
              <span
                className="block mt-1.5"
                style={{
                  background: 'linear-gradient(95deg, #FFD700 0%, #FF8C00 55%, #FFD700 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {headingLine2}
              </span>
            )}
          </motion.h1>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            className={isMobile ? 'mb-5' : 'mb-5'}
          >
            <p
              className="italic"
              style={{
                fontFamily: "'Noto Serif Devanagari', 'Mangal', serif",
                fontSize: isMobile ? 'clamp(1rem, 3.5vw, 1.2rem)' : 'clamp(1rem, 1.6vw, 1.2rem)',
                color: 'rgba(255,210,60,0.90)',
                textShadow: '0 1px 10px rgba(255,170,0,0.35)',
                lineHeight: 1.5,
              }}
            >
              {tagline}
            </p>
          </motion.div>

          {/* Feature chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.46 }}
            className={`flex flex-wrap gap-2 ${isMobile ? 'mb-5' : 'mb-6'}`}
          >
            {isMobile
              ? ['Bhajans', 'Temples', 'Horoscope', 'Festivals'].map((item) => (
                  <span
                    key={item}
                    className="text-[11px] px-2.5 py-1 font-medium text-white/80 rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.09)',
                      border: '1px solid rgba(255,255,255,0.16)',
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    {item}
                  </span>
                ))
              : ['Panchang', 'Bhajans', 'Temples', 'Horoscope', 'Festivals'].map((item) => (
                  <span
                    key={item}
                    className="text-[11px] px-2.5 py-0.5 font-medium text-white/80 rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.09)',
                      border: '1px solid rgba(255,255,255,0.16)',
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    {item}
                  </span>
                ))
            }
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className={`flex ${isMobile ? 'flex-nowrap gap-2 mb-5' : 'flex-wrap gap-3 mb-6'}`}
          >
            <Link
              href={ctaLink}
              className={`group inline-flex items-center gap-1.5 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
                isMobile ? 'px-3 py-2.5 text-xs flex-1 justify-center' : 'px-5 py-2.5 text-base'
              }`}
              style={{
                background: 'linear-gradient(135deg, #D94F0A 0%, #F4B400 100%)',
                color: '#fff',
                boxShadow: '0 4px 22px rgba(244,160,0,0.50)',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                letterSpacing: '0.03em',
              }}
            >
              {ctaText}
              <ChevronRight className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} group-hover:translate-x-1 transition-transform`} />
            </Link>

            <Link
              href="/spiritual-videos"
              className={`group inline-flex items-center gap-1.5 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
                isMobile ? 'px-3 py-2.5 text-xs flex-1 justify-center' : 'px-5 py-2.5 text-base'
              }`}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                border: '1.5px solid rgba(255,210,60,0.55)',
                backdropFilter: 'blur(8px)',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                letterSpacing: '0.03em',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,210,60,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <Play className={`${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill-current`} style={{ color: '#F4B400' }} />
              Watch Videos
            </Link>
          </motion.div>

          {/* Mantra of the day */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.72 }}
            className={`inline-flex items-center gap-3 ${isMobile ? 'px-4 py-3' : 'px-5 py-3.5'} rounded-xl relative`}
            style={{
              background: 'rgba(10,5,0,0.38)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,210,60,0.22)',
            }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'radial-gradient(circle at center, rgba(255,215,0,0.08), transparent 70%)',
              }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative z-10">
              <p className={`${isMobile ? 'text-[8px]' : 'text-[9px]'} text-white/45 uppercase tracking-[0.18em] mb-2 flex items-center gap-1`}>
                <Sparkles className={`${isMobile ? 'w-3 h-3' : 'w-2.5 h-2.5'} text-gold`} />
                Mantra of the Day
              </p>
              <motion.p
                style={{
                  fontFamily: "'Noto Serif Devanagari', 'Mangal', serif",
                  fontSize: isMobile ? 'clamp(1rem, 3.5vw, 1.15rem)' : '1.05rem',
                  color: '#FFD700',
                  textShadow: '0 0 16px rgba(255,215,0,0.55)',
                  lineHeight: 1.4,
                }}
                animate={{ opacity: [0.72, 1, 0.72] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                {mantra}
              </motion.p>
              <p className={`${isMobile ? 'text-[8px]' : 'text-[9px]'} text-white/40 mt-1`}>
                "{mantraTranslation}"
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Bottom gradient ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[3]"
        style={{
          height: isMobile ? '8px' : '12px',
          background:
            'linear-gradient(to top, #fdf6ec 0%, rgba(253,246,236,0.85) 30%, rgba(253,246,236,0.40) 65%, transparent 100%)',
        }}
      />

      {/* ── Visualizer Bars ── */}
      {!isMobile && isPlaying && !isMuted && !audioError && (
        <div className="absolute bottom-20 right-8 z-10 hidden sm:flex items-end gap-0.5 h-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-orange-400/60 rounded-full"
              animate={{
                height: [4, 8 + Math.random() * 12, 4],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 0.6 + Math.random() * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Hidden Audio Element ── */}
      {hasValidAudio && !audioError && (
        <audio
          ref={audioRef}
          src={songUrl}
          loop
          preload="auto"
          onError={() => setAudioError(true)}
          onLoadedData={() => {
            // Audio is ready
          }}
        />
      )}
    </section>
  );
}
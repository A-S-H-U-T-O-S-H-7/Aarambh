'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, Play, Sparkles, Volume2, VolumeX, Pause, Music } from 'lucide-react';

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

// Mobile version - fewer symbols, smaller, more subtle
const MOBILE_SANSKRIT_SYMBOLS = [
  { text: 'ॐ',   top: '12%', left: '75%', size: '1.2rem', dur: 14, delay: 0   },
  { text: 'श्री', top: '25%', left: '88%', size: '0.9rem', dur: 18, delay: 1.5 },
  { text: 'गणेश', top: '55%', left: '85%', size: '0.8rem', dur: 16, delay: 3   },
  { text: 'राम',  top: '70%', left: '65%', size: '0.9rem', dur: 15, delay: 1   },
  { text: 'शिव',  top: '40%', left: '92%', size: '0.8rem', dur: 17, delay: 4   },
];

export default function HeroSection() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const animIdRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Audio controls
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Auto-play on load (with user interaction requirement)
  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      document.removeEventListener('click', playAudio);
    };
    document.addEventListener('click', playAudio);
    return () => document.removeEventListener('click', playAudio);
  }, []);

  // Particle canvas effect - optimized for mobile
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.parentElement.offsetWidth;
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

    // Mobile optimized values
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
        this.x  = this.ox;
        this.y  = this.oy;
        this.vx = 0;
        this.vy = 0;
        this.size   = Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN;
        this.baseOp = Math.random() * 0.25 + 0.10;
        this.op     = this.baseOp;
        this.dx     = (Math.random() - 0.5) * 0.15;
        this.dy     = (Math.random() - 0.5) * 0.15;
      }

      update() {
        const { x: mx, y: my } = mouseRef.current;
        const ddx  = this.x - mx;
        const ddy  = this.y - my;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);

        if (dist < INFLUENCE_RADIUS && dist > 0) {
          const force = (INFLUENCE_RADIUS - dist) / INFLUENCE_RADIUS;
          this.vx += (ddx / dist) * force * REPEL_STRENGTH;
          this.vy += (ddy / dist) * force * REPEL_STRENGTH;
          this.op  = Math.min(0.85, this.baseOp + force * 0.5);
        } else {
          this.vx += (this.ox - this.x) * 0.04;
          this.vy += (this.oy - this.y) * 0.04;
          this.op  += (this.baseOp - this.op) * 0.06;
        }

        this.ox += this.dx;
        this.oy += this.dy;
        if (this.ox < 0 || this.ox > canvas.width)  this.dx *= -1;
        if (this.oy < 0 || this.oy > canvas.height) this.dy *= -1;

        this.vx *= 0.87;
        this.vy *= 0.87;
        this.x  += this.vx;
        this.y  += this.vy;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.op;
        const g = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2.5
        );
        g.addColorStop(0,   'rgba(255,220,70,1)');
        g.addColorStop(0.4, 'rgba(255,180,30,0.6)');
        g.addColorStop(1,   'rgba(255,140,10,0)');
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

  // Get symbols based on device
  const symbols = isMobile ? MOBILE_SANSKRIT_SYMBOLS : SANSKRIT_SYMBOLS;

  return (
    <section
      className="relative flex items-center overflow-hidden"
      style={{ height: 'clamp(480px, 68vh, 680px)' }}
    >
      {/* ── Hidden Audio Player ── */}
      <audio
        ref={audioRef}
        src="/music.mpeg"
        loop
        preload="auto"
        onLoadedData={() => setIsLoaded(true)}
      />

      {/* ── Background image ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src={isMobile ? "/MobHerobanner3.png" : "/Herocopy1.png"}
          alt="Aarambh TV – Divine Spiritual Background"
          fill
          priority
          className="object-cover object-top"
          quality={100}
        />
        {/* Overlay for better text readability - lighter on mobile */}
        <div className={`absolute inset-0 ${isMobile ? 'bg-gradient-to-r from-black/50 via-black/30 to-transparent' : 'bg-gradient-to-r from-black/40 via-black/20 to-transparent'}`} />
      </div>

      {/* ── Particle canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-[1]"
        style={{ pointerEvents: 'none' }}
      />

      {/* ── Floating Sanskrit symbols ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
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
              y:       [0, -12, 6, 0],
              x:       [0,  8, -4, 0],
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

      {/* ── Audio Player Controls ── */}
      <div className={`absolute ${isMobile ? 'top-3 right-3' : 'top-4 right-4'} z-20 flex items-center gap-2`}>
        {/* Music Status Badge - hidden on mobile */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/10">
          <Music className="w-3 h-3 text-gold animate-pulse" />
          <span className="text-[10px] text-white/70 font-medium">Divine Music</span>
        </div>

        {/* Play/Pause Button - smaller on mobile */}
        <button
          onClick={togglePlay}
          className={`${isMobile ? 'p-2' : 'p-2.5'} rounded-full bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-all hover:scale-105 active:scale-95`}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <Pause className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-white`} />
          ) : (
            <Play className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-white ml-0.5`} />
          )}
        </button>

        {/* Mute/Unmute Button - smaller on mobile */}
        <button
          onClick={toggleMute}
          className={`${isMobile ? 'p-2' : 'p-2.5'} rounded-full bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-all hover:scale-105 active:scale-95`}
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
        >
          {isMuted ? (
            <VolumeX className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-white/50`} />
          ) : (
            <Volume2 className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-white`} />
          )}
        </button>
      </div>

      {/* ── Content ── */}
      <div className="relative  z-10 w-full max-w-8xl mx-auto px-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={isMobile ? 'max-w-full' : 'max-w-xl'}
        >
          {/* Headline - smaller on mobile */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="font-bold leading-[1.1] mb-3"
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: isMobile ? 'clamp(1.8rem, 8vw, 2.4rem)' : 'clamp(2rem, 4.2vw, 3.4rem)',
            }}
          >
            <span
              className="text-white"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            >
              Begin Every Day
            </span>
            <br />
            <span
              style={{
                background: 'linear-gradient(95deg, #FFD700 0%, #FF8C00 55%, #FFD700 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              with Divine Wisdom
            </span>
          </motion.h1>

          {/* Sanskrit verse - smaller on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            className={`${isMobile ? 'mb-3' : 'mb-4'}`}
          >
            <p
              className="italic"
              style={{
                fontFamily: "'Noto Serif Devanagari', 'Mangal', serif",
                fontSize: isMobile ? 'clamp(0.9rem, 1.6vw, 1.15rem)' : 'clamp(0.9rem, 1.6vw, 1.15rem)',
                color: 'rgba(255,210,60,0.85)',
                textShadow: '0 1px 10px rgba(255,170,0,0.35)',
                lineHeight: 1.5,
              }}
            >
              "आरम्भः सर्वकार्येषु मङ्गलाचरणम्"
            </p>
          </motion.div>

          {/* Feature chips - fewer on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.46 }}
            className="flex flex-wrap gap-1.5 mb-6"
          >
            {(isMobile ? ['Panchang', 'Bhajans', 'Temples','Horoscope','Festivals'] : ['Panchang', 'Bhajans', 'Temples', 'Horoscope', 'Festivals']).map((item) => (
              <span
                key={item}
                className={`${isMobile ? 'text-[12px] px-1 py-1' : 'text-[11px] px-2.5 py-0.5'} font-medium text-white/80 rounded-full`}
                style={{
                  background: 'rgba(255,255,255,0.09)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                {item}
              </span>
            ))}
          </motion.div>

          {/* CTAs - smaller on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-wrap gap-3 mb-6"
          >
            <Link
              href="#explore"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #D94F0A 0%, #F4B400 100%)',
                color: '#fff',
                boxShadow: '0 4px 22px rgba(244,160,0,0.50)',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: isMobile ? '0.9rem' : '1.05rem',
                letterSpacing: '0.03em',
                padding: isMobile ? '8px 16px' : '8px 16px',
              }}
            >
              Explore Now
              <ChevronRight className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} group-hover:translate-x-1 transition-transform`} />
            </Link>

            <Link
              href="/spiritual-videos"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                border: '1.5px solid rgba(255,210,60,0.55)',
                backdropFilter: 'blur(8px)',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: isMobile ? '0.9rem' : '1.05rem',
                letterSpacing: '0.03em',
                padding: isMobile ? '8px 16px' : '8px 16px',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,210,60,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <Play className={`${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} fill-current`} style={{ color: '#F4B400' }} />
              Watch Videos
            </Link>
          </motion.div>

          {/* Mantra of the day - smaller on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.72 }}
            className={`inline-flex items-center gap-2.5 ${isMobile ? 'px-3 py-2' : 'px-4 py-2.5'} rounded-xl relative`}
            style={{
              background: 'rgba(10,5,0,0.38)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,210,60,0.22)',
            }}
          >
            {/* Glow effect behind mantra */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'radial-gradient(circle at center, rgba(255,215,0,0.08), transparent 70%)',
              }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            <div className="relative z-10">
              <p className={`${isMobile ? 'text-[7px]' : 'text-[9px]'} text-white/45 uppercase tracking-[0.18em] mb-0.5 flex items-center gap-1`}>
                <Sparkles className={`${isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5'} text-gold`} />
                Mantra of the Day
              </p>
              <motion.p
                style={{
                  fontFamily: "'Noto Serif Devanagari', 'Mangal', serif",
                  fontSize: isMobile ? '0.85rem' : '1.05rem',
                  color: '#FFD700',
                  textShadow: '0 0 16px rgba(255,215,0,0.55)',
                  lineHeight: 1.35,
                }}
                animate={{ opacity: [0.72, 1, 0.72] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                ॐ नमः शिवाय
              </motion.p>
              <p className={`${isMobile ? 'text-[7px]' : 'text-[9px]'} text-white/40 mt-0.5`}>"I bow to Lord Shiva"</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Bottom gradient ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[3]"
        style={{
          height: isMobile ? '6px' : '10px',
          background:
            'linear-gradient(to top, #fdf6ec 0%, rgba(253,246,236,0.85) 30%, rgba(253,246,236,0.40) 65%, transparent 100%)',
        }}
      />

      {/* ── Visualizer Bars - hidden on mobile ── */}
      {!isMobile && isPlaying && !isMuted && (
        <div className="absolute bottom-20 right-8 z-10 hidden sm:flex items-end gap-0.5 h-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-gold/60 rounded-full"
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
    </section>
  );
}
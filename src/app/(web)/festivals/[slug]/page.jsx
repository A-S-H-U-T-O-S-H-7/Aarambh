// app/(web)/festivals/[slug]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaTwitter,
  FaWhatsapp,
  FaCopy,
  FaCheck,
  FaEye,
  FaClock,
  FaUsers,
  FaInfoCircle,
  FaTag,
  FaArrowRight
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { getFestivalBySlug, incrementFestivalView } from '@/lib/services/festivalService';
import FestivalCountdown from '@/components/web/home/festival/FestivalCountdown';

// Helper to format date
const formatDate = (date) => {
  if (!date) return 'TBD';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function FestivalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;
  
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchFestival = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const result = await getFestivalBySlug(slug);
        if (result.success && result.festival) {
          setFestival(result.festival);
          // Increment view count
          await incrementFestivalView(result.festival.id);
        } else {
          toast.error('Festival not found');
          router.push('/festivals');
        }
      } catch (error) {
        console.error('Error fetching festival:', error);
        toast.error('Failed to load festival');
      } finally {
        setLoading(false);
      }
    };
    fetchFestival();
  }, [slug, router]);

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? 'Removed like' : 'Liked! ❤️');
  };

  const handleCopy = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `🕉️ ${festival.title} - ${festival.description}`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
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

  if (!festival) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
        <p className="text-6xl mb-4">🎊</p>
        <h2 className="text-2xl font-bold text-[#3D2B1A] dark:text-[#F5EAD9] mb-2">
          Festival not found
        </h2>
        <Link
          href="/festivals"
          className="px-6 py-2.5 bg-gradient-to-r from-[#E85D04] to-[#F4B400] text-white rounded-full hover:shadow-lg transition-all"
        >
          Browse all festivals
        </Link>
      </div>
    );
  }

  const images = festival.images || [];
  const hasImages = images.length > 0;

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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4"
        >
          <Link
            href="/festivals"
            className="group inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-[#241B14]/80 backdrop-blur-sm rounded-full border border-[#F4B400]/20 shadow-sm hover:shadow-md hover:border-[#F4B400]/40 transition-all duration-300"
          >
            <FaArrowLeft className="w-4 h-4 text-[#5C4630] dark:text-[#F0E4D3]/60 group-hover:text-[#E8742C] dark:group-hover:text-[#F4B400] transition-colors" />
            <span className="text-sm font-medium text-[#5C4630] dark:text-[#F0E4D3]/80 group-hover:text-[#3D2B1A] dark:group-hover:text-[#F5EAD9] transition-colors">
              Back to Festivals
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
                  <span className="text-3xl">{festival.emoji || '🎊'}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    festival.featured 
                      ? 'bg-[#F4B400] text-[#3D2B1A]' 
                      : 'bg-[#F4B400]/10 text-[#8C7456] dark:bg-[#F4B400]/20 dark:text-[#CBB89E]'
                  }`}>
                    {festival.featured ? '⭐ Featured' : festival.category}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3D2B1A] dark:text-[#F5EAD9] mt-2">
                  {festival.title}
                </h1>
                {festival.nameHindi && (
                  <p className="text-sm text-[#8C7456] dark:text-[#9C8569] mt-1">
                    {festival.nameHindi}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-sm text-[#8C7456] dark:text-[#9C8569]">
                <span className="flex items-center gap-1">
                  <FaEye className="w-3.5 h-3.5" />
                  {festival.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <FaHeart className="w-3.5 h-3.5" />
                  {festival.likes || 0}
                </span>
              </div>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
              <span className="flex items-center gap-1.5 text-[#6B5640] dark:text-[#B8A088]">
                <FaCalendarAlt className="w-4 h-4 text-[#E8742C] dark:text-[#FFA45C]" />
                {formatDate(festival.date)}
              </span>
              {festival.region && (
                <span className="flex items-center gap-1.5 text-[#6B5640] dark:text-[#B8A088]">
                  <FaMapMarkerAlt className="w-4 h-4 text-[#E8742C] dark:text-[#FFA45C]" />
                  {festival.region}
                </span>
              )}
              {festival.deity && (
                <span className="flex items-center gap-1.5 text-[#6B5640] dark:text-[#B8A088]">
                  <FaTag className="w-4 h-4 text-[#E8742C] dark:text-[#FFA45C]" />
                  {festival.deity}
                </span>
              )}
            </div>

            {/* Countdown */}
            {festival.nextDate && (
              <div className="mt-4 p-4 bg-gradient-to-r from-[#E8742C]/10 to-[#F4B400]/10 dark:from-[#E8742C]/20 dark:to-[#F4B400]/20 rounded-xl border border-[#F4B400]/15">
                <p className="text-xs uppercase tracking-wider text-[#8C7456] dark:text-[#9C8569] mb-1">
                  Countdown to {festival.title}
                </p>
                <FestivalCountdown targetDate={festival.nextDate.toISOString()} />
              </div>
            )}
          </div>

          {/* Images */}
          {hasImages && (
            <div className="p-6 sm:p-8 border-b border-[#F4B400]/10">
              <div className="relative w-full aspect-[22/9] rounded-xl overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={festival.title}
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
                        }`}
                      />
                    ))}
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
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

          {/* Description */}
          <div className="p-6 sm:p-8 border-b border-[#F4B400]/10">
            <h2 className="text-lg font-bold text-[#3D2B1A] dark:text-[#F5EAD9] mb-3 flex items-center gap-2">
              <FaInfoCircle className="w-5 h-5 text-[#E8742C] dark:text-[#FFA45C]" />
              About this Festival
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-[#6B5640] dark:text-[#CBB89E] leading-relaxed">
                {festival.fullDescription || festival.description}
              </p>
            </div>

            {festival.significance && (
              <div className="mt-4 p-4 bg-[#FBF3E7] dark:bg-[#1A130E] rounded-xl border border-[#F4B400]/10">
                <h4 className="text-sm font-semibold text-[#E8742C] dark:text-[#FFA45C] mb-1">
                  ✨ Significance
                </h4>
                <p className="text-sm text-[#6B5640] dark:text-[#B8A088]">
                  {festival.significance}
                </p>
              </div>
            )}
          </div>

          {/* Traditions */}
          {festival.traditions && festival.traditions.length > 0 && (
            <div className="p-6 sm:p-8 border-b border-[#F4B400]/10">
              <h2 className="text-lg font-bold text-[#3D2B1A] dark:text-[#F5EAD9] mb-3 flex items-center gap-2">
                <FaUsers className="w-5 h-5 text-[#E8742C] dark:text-[#FFA45C]" />
                Traditions
              </h2>
              <div className="flex flex-wrap gap-2">
                {festival.traditions.map((tradition, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-[#FBF3E7] dark:bg-[#1A130E] rounded-full text-sm text-[#6B5640] dark:text-[#B8A088] border border-[#F4B400]/10"
                  >
                    {tradition}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {festival.colors && festival.colors.length > 0 && (
            <div className="p-6 sm:p-8 border-b border-[#F4B400]/10">
              <h2 className="text-lg font-bold text-[#3D2B1A] dark:text-[#F5EAD9] mb-3 flex items-center gap-2">
                🎨 Festival Colors
              </h2>
              <div className="flex flex-wrap gap-3">
                {festival.colors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-[#F4B400]/20" style={{ backgroundColor: color }} />
                    <span className="text-sm text-[#6B5640] dark:text-[#B8A088]">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
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
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 rounded-full bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] transition-colors"
                aria-label="Share on Twitter"
              >
                <FaTwitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="p-2 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-colors"
                aria-label="Share on WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopy}
                className="p-2 rounded-full bg-[#F4B400]/10 hover:bg-[#F4B400]/20 text-[#F4B400] transition-colors relative"
                aria-label="Copy link"
              >
                {copied ? <FaCheck className="w-4 h-4 text-green-500" /> : <FaCopy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* More Festivals Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <Link
            href="/festivals"
            className="inline-flex items-center text-sm text-[#E8742C] dark:text-[#F4B400] hover:underline transition-colors group"
          >
            Browse all festivals
            <FaArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
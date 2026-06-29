// app/(web)/temples/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaArrowLeft, 
  FaMapPin, 
  FaClock, 
  FaStar, 
  FaUsers,
  FaVideo,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaTwitter,
  FaWhatsapp,
  FaCopy,
  FaCheck,
  FaCalendarAlt,
  FaBuilding,
  FaInfoCircle,
  FaArrowRight
} from 'react-icons/fa';
import { getTempleById } from '@/lib/mockTempleData';

export default function TempleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templeId = parseInt(params.id);
  
  const [temple, setTemple] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load temple data
    const templeData = getTempleById(templeId);
    if (templeData) {
      setTemple(templeData);
    }
    setLoading(false);
  }, [templeId]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleCopy = () => {
    const text = `🛕 ${temple.name}\n\n${temple.description}\n\n📍 ${temple.location}\n\nRead more at: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `🛕 ${temple.name} - ${temple.description}`;
    
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!temple) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛕</div>
          <h2 className="text-2xl font-bold text-brown-900 dark:text-cream-50">
            Temple not found
          </h2>
          <Link
            href="/temples"
            className="inline-flex items-center mt-4 text-gold hover:text-saffron transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Temples
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12 lg:py-16 relative overflow-hidden bg-gradient-to-b from-cream-50/30 via-white to-cream-50/30 dark:from-brown-900/20 dark:via-brown-900 dark:to-brown-900/20">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/temples"
            className="inline-flex items-center text-brown-600 dark:text-cream-50/60 hover:text-saffron transition-colors text-sm group"
          >
            <FaArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Temples
          </Link>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-brown-800/80 backdrop-blur-sm rounded-2xl border border-gold/20 dark:border-gold/10 shadow-xl overflow-hidden"
        >
          {/* Featured Image */}
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px]">
            <Image
              src={temple.image}
              alt={temple.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {temple.liveDarshan && (
                <span className="inline-flex items-center space-x-1 px-3 py-1.5 bg-divine-red text-white text-xs font-medium rounded-full shadow-lg animate-pulse">
                  <FaVideo className="w-3 h-3" />
                  <span>Live Darshan</span>
                </span>
              )}
              <span className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gold/90 text-white text-xs font-medium rounded-full shadow-lg">
                <FaStar className="w-3 h-3" />
                <span>{temple.rating} Rating</span>
              </span>
            </div>

            {/* Location - Bottom Right */}
            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full flex items-center space-x-1">
              <FaMapPin className="w-3 h-3" />
              <span>{temple.location}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 lg:p-10">
            {/* Title and Meta */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brown-900 dark:text-cream-50 mb-3">
                {temple.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-brown-600 dark:text-cream-50/60">
                <span className="flex items-center space-x-1">
                  <FaBuilding className="w-4 h-4" />
                  <span>{temple.architecture}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <FaClock className="w-4 h-4" />
                  <span>{temple.timings}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <FaUsers className="w-4 h-4" />
                  <span>{temple.visitors}</span>
                </span>
              </div>
            </div>

            {/* Deity & Significance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-saffron/5 dark:bg-saffron/10 rounded-xl border border-gold/10">
                <p className="text-xs text-brown-500 dark:text-cream-50/40">Deity</p>
                <p className="text-lg font-semibold text-brown-900 dark:text-cream-50">
                  {temple.deity}
                </p>
              </div>
              <div className="p-4 bg-gold/5 dark:bg-gold/10 rounded-xl border border-gold/10">
                <p className="text-xs text-brown-500 dark:text-cream-50/40">Established</p>
                <p className="text-lg font-semibold text-brown-900 dark:text-cream-50">
                  {temple.established}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-brown-900 dark:text-cream-50 mb-2">
                About the Temple
              </h3>
              <p className="text-sm text-brown-700 dark:text-cream-50/80 leading-relaxed">
                {temple.description}
              </p>
            </div>

            {/* Significance */}
            <div className="mb-6 p-4 bg-cream-50 dark:bg-brown-900/50 rounded-xl border border-gold/10">
              <div className="flex items-start space-x-3">
                <FaInfoCircle className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gold">Significance</h4>
                  <p className="text-sm text-brown-700 dark:text-cream-50/80 mt-1">
                    {temple.significance}
                  </p>
                </div>
              </div>
            </div>

            {/* Festivals */}
            {temple.festivals && temple.festivals.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-brown-900 dark:text-cream-50 mb-3">
                  Celebrated Festivals
                </h3>
                <div className="flex flex-wrap gap-2">
                  {temple.festivals.map((festival, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-r from-saffron/10 to-gold/10 dark:from-saffron/20 dark:to-gold/20 rounded-full text-sm text-brown-700 dark:text-cream-50/80 border border-gold/10"
                    >
                      <FaCalendarAlt className="inline w-3 h-3 mr-1 text-gold" />
                      {festival}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gold/10">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
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
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-brown-500 dark:text-cream-50/40">Share:</span>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 rounded-full bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] transition-colors"
                >
                  <FaTwitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="p-2 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-colors"
                >
                  <FaWhatsapp className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-full bg-gold/10 hover:bg-gold/20 text-gold transition-colors relative"
                >
                  {copied ? (
                    <FaCheck className="w-4 h-4 text-green-500" />
                  ) : (
                    <FaCopy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Live Darshan Link */}
            {temple.liveDarshan && (
              <div className="mt-6 p-4 bg-gradient-to-r from-divine-red/10 to-saffron/10 dark:from-divine-red/20 dark:to-saffron/20 rounded-xl border border-divine-red/20 text-center">
                <p className="text-sm text-brown-700 dark:text-cream-50/80">
                  <span className="inline-flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-divine-red animate-pulse" />
                    <span className="font-semibold">Live Darshan Available</span>
                  </span>
                  <br />
                  <span className="text-xs text-brown-500 dark:text-cream-50/60">
                    Watch the live darshan of {temple.name} right now
                  </span>
                </p>
                <button className="mt-3 px-6 py-2 bg-divine-red text-white text-sm font-medium rounded-full hover:bg-divine-red/90 transition-colors">
                  Watch Live Darshan
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* More Temples Suggestion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-brown-500 dark:text-cream-50/40">
            Discover more sacred temples in our{' '}
            <Link href="/temples" className="text-gold hover:text-saffron transition-colors">
              Temple Directory
            </Link>
          </p>
          <Link
            href="/temples"
            className="inline-flex items-center mt-3 text-sm text-gold hover:text-saffron transition-colors group"
          >
            Browse All Temples
            <FaArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
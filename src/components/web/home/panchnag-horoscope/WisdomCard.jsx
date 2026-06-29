// components/home/WisdomCard.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaQuoteLeft, 
  FaQuoteRight,
  FaTwitter,
  FaWhatsapp,
  FaCopy,
  FaCheck,
  FaBookOpen,
  FaTags,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaStar,
  FaMagic,
  FaLeaf
} from 'react-icons/fa';
import { GiLotus, GiSparkles } from 'react-icons/gi';

export default function WisdomCard({ 
  quote, 
  onRefresh, 
  onLike, 
  isLiked,
  showRefresh = true,
  showShare = true,
  compact = false,
  className = ''
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `"${quote.quote}" - ${quote.author}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = (platform) => {
    const text = `"${quote.quote}" - ${quote.author}`;
    const url = window.location.href;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`,
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`relative ${compact ? 'p-4 sm:p-5' : 'p-8 md:p-10'} bg-gradient-to-br ${quote.bgGradient} rounded-2xl border ${quote.borderColor} shadow-xl overflow-hidden ${compact ? 'h-full flex flex-col' : ''} ${className}`}
    >
      {/* Light-mode-only gradient wash for the compact card — dark mode keeps the existing look untouched */}
      {compact && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF6E5] via-[#FFFAF0] to-[#FDECC8] dark:opacity-0 pointer-events-none" />
      )}

      {/* Decorative Elements */}
      <div className={`absolute top-0 right-0 ${compact ? 'w-20 h-20' : 'w-32 h-32'} bg-gold/5 rounded-full blur-2xl`} />
      <div className={`absolute bottom-0 left-0 ${compact ? 'w-16 h-16' : 'w-24 h-24'} bg-saffron/5 rounded-full blur-2xl`} />
      
      {/* Floating Om Symbol */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${compact ? 'text-6xl' : 'text-9xl'} text-gold/5 font-serif opacity-20`}>
        ॐ
      </div>
      
      {/* Quote Markers */}
      <div className={`absolute top-4 left-4 ${compact ? 'text-xl' : 'text-4xl'} text-gold/20`}>
        <FaQuoteLeft />
      </div>
      <div className={`absolute bottom-4 right-4 ${compact ? 'text-xl' : 'text-4xl'} text-gold/20`}>
        <FaQuoteRight />
      </div>

      {/* Header - Category & Actions */}
      <div className={`flex items-center justify-between ${compact ? 'mb-3' : 'mb-6'} relative z-10`}>
        <div className={`flex items-center ${compact ? 'space-x-2' : 'space-x-3'} min-w-0`}>
          <div 
            className={`rounded-full font-medium text-white shadow-md shrink-0 ${compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}
            style={{ backgroundColor: quote.color }}
          >
            <div className="flex items-center space-x-1">
              <GiLotus className={compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
              <span>{quote.category}</span>
            </div>
          </div>
          {!compact && (
            <div className="flex items-center space-x-1 text-xs text-brown-500 dark:text-cream-50/50">
              <FaTags className="w-3 h-3" />
              <span>{quote.tags.slice(0, 2).join(' · ')}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1 shrink-0">
          {/* Like Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onLike?.(quote.id)}
            className={`rounded-full hover:bg-white/50 dark:hover:bg-brown-800/50 transition-colors ${compact ? 'p-1' : 'p-1.5'}`}
          >
            {isLiked ? (
              <FaHeart className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-divine-red animate-pulse`} />
            ) : (
              <FaRegHeart className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-brown-400 dark:text-cream-50/40`} />
            )}
          </motion.button>

          {/* Refresh Button */}
          {showRefresh && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onRefresh}
              className={`rounded-full hover:bg-white/50 dark:hover:bg-brown-800/50 transition-colors group ${compact ? 'p-1' : 'p-1.5'}`}
            >
              <GiSparkles className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-gold group-hover:rotate-180 transition-transform duration-500`} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Quote Content */}
      <div className={`relative z-10 ${compact ? 'flex-1 flex flex-col min-h-0' : ''}`}>
        <motion.blockquote 
          className={`font-serif text-brown-800 dark:text-cream-50 leading-relaxed ${
            compact
              ? 'text-sm sm:text-base mb-3 flex-1 line-clamp-5'
              : 'text-xl md:text-2xl lg:text-3xl mb-6'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          "{quote.quote}"
        </motion.blockquote>

        {/* Author & Actions */}
        <div className={`flex flex-wrap items-center justify-between ${compact ? 'gap-2' : 'gap-4'}`}>
          <div className="min-w-0">
            <p className={`font-medium text-brown-600 dark:text-cream-50/70 ${compact ? 'text-xs' : 'text-sm'}`}>
              — {quote.author}
            </p>
            {quote.source && !compact && (
              <p className="text-xs text-brown-500 dark:text-cream-50/50 flex items-center mt-0.5">
                <FaBookOpen className="w-3 h-3 mr-1" />
                {quote.source}
              </p>
            )}
          </div>

          {/* Share Actions */}
          {showShare && (
            <div className="flex items-center space-x-1 shrink-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare('twitter')}
                className={`rounded-full bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] transition-colors ${compact ? 'p-1.5' : 'p-2'}`}
                aria-label="Share on Twitter"
              >
                <FaTwitter className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare('whatsapp')}
                className={`rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-colors ${compact ? 'p-1.5' : 'p-2'}`}
                aria-label="Share on WhatsApp"
              >
                <FaWhatsapp className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className={`rounded-full bg-gold/10 hover:bg-gold/20 text-gold transition-colors relative ${compact ? 'p-1.5' : 'p-2'}`}
                aria-label="Copy quote"
              >
                {copied ? (
                  <FaCheck className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-green-500`} />
                ) : (
                  <FaCopy className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
                )}
              </motion.button>
            </div>
          )}
        </div>

        {/* Tags */}
        {!compact && (
          <div className="mt-4 flex flex-wrap gap-2">
            {quote.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-[10px] bg-white/50 dark:bg-brown-900/50 rounded-full text-brown-600 dark:text-cream-50/60 border border-gold/10"
              >
                #{tag.toLowerCase()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Copy Success Toast */}
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={`absolute ${compact ? 'bottom-3 right-3 px-2 py-1 text-[10px]' : 'bottom-20 right-6 px-3 py-1.5 text-xs'} bg-green-500 text-white rounded-lg shadow-lg`}
        >
          ✓ Copied!
        </motion.div>
      )}
    </motion.div>
  );
}
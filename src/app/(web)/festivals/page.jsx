// app/(web)/festivals/page.jsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaTimes, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaArrowLeft,
  FaHeart,
  FaEye
} from 'react-icons/fa';
import { GiSparkles } from 'react-icons/gi';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getUpcomingFestivals } from '@/lib/services/festivalService';
import FestivalCountdown from '@/components/web/home/festival/FestivalCountdown';

// Helper to format date
const formatDate = (date) => {
  if (!date) return 'TBD';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function FestivalsPage() {
  const router = useRouter();
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch festivals
  useEffect(() => {
    const fetchFestivals = async () => {
      setLoading(true);
      try {
        const result = await getUpcomingFestivals(50);
        if (result.success) {
          setFestivals(result.festivals);
        } else {
          toast.error('Failed to load festivals');
        }
      } catch (error) {
        console.error('Error fetching festivals:', error);
        toast.error('Failed to load festivals');
      } finally {
        setLoading(false);
      }
    };
    fetchFestivals();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set();
    festivals.forEach(f => {
      if (f.category) cats.add(f.category);
    });
    return ['all', ...Array.from(cats)];
  }, [festivals]);

  // Filter festivals
  const filteredFestivals = useMemo(() => {
    let results = festivals;
    
    if (selectedCategory !== 'all') {
      results = results.filter(f => f.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(f => 
        f.title.toLowerCase().includes(q) ||
        f.nameHindi?.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q) ||
        f.region?.toLowerCase().includes(q)
      );
    }
    
    return results;
  }, [festivals, selectedCategory, searchQuery]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4"
        >
          <button
            onClick={handleBack}
            className="group inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-[#241B14]/80 backdrop-blur-sm rounded-full border border-[#F4B400]/20 shadow-sm hover:shadow-md hover:border-[#F4B400]/40 transition-all duration-300"
          >
            <FaArrowLeft className="w-4 h-4 text-[#5C4630] dark:text-[#F0E4D3]/60 group-hover:text-[#E8742C] dark:group-hover:text-[#F4B400] transition-colors" />
            <span className="text-sm font-medium text-[#5C4630] dark:text-[#F0E4D3]/80 group-hover:text-[#3D2B1A] dark:group-hover:text-[#F5EAD9] transition-colors">
              Back
            </span>
          </button>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-[#2A2018]/90 backdrop-blur-sm rounded-full border border-[#F4B400]/25 shadow-sm mb-3">
            <GiSparkles className="w-4 h-4 text-[#D98C1F] dark:text-[#F4B400]" />
            <span className="text-xs font-semibold tracking-wide text-[#5C4630] dark:text-[#F0E4D3] uppercase">
              Sacred Celebrations
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#3D2B1A] dark:text-[#F5EAD9]">
            All{' '}
            <span className="bg-gradient-to-r from-[#E8742C] to-[#F4B400] bg-clip-text text-transparent">
              Festivals
            </span>
          </h1>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#E8742C] to-[#F4B400] rounded-full mx-auto mt-3" />
          <p className="mt-3 text-sm text-[#6B5640] dark:text-[#CBB89E] max-w-xl mx-auto">
            Discover sacred celebrations, countdown to divine moments, and embrace the spirit of Indian traditions.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto mb-5"
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7456] dark:text-[#9C8569]/40" />
              <input
                type="text"
                placeholder="Search festivals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-white/90 dark:bg-[#2A2018]/90 backdrop-blur-sm border border-[#F4B400]/20 dark:border-[#F4B400]/15 rounded-xl text-sm text-[#3D2B1A] dark:text-[#F5EAD9] placeholder:text-[#8C7456] dark:placeholder:text-[#9C8569]/40 focus:outline-none focus:border-[#F4B400] focus:ring-2 focus:ring-[#F4B400]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#F4B400]/15 transition-colors"
                >
                  <FaTimes className="w-3 h-3 text-[#8C7456] dark:text-[#9C8569]/40" />
                </button>
              )}
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 bg-white/90 dark:bg-[#2A2018]/90 backdrop-blur-sm border border-[#F4B400]/20 dark:border-[#F4B400]/15 rounded-xl text-sm text-[#3D2B1A] dark:text-[#F5EAD9] focus:outline-none focus:border-[#F4B400] focus:ring-2 focus:ring-[#F4B400]/20 transition-all cursor-pointer min-w-[130px]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="mt-2 text-xs text-[#8C7456] dark:text-[#9C8569]">
            {filteredFestivals.length} festival{filteredFestivals.length !== 1 ? 's' : ''}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        </motion.div>

        {/* Festivals Grid - Smaller Cards */}
        {filteredFestivals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredFestivals.map((festival, index) => (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="group"
              >
                <Link href={`/festivals/${festival.slug}`}>
                  <div className="bg-white dark:bg-[#241B14] rounded-lg border border-[#F4B400]/15 dark:border-[#F4B400]/15 overflow-hidden hover:shadow-lg hover:border-[#F4B400]/35 transition-all duration-300">
                    {/* Image - Smaller */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                      {festival.featuredImage ? (
                        <img 
                          src={festival.featuredImage} 
                          alt={festival.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E8742C]/20 to-[#F4B400]/20 text-4xl">
                          {festival.emoji || '🎊'}
                        </div>
                      )}
                      {/* Featured badge - Smaller */}
                      {festival.featured && (
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#F4B400] text-[#3D2B1A] text-[8px] font-bold rounded-full shadow">
                          ⭐ Featured
                        </div>
                      )}
                      {/* Days count badge - Smaller */}
                      {festival.nextDate && (
                        <div className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[8px] font-medium rounded-full">
                          {Math.ceil((festival.nextDate - new Date()) / (1000 * 60 * 60 * 24))}d
                        </div>
                      )}
                    </div>

                    {/* Content - Compact */}
                    <div className="p-2.5">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-sm">{festival.emoji || '🎊'}</span>
                        <span className="text-[9px] text-[#8C7456] dark:text-[#9C8569] truncate">{festival.category}</span>
                      </div>

                      <h3 className="text-xs font-bold text-[#3D2B1A] dark:text-[#F5EAD9] group-hover:text-[#E8742C] dark:group-hover:text-[#F4B400] transition-colors line-clamp-1">
                        {festival.title}
                      </h3>

                      <div className="flex items-center gap-2 mt-1.5 text-[9px] text-[#8C7456] dark:text-[#9C8569]">
                        <span className="flex items-center gap-0.5">
                          <FaCalendarAlt className="w-2.5 h-2.5 text-[#E8742C] dark:text-[#FFA45C]" />
                          {new Date(festival.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <FaMapMarkerAlt className="w-2.5 h-2.5 text-[#E8742C] dark:text-[#FFA45C]" />
                          {festival.region || 'IN'}
                        </span>
                      </div>

                      {/* Countdown - Compact */}
                      {festival.nextDate && (
                        <div className="mt-1.5 pt-1.5 border-t border-[#F4B400]/10">
                          <FestivalCountdown targetDate={festival.nextDate.toISOString()} size="sm" />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-5xl mb-3">🎊</p>
            <h3 className="text-lg font-semibold text-[#3D2B1A] dark:text-[#F5EAD9] mb-1">
              No festivals found
            </h3>
            <p className="text-sm text-[#6B5640] dark:text-[#CBB89E] mb-4">
              Try a different search term or category
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-5 py-2 bg-gradient-to-r from-[#E85D04] to-[#F4B400] text-white text-sm font-semibold rounded-full hover:shadow-lg transition-all"
            >
              Reset filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
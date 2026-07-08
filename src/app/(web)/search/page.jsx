'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowLeft,
} from 'lucide-react';
import { searchAllContent } from '@/lib/services/searchService';
import BhajanCard from '@/components/web/home/bhajan/BhajanCard';
import VideoCard from '@/components/web/home/spiritual-videos/VideoCard';
import TempleCard from '@/components/web/home/temple/TempleCard';
import StoryCard from '@/components/web/home/story/StoryCard';
import FestivalCard from '@/components/web/home/festival/FestivalCard';
import BhajanPlayerModal from '@/components/web/home/bhajan/Bhajanplayermodal';
import VideoPlayerModal from '@/components/web/home/spiritual-videos/VideoPlayerModal';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('all');
  const [searchResults, setSearchResults] = useState({
    bhajans: [],
    videos: [],
    temples: [],
    stories: [],
    festivals: [],
  });
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  
  // ─── Modal States ───
  const [modalBhajan, setModalBhajan] = useState(null);
  const [modalVideo, setModalVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    if (query && query.length >= 2) {
      performSearch();
    } else {
      setLoading(false);
      setSearchResults({ bhajans: [], videos: [], temples: [], stories: [], festivals: [] });
      setTotalResults(0);
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    const result = await searchAllContent(query);
    if (result.success) {
      setSearchResults(result.results);
      setTotalResults(result.total);
    }
    setLoading(false);
  };

  // ─── Modal Handlers ───
  const handleOpenBhajanModal = (bhajan) => {
    setModalBhajan(bhajan);
    setPlayingId(bhajan.id);
    setIsPlaying(true);
  };

  const handleCloseBhajanModal = () => {
    setModalBhajan(null);
    setIsPlaying(false);
    setPlayingId(null);
  };

  const handleOpenVideoModal = (video) => {
    setModalVideo(video);
    setPlayingId(video.id);
    setIsPlaying(true);
  };

  const handleCloseVideoModal = () => {
    setModalVideo(null);
    setIsPlaying(false);
    setPlayingId(null);
  };

  const getTabCount = (tab) => {
    if (tab === 'all') return totalResults;
    if (tab === 'bhajans') return searchResults.bhajans.length;
    if (tab === 'videos') return searchResults.videos.length;
    if (tab === 'temples') return searchResults.temples.length;
    if (tab === 'stories') return searchResults.stories.length;
    if (tab === 'festivals') return searchResults.festivals.length;
    return 0;
  };

  const getResultsToShow = () => {
    if (activeTab === 'all') {
      return [
        ...searchResults.bhajans.map((r) => ({ ...r, type: 'bhajan' })),
        ...searchResults.videos.map((r) => ({ ...r, type: 'video' })),
        ...searchResults.temples.map((r) => ({ ...r, type: 'temple' })),
        ...searchResults.stories.map((r) => ({ ...r, type: 'story' })),
        ...searchResults.festivals.map((r) => ({ ...r, type: 'festival' })),
      ];
    }
    if (activeTab === 'bhajans')
      return searchResults.bhajans.map((r) => ({ ...r, type: 'bhajan' }));
    if (activeTab === 'videos')
      return searchResults.videos.map((r) => ({ ...r, type: 'video' }));
    if (activeTab === 'temples')
      return searchResults.temples.map((r) => ({ ...r, type: 'temple' }));
    if (activeTab === 'stories')
      return searchResults.stories.map((r) => ({ ...r, type: 'story' }));
    if (activeTab === 'festivals')
      return searchResults.festivals.map((r) => ({ ...r, type: 'festival' }));
    return [];
  };

  // ─── Render Card Based on Type ───
  const renderResultCard = (item) => {
    const isPlayingThis = playingId === item.id;

    switch (item.type) {
      case 'bhajan':
        return (
          <div key={`bhajan-${item.id}`} className="w-full">
            <BhajanCard
              bhajan={item}
              isPlaying={isPlayingThis}
              onPlay={() => handleOpenBhajanModal(item)}
              onClick={() => handleOpenBhajanModal(item)}
              onLike={() => {}}
              isLiked={false}
            />
          </div>
        );
      
      case 'video':
        return (
          <div key={`video-${item.id}`} className="w-full">
            <VideoCard
              video={item}
              isPlaying={isPlayingThis}
              onPlay={() => handleOpenVideoModal(item)}
              onClick={() => handleOpenVideoModal(item)}
              onLike={() => {}}
              isLiked={false}
            />
          </div>
        );
      
      case 'temple':
        return (
          <Link href={`/temples/${item.slug || item.id}`} key={`temple-${item.id}`} className="w-full block">
            <TempleCard temple={item} onLike={() => {}} isLiked={false} />
          </Link>
        );
      
      case 'story':
        return (
          <Link href={`/stories/${item.slug || item.id}`} key={`story-${item.id}`} className="w-full block">
            <StoryCard story={item} onLike={() => {}} isLiked={false} />
          </Link>
        );
      
      case 'festival':
        return (
          <Link href={`/festivals/${item.slug || item.id}`} key={`festival-${item.id}`} className="w-full block">
            <FestivalCard festival={item} />
          </Link>
        );
      
      default:
        return null;
    }
  };

  const resultsToShow = getResultsToShow();

  // ─── Grid classes based on results count ───
  const getGridClasses = () => {
    const count = resultsToShow.length;
    if (count === 1) return 'grid-cols-1 max-w-xs mx-auto';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-5 gap-4';
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
  };

  return (
    <div className="min-h-screen bg-cream-50/50 dark:bg-brown-900/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex cursor-pointer items-center gap-2 text-brown-600 dark:text-cream-50/60 hover:text-saffron transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-saffron/10 dark:bg-saffron/20 rounded-full">
              <Search className="w-6 h-6 text-saffron" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-brown-900 dark:text-cream-50">
              Search Results
            </h1>
          </div>
          {query && (
            <p className="text-brown-600 dark:text-cream-50/60">
              Found <span className="font-semibold text-saffron">{totalResults}</span> result
              {totalResults !== 1 ? 's' : ''} for "{query}"
            </p>
          )}
        </div>

        {/* Tabs */}
        {totalResults > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gold/20 dark:border-gold/10 pb-2">
            {['all', 'bhajans', 'videos', 'temples', 'stories', 'festivals'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 capitalize flex items-center gap-2 rounded-full ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-saffron to-gold text-white shadow-lg'
                    : 'text-brown-600 dark:text-cream-50/60 hover:text-saffron hover:bg-saffron/5'
                }`}
              >
                {tab === 'all' && 'All'}
                {tab === 'bhajans' && 'Bhajans'}
                {tab === 'videos' && 'Videos'}
                {tab === 'temples' && 'Temples'}
                {tab === 'stories' && 'Stories'}
                {tab === 'festivals' && 'Festivals'}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab
                      ? 'bg-white/20 text-white'
                      : 'bg-gold/10 text-gold'
                  }`}
                >
                  {getTabCount(tab)}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Results - Grid Layout */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-3 border-saffron border-t-transparent rounded-full animate-spin" />
          </div>
        ) : resultsToShow.length > 0 ? (
          <div className={`grid ${getGridClasses()} gap-4`}>
            <AnimatePresence>
              {resultsToShow.map((item) => renderResultCard(item))}
            </AnimatePresence>
          </div>
        ) : query ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-brown-900 dark:text-cream-50 mb-2">
              No results found
            </h3>
            <p className="text-brown-500 dark:text-cream-50/50">
              We couldn't find any matches for "{query}". Try searching with different keywords.
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-brown-900 dark:text-cream-50 mb-2">
              Enter a search term
            </h3>
            <p className="text-brown-500 dark:text-cream-50/50">
              Search for bhajans, videos, temples, stories, or festivals across our platform
            </p>
          </div>
        )}
      </div>

      {/* ─── Bhajan Player Modal ─── */}
      <BhajanPlayerModal
        bhajan={modalBhajan}
        isOpen={!!modalBhajan}
        onClose={handleCloseBhajanModal}
        onNext={() => {}}
        onPrev={() => {}}
        onLike={() => {}}
        isLiked={false}
        isPlaying={isPlaying}
        onPlay={() => {}}
        allBhajans={searchResults.bhajans}
      />

      {/* ─── Video Player Modal ─── */}
      <VideoPlayerModal
        video={modalVideo}
        isOpen={!!modalVideo}
        onClose={handleCloseVideoModal}
        onNext={() => {}}
        onPrev={() => {}}
        onLike={() => {}}
        isLiked={false}
        isPlaying={isPlaying}
        onPlay={() => {}}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-cream-50 dark:bg-brown-900">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-saffron" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
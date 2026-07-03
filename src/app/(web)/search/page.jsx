'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowLeft,
  Music,
  Video,
  Building,
  BookOpen,
  Calendar,
  Star,
} from 'lucide-react';
import { searchAllContent } from '@/lib/services/searchService';

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

  const getTypeIcon = (type) => {
    const icons = {
      bhajan: <Music className="w-4 h-4" />,
      video: <Video className="w-4 h-4" />,
      temple: <Building className="w-4 h-4" />,
      story: <BookOpen className="w-4 h-4" />,
      festival: <Calendar className="w-4 h-4" />,
    };
    return icons[type] || <Star className="w-4 h-4" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      bhajan: 'bg-saffron/10 text-saffron',
      video: 'bg-blue-500/10 text-blue-500',
      temple: 'bg-purple-500/10 text-purple-500',
      story: 'bg-emerald-500/10 text-emerald-500',
      festival: 'bg-rose-500/10 text-rose-500',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-500';
  };

  const getTypeLabel = (type) => {
    const labels = {
      bhajan: 'Bhajan',
      video: 'Video',
      temple: 'Temple',
      story: 'Story',
      festival: 'Festival',
    };
    return labels[type] || type;
  };

  const getHref = (item) => {
    const routes = {
      bhajan: `/bhajans`,
      video: `/spiritual-videos`,
      temple: `/temples`,
      story: `/stories`,
      festival: `/festivals`,
    };
    return routes[item.type] || '/';
  };

  const resultsToShow = getResultsToShow();

  return (
    <div className="min-h-screen bg-cream-50/50 dark:bg-brown-900/50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-brown-600 dark:text-cream-50/60 hover:text-saffron transition-colors mb-4 group"
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

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-3 border-saffron border-t-transparent rounded-full animate-spin" />
          </div>
        ) : resultsToShow.length > 0 ? (
          <div className="space-y-4">
            {resultsToShow.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={getHref(item)}
                  className="group block bg-white dark:bg-brown-800/80 rounded-xl border border-gold/20 dark:border-gold/10 p-4 hover:shadow-xl hover:border-gold/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`p-2 rounded-full ${getTypeColor(
                        item.type
                      )} flex-shrink-0`}
                    >
                      {getTypeIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getTypeColor(
                            item.type
                          )}`}
                        >
                          {getTypeLabel(item.type)}
                        </span>
                        {item.category && (
                          <span className="text-xs text-brown-500 dark:text-cream-50/40 capitalize">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-brown-900 dark:text-cream-50 group-hover:text-saffron transition-colors line-clamp-2">
                        {item.title || item.name}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-brown-600 dark:text-cream-50/50 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      {item.artist && (
                        <p className="text-xs text-brown-500 dark:text-cream-50/40 mt-1">
                          🎵 {item.artist}
                        </p>
                      )}
                      {item.speaker && (
                        <p className="text-xs text-brown-500 dark:text-cream-50/40 mt-1">
                          🎙️ {item.speaker}
                        </p>
                      )}
                      {item.location && (
                        <p className="text-xs text-brown-500 dark:text-cream-50/40 mt-1">
                          📍 {item.location}
                        </p>
                      )}
                      {item.deity && (
                        <p className="text-xs text-brown-500 dark:text-cream-50/40 mt-1">
                          🛕 {item.deity}
                        </p>
                      )}
                      {item.date && (
                        <p className="text-xs text-brown-500 dark:text-cream-50/40 mt-1">
                          📅 {item.date}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
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
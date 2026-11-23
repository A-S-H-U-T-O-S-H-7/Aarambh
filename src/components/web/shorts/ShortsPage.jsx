'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaPlay, FaEye, FaCalendarAlt, FaFire } from 'react-icons/fa';
import { getVideosPage, countPublishedVideos } from '@/lib/services/mediaService';
import ShortsModal from './ShortsModal';
import { shortThumb, formatDate, formatViews } from './shortsUtils';

const PAGE_SIZE = 24;

function SkeletonShort() {
  return <div className="animate-pulse aspect-[9/16] rounded-xl bg-[#EADBC4] dark:bg-[#2A2018]" />;
}

// memo: appending a page doesn't re-render the cards already on screen
const ShortCard = memo(function ShortCard({ short, onOpen }) {
  const thumb = shortThumb(short);
  return (
    <button
      type="button"
      onClick={() => onOpen(short)}
      className="group relative block w-full aspect-[9/16] rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-[transform,box-shadow] duration-300 text-left cursor-pointer bg-[#2A2018]"
    >
      {thumb && (
        <img
          src={thumb}
          alt={short.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
          <FaPlay className="w-4 h-4 text-white ml-0.5" />
        </div>
      </div>

      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-gradient-to-r from-[#E8742C] to-[#F4B400] text-white text-[9px] font-bold rounded-full uppercase tracking-wider shadow">
        Short
      </span>
      {short.duration && (
        <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 bg-black/60 text-white text-[10px] font-semibold rounded-md">
          {short.duration}
        </span>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white text-xs sm:text-sm font-bold leading-snug line-clamp-3 mb-1.5">{short.title}</h3>
        <div className="flex items-center gap-3 text-white/70 text-[10px]">
          <span className="flex items-center gap-1">
            <FaEye className="w-3 h-3" />
            {formatViews(short.views)}
          </span>
          <span className="flex items-center gap-1">
            <FaCalendarAlt className="w-3 h-3" />
            {formatDate(short.publishDate)}
          </span>
        </div>
      </div>
    </button>
  );
});

export default function ShortsPage() {
  const router = useRouter();
  const [shorts, setShorts] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [selected, setSelected] = useState(null);
  const loaderRef = useRef(null);
  // Refs so loadMore keeps one identity and never runs twice at once
  const cursorRef = useRef(null);
  const busyRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [result, count] = await Promise.all([getVideosPage(PAGE_SIZE, 'short'), countPublishedVideos('short')]);
      if (result.success) {
        setShorts(result.videos);
        setHasMore(result.hasMore);
        cursorRef.current = result.cursor;
      }
      setTotal(count);
      setLoading(false);
    };
    load();
  }, []);

  const loadMore = useCallback(async () => {
    if (busyRef.current || !cursorRef.current) return;
    busyRef.current = true;
    setLoadingMore(true);
    try {
      const result = await getVideosPage(PAGE_SIZE, 'short', cursorRef.current);
      if (result.success) {
        cursorRef.current = result.cursor;
        setShorts((prev) => {
          const seen = new Set(prev.map((s) => s.id));
          return [...prev, ...result.videos.filter((s) => !seen.has(s.id))];
        });
        setHasMore(result.hasMore);
      } else {
        setHasMore(false);
      }
    } finally {
      busyRef.current = false;
      setLoadingMore(false);
    }
  }, []);

  // Infinite scroll: start fetching well before the bottom is reached
  useEffect(() => {
    const node = loaderRef.current;
    if (!node || !hasMore || loading) return;
    const observer = new IntersectionObserver((entries) => entries[0].isIntersecting && loadMore(), {
      rootMargin: '800px 0px',
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  const handleNearEnd = useCallback(() => {
    if (hasMore) loadMore();
  }, [hasMore, loadMore]);

  return (
    <div className="min-h-screen bg-[#FBF3E7] dark:bg-[#15100C]">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-14 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 px-4 py-2 mb-5 bg-white/80 dark:bg-[#2A2018]/90 rounded-full border border-[#F4B400]/25 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <FaArrowLeft className="w-3.5 h-3.5 text-[#5C4630] dark:text-[#F0E4D3] group-hover:text-[#E8742C]" />
            <span className="text-sm font-medium text-[#5C4630] dark:text-[#F0E4D3]">Back</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#3D2B1A] dark:text-[#F5EAD9] tracking-tight flex items-center gap-2">
              Spiritual
              <span className="bg-gradient-to-r from-[#E8742C] to-[#F4B400] bg-clip-text text-transparent">Shorts</span>
              <FaFire className="w-6 h-6 text-[#E8742C]" />
            </h1>
            {total != null && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white/80 dark:bg-[#2A2018]/90 text-[#5C4630] dark:text-[#F0E4D3] rounded-full border border-[#F4B400]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8742C]" />
                {total.toLocaleString('en-IN')} shorts
              </span>
            )}
          </div>
          <p className="text-sm text-[#6B5640] dark:text-[#CBB89E] mt-1.5">
            Quick moments of devotion, mantras and darshan from Aarambh TV
          </p>
          <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-[#E8742C] to-[#F4B400]" />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(12)].map((_, i) => (
              <SkeletonShort key={i} />
            ))}
          </div>
        ) : shorts.length === 0 ? (
          <p className="text-center py-16 text-[#6B5640] dark:text-[#CBB89E] text-lg">No shorts yet</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {shorts.map((short) => (
                <ShortCard key={short.id} short={short} onOpen={setSelected} />
              ))}
              {/* Placeholders while the next page loads keep the grid from jumping */}
              {loadingMore && [...Array(6)].map((_, i) => <SkeletonShort key={`s${i}`} />)}
            </div>

            {hasMore && (
              <div ref={loaderRef} className="flex justify-center py-10">
                {!loadingMore && (
                  <button
                    onClick={loadMore}
                    className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#E8742C] to-[#F4B400] shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Load more shorts
                  </button>
                )}
              </div>
            )}

            {!hasMore && (
              <p className="text-center py-6 text-sm text-[#8A7358] dark:text-[#A8957C]">You&apos;ve seen all the shorts 🙏</p>
            )}
          </>
        )}
      </div>

      {selected && (
        <ShortsModal
          short={selected}
          allShorts={shorts}
          total={total}
          onClose={() => setSelected(null)}
          onNavigate={setSelected}
          onNearEnd={handleNearEnd}
        />
      )}
    </div>
  );
}

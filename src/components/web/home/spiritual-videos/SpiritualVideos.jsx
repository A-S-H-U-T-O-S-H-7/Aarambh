// components/web/home/video/SpiritualVideos.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FaArrowRight,
  FaVideo,
  FaFire,
  FaClock,
  FaEye,
  FaPlay,
  FaHeart,
  FaRegHeart,
  FaUserCircle,
  FaTimes,
  FaPause,
  FaStepForward,
  FaStepBackward,
} from 'react-icons/fa';
import { getTrendingVideos, getLatestVideos, incrementVideoView, toggleVideoLike } from '@/lib/services/mediaService';
import VideoCard from './VideoCard';
import VideoPlayerModal from './VideoPlayerModal';

const CATEGORY_TONE = {
  discourse: { bg: 'bg-[#9C7A2E]/90', text: 'text-[#9C7A2E] dark:text-[#D9B86A]', chip: 'bg-[#9C7A2E]/10 dark:bg-[#9C7A2E]/20' },
  bhajan: { bg: 'bg-[#C0392B]/90', text: 'text-[#C0392B] dark:text-[#F08C7D]', chip: 'bg-[#C0392B]/10 dark:bg-[#C0392B]/20' },
  documentary: { bg: 'bg-[#E8742C]/90', text: 'text-[#E8742C] dark:text-[#FFA45C]', chip: 'bg-[#E8742C]/10 dark:bg-[#E8742C]/20' },
  talk: { bg: 'bg-[#B8860B]/90', text: 'text-[#B8860B] dark:text-[#F4B400]', chip: 'bg-[#B8860B]/10 dark:bg-[#B8860B]/20' },
};
const getTone = (category) => CATEGORY_TONE[category] || CATEGORY_TONE.talk;

const formatViews = (views) => {
  if (!views) return '0';
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return views.toString();
};

export default function SpiritualVideos() {
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [latestVideos, setLatestVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const [modalVideo, setModalVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const [trendingResult, latestResult] = await Promise.all([
          getTrendingVideos(4, 'standard'),
          getLatestVideos(6, 'standard'), // Only full videos (not shorts/reels)
        ]);
        if (trendingResult.success) setTrendingVideos(trendingResult.videos);
        if (latestResult.success) setLatestVideos(latestResult.videos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleLike = async (id) => {
    setLikedVideos((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
    try {
      await toggleVideoLike(id);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const isLiked = (id) => likedVideos.includes(id);

  const handleOpenModal = async (video) => {
    setModalVideo(video);
    setPlayingId(video.id);
    try {
      await incrementVideoView(video.id);
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  };

  const handleCloseModal = () => setModalVideo(null);

  const handleNext = () => {
    if (!modalVideo) return;
    const idx = latestVideos.findIndex((v) => v.id === modalVideo.id);
    const next = latestVideos[(idx + 1) % latestVideos.length];
    setModalVideo(next);
    setPlayingId(next.id);
  };

  const handlePrev = () => {
    if (!modalVideo) return;
    const idx = latestVideos.findIndex((v) => v.id === modalVideo.id);
    const prev = latestVideos[(idx - 1 + latestVideos.length) % latestVideos.length];
    setModalVideo(prev);
    setPlayingId(prev.id);
  };

  const handleTogglePlay = () => {
    if (!modalVideo) return;
    setPlayingId((prev) => (prev === modalVideo.id ? null : modalVideo.id));
  };

  if (loading) {
    return (
      <section className="py-6 lg:py-8 bg-[#FBF3E7] dark:bg-[#15100C]">
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 lg:py-8 relative overflow-hidden bg-[#FBF3E7] dark:bg-[#15100C]">
      <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity"
        style={{
          backgroundImage: `
            radial-gradient(circle at 90% 8%, rgba(244,180,0,0.14) 0%, transparent 45%),
            radial-gradient(circle at 5% 40%, rgba(192,57,43,0.10) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(232,116,44,0.10) 0%, transparent 55%)
          `,
        }}
      />
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity"
        style={{
          backgroundImage: `
            radial-gradient(circle at 90% 8%, rgba(244,180,0,0.20) 0%, transparent 45%),
            radial-gradient(circle at 5% 40%, rgba(192,57,43,0.16) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(232,116,44,0.16) 0%, transparent 55%)
          `,
        }}
      />

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-[#2A2018]/90 backdrop-blur-sm rounded-full border border-[#F4B400]/25 dark:border-[#F4B400]/20 shadow-sm mb-4">
            <FaVideo className="w-4 h-4 text-[#D98C1F] dark:text-[#F4B400]" />
            <span className="text-xs sm:text-sm font-medium text-[#5C4630] dark:text-[#F0E4D3]">
              Watch & Learn
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-[#3D2B1A] dark:text-[#F5EAD9]">
            Spiritual
            <span className="bg-gradient-to-r from-[#E8742C] to-[#F4B400] bg-clip-text text-transparent"> Videos</span>
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#E8742C] to-[#F4B400] rounded-full mx-auto mt-4" />
          <p className="mt-4 text-sm sm:text-base text-[#6B5640] dark:text-[#CBB89E] max-w-2xl mx-auto px-2">
            Watch insightful discourses, soulful bhajans, and spiritual documentaries that elevate your consciousness.
          </p>
        </motion.div>

        {/* Left: Trending | Right: Latest */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Trending */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <FaFire className="w-5 h-5 text-[#C0392B] dark:text-[#E8674F]" />
              <h3 className="text-base sm:text-lg font-semibold text-[#3D2B1A] dark:text-[#F5EAD9]">
                Trending Now
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {trendingVideos.map((video, index) => {
                const tone = getTone(video.category);
                return (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -3 }}
                    onClick={() => handleOpenModal(video)}
                    className="group relative bg-white dark:bg-[#241B14] rounded-xl border border-[#F4B400]/20 dark:border-[#F4B400]/20 overflow-hidden hover:shadow-lg dark:hover:shadow-black/40 transition-all duration-300 hover:border-[#F4B400]/40 cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 ${tone.bg} text-white text-[8px] font-medium rounded-full shadow-lg backdrop-blur-sm`}>
                        <span className="capitalize">{video.category}</span>
                      </div>
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center transition-opacity duration-300">
                        <div className="w-8 h-8 rounded-full text-white flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #E8742C, #F4B400)' }}>
                          <FaPlay className="w-3 h-3 ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <h4 className="text-xs font-semibold text-[#3D2B1A] dark:text-[#F5EAD9] line-clamp-2 mb-1 leading-snug">
                        {video.title}
                      </h4>
                      <p className="text-[10px] text-[#8C7456] dark:text-[#9C8569] line-clamp-1">
                        {video.speaker}
                      </p>
                      <div className="flex items-center gap-2 text-[9px] text-[#8C7456] dark:text-[#9C8569] mt-1.5">
                        <span className="flex items-center gap-0.5">
                          <FaEye className="w-2 h-2" />
                          {formatViews(video.views)}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <FaClock className="w-2 h-2" />
                          {video.duration}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleLike(video.id); }}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
                    >
                      {isLiked(video.id) ? <FaHeart className="w-3 h-3 text-[#E8674F]" /> : <FaRegHeart className="w-3 h-3 text-white/80" />}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Latest Videos */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <h3 className="text-base sm:text-lg font-semibold text-[#3D2B1A] dark:text-[#F5EAD9]">
                  Latest Videos
                </h3>
                <span className="text-[11px] sm:text-xs text-[#8C7456] dark:text-[#9C8569] bg-white/80 dark:bg-[#241B14]/80 px-2.5 py-0.5 rounded-full border border-[#F4B400]/15">
                  {latestVideos.length} new
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {latestVideos.map((video, index) => {
                const tone = getTone(video.category);
                return (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -3 }}
                    onClick={() => handleOpenModal(video)}
                    className="group relative bg-white dark:bg-[#241B14] rounded-xl border border-[#F4B400]/20 dark:border-[#F4B400]/20 overflow-hidden hover:shadow-lg dark:hover:shadow-black/40 transition-all duration-300 hover:border-[#F4B400]/40 flex flex-col cursor-pointer"
                  >
                    <div className="relative w-full aspect-video overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm text-white text-[9px] rounded flex items-center gap-1">
                        <FaClock className="w-2.5 h-2.5" />
                        {video.duration}
                      </div>
                      <div className={`absolute top-1.5 left-1.5 px-2 py-0.5 ${tone.bg} text-white text-[9px] font-medium rounded-full shadow-lg capitalize`}>
                        {video.category}
                      </div>
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center transition-opacity duration-300">
                        <div className="w-10 h-10 rounded-full text-white flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #E8742C, #F4B400)' }}>
                          <FaPlay className="w-3.5 h-3.5 ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col p-3.5 sm:p-4">
                      <h4 className="text-sm sm:text-[15px] font-semibold text-[#3D2B1A] dark:text-[#F5EAD9] line-clamp-2 leading-snug group-hover:text-[#E8742C] dark:group-hover:text-[#F4B400] transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-xs text-[#8C7456] dark:text-[#9C8569] mt-1 flex items-center gap-1">
                        <FaUserCircle className="w-3 h-3" />
                        {video.speaker}
                      </p>
                      {video.description && (
                        <p className="text-xs text-[#6B5640] dark:text-[#B8A088] mt-2 line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-3">
                        <div className="flex items-center gap-3 text-[11px] text-[#8C7456] dark:text-[#9C8569]">
                          <span className="flex items-center gap-1">
                            <FaEye className="w-3 h-3" />
                            {formatViews(video.views)}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] capitalize ${tone.chip} ${tone.text}`}>
                            {video.category}
                          </span>
                        </div>

                        <button
                          onClick={(e) => { e.stopPropagation(); handleLike(video.id); }}
                          className="p-1.5 rounded-full hover:bg-[#E8742C]/10 dark:hover:bg-[#E8742C]/20 transition-colors shrink-0"
                        >
                          {isLiked(video.id) ? (
                            <FaHeart className="w-4 h-4 text-[#C0392B] dark:text-[#E8674F]" />
                          ) : (
                            <FaRegHeart className="w-4 h-4 text-[#C9B89C] dark:text-[#5C4630] hover:text-[#C0392B] dark:hover:text-[#E8674F] transition-colors" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* See All Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center mt-8"
            >
              <Link
                href="/spiritual-videos"
                className="group inline-flex items-center px-6 py-2.5 text-white font-medium rounded-full transition-all duration-300 hover:scale-105 text-sm shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #E8742C, #F4B400)',
                  boxShadow: '0 4px 20px rgba(244,180,0,0.3)',
                }}
              >
                See All Videos
                <FaArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-xs text-[#8C7456] dark:text-[#9C8569] mt-2">
                Explore our complete collection of spiritual videos
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={modalVideo}
        isOpen={!!modalVideo}
        onClose={handleCloseModal}
        onNext={handleNext}
        onPrev={handlePrev}
        onLike={handleLike}
        isLiked={modalVideo ? isLiked(modalVideo.id) : false}
        isPlaying={modalVideo ? playingId === modalVideo.id : false}
        onPlay={handleTogglePlay}
      />
    </section>
  );
}
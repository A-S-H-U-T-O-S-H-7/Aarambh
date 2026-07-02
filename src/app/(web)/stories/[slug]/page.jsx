// app/(web)/stories/[slug]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaArrowLeft,
  FaArrowRight,
  FaBookOpen,
  FaCheck,
  FaClock,
  FaCopy,
  FaHeart,
  FaRegHeart,
  FaTwitter,
  FaUser,
  FaWhatsapp,
} from 'react-icons/fa';
import { getStoryById, getStoryBySlug, incrementStoryViews } from '@/lib/services/storyService';
import { stories as mockStories } from '@/lib/mockStoryData';

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storySlug = params?.slug?.toString() || '';

  const [story, setStory] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStory = async () => {
      setLoading(true);

      try {
        const bySlug = await getStoryBySlug(storySlug);
        if (bySlug.success && bySlug.story) {
          setStory(bySlug.story);
          await incrementStoryViews(bySlug.story.id);
          setLoading(false);
          return;
        }

        const byId = await getStoryById(storySlug);
        if (byId.success && byId.story) {
          setStory(byId.story);
          await incrementStoryViews(byId.story.id);
          setLoading(false);
          return;
        }

        const fallbackStory = mockStories.find((item) => {
          const generatedSlug = slugify(item.title);
          return generatedSlug === storySlug || String(item.id) === storySlug;
        });

        if (fallbackStory) {
          setStory({
            ...fallbackStory,
            id: fallbackStory.id,
            slug: fallbackStory.slug || slugify(fallbackStory.title),
            content: fallbackStory.fullStory || fallbackStory.description,
            description: fallbackStory.description || fallbackStory.fullStory,
            excerpt: fallbackStory.description || fallbackStory.fullStory,
            moral: fallbackStory.moral || '',
            featuredImage: fallbackStory.image || null,
            images: fallbackStory.image ? [fallbackStory.image] : [],
            category: fallbackStory.category || '',
            tags: fallbackStory.tags || [],
            author: fallbackStory.author || 'Aarambh',
            source: fallbackStory.source || 'Spiritual tradition',
            readingTime: fallbackStory.readingTime || 4,
            date: fallbackStory.date || '',
          });
        }
      } catch (error) {
        console.error('Error loading story:', error);
      } finally {
        setLoading(false);
      }
    };

    if (storySlug) {
      loadStory();
    } else {
      setLoading(false);
    }
  }, [storySlug]);

  const handleLike = () => setIsLiked((prev) => !prev);

  const handleCopy = async () => {
    if (!story) return;

    const text = `📖 ${story.title}\n\n${story.description || story.excerpt || ''}\n\nRead more at: ${window.location.href}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleShare = (platform) => {
    if (!story) return;

    const url = window.location.href;
    const text = `📖 ${story.title} - ${story.description || story.excerpt || ''}`;
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-brown-900 dark:text-cream-50">Story not found</h2>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center mt-4 text-gold hover:text-saffron transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Stories
          </button>
        </div>
      </div>
    );
  }

  const storyImage = story.featuredImage || story.image || story.images?.[0] || '';
  const storyBody = story.content || story.fullStory || '';
  const hasHtmlContent = typeof storyBody === 'string' && /<\/?[a-z][\s\S]*>/i.test(storyBody);

  const getCategoryColor = (category) => {
    const colors = {
      ramayana: 'text-orange-600 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400',
      mahabharata: 'text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400',
      saints: 'text-purple-600 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400',
      parable: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400',
    };
    return colors[category] || 'text-gray-600 bg-gray-50 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      ramayana: '🏹',
      mahabharata: '⚔️',
      saints: '🕉️',
      parable: '💡',
    };
    return emojis[category] || '📖';
  };

  return (
    <div className="min-h-screen py-8 md:py-12 lg:py-16 relative overflow-hidden bg-gradient-to-b from-cream-50/30 via-white to-cream-50/30 dark:from-brown-900/20 dark:via-brown-900 dark:to-brown-900/20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-brown-600 dark:text-cream-50/60 hover:text-saffron transition-colors text-sm group"
          >
            <FaArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Stories
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-brown-800/80 backdrop-blur-sm rounded-2xl border border-gold/20 dark:border-gold/10 shadow-xl overflow-hidden"
        >
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px]">
            {storyImage ? (
              <Image src={storyImage} alt={story.title} fill className="object-cover" priority />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-saffron/20 to-gold/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-4">
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(story.category)} shadow-lg`}>
                <span>{getCategoryEmoji(story.category)}</span>
                <span className="capitalize">{story.category || 'spiritual'}</span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 lg:p-10">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brown-900 dark:text-cream-50 mb-3">
                {story.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-brown-600 dark:text-cream-50/60">
                <span className="flex items-center space-x-1">
                  <FaUser className="w-4 h-4" />
                  <span>{story.author || 'Aarambh'}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <FaClock className="w-4 h-4" />
                  <span>{story.readingTime || 4} min read</span>
                </span>
                {story.date ? (
                  <span className="flex items-center space-x-1">
                    <FaBookOpen className="w-4 h-4" />
                    <span>{story.date}</span>
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {(story.tags || []).map((tag, index) => (
                  <span key={index} className="px-2 py-0.5 bg-gold/10 text-gold text-xs rounded-full">
                    #{tag.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6 p-4 bg-cream-50 dark:bg-brown-900/50 rounded-xl border border-gold/10">
              <p className="text-sm text-brown-700 dark:text-cream-50/80 italic">
                “{story.description || story.excerpt || ''}”
              </p>
            </div>

            <div className="prose prose-brown dark:prose-invert max-w-none">
              {hasHtmlContent ? (
                <div className="text-brown-800 dark:text-cream-50/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: storyBody }} />
              ) : (
                <div className="text-brown-800 dark:text-cream-50/90 leading-relaxed whitespace-pre-line">
                  {storyBody}
                </div>
              )}
            </div>

            {story.moral && (
              <div className="mt-8 p-6 bg-gradient-to-r from-saffron/10 to-gold/10 dark:from-saffron/20 dark:to-gold/20 rounded-xl border border-gold/20">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <h3 className="text-sm font-semibold text-gold">Moral of the Story</h3>
                    <p className="text-sm text-brown-700 dark:text-cream-50/80 mt-1">{story.moral}</p>
                  </div>
                </div>
              </div>
            )}

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
                  {copied ? <FaCheck className="w-4 h-4 text-green-500" /> : <FaCopy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-brown-500 dark:text-cream-50/40">
            Enjoyed this story? Explore more inspiring tales in our{' '}
            <Link href="/stories" className="text-gold hover:text-saffron transition-colors">
              Story Library
            </Link>
          </p>
          <Link
            href="/stories"
            className="inline-flex items-center mt-3 text-sm text-gold hover:text-saffron transition-colors group"
          >
            Browse All Stories
            <FaArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}